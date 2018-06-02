import { IDroneModule } from '../interfaces/Module';
import { DroneState } from '../states/DroneState';
import chalk from 'chalk';

export class ModulesManager {
	private state: DroneState;
	private modules: Array<IDroneModule> = [];
	private moduleInitializationTimeout = 10000;

	constructor(state: DroneState) {
		this.state = state;
	}

	public loadModule(modulePath: string) {
		const moduleName = modulePath.split('/').pop();
		const moduleLib = require('../modules/' + modulePath);
		const moduleInstance = new moduleLib[moduleName]();
		this.add(moduleInstance);
	}

	public add(m: IDroneModule) {
		m.setState(this.state);
		this.modules.push(m);
	}

	public checkAll(): Promise<string> {
		console.log(chalk.cyan('Checking sequence started.'));

		return new Promise<string>((resolve, reject) => {
			const onShutdownEnd = () => {
				console.log(chalk.cyan('Shutdown checking complete.'));
				console.log(chalk.cyan('Checking sequence finished.'));
			};

			const onInitEnd = () => {
				console.log(chalk.cyan('Initialization checking complete.'));
				console.log(chalk.cyan('Systems will shutdown in 3 seconds.'));

				setTimeout(() => {
					this.disableAll().then(() => {
						onShutdownEnd();
						resolve();
					}, () => {
						onShutdownEnd();
						reject();
					});
				}, 3000);
			};

			this.enableAll().then(() => {
				onInitEnd();
			}, () => {
				onInitEnd();
			});
		});
	}

	public logStatus(status: string, message: string) {
		console.log(chalk.white('[ ') + status + chalk.white(' ] ') + chalk.white(message));
	}

	public enableAll(): Promise<string> {
		console.log(chalk.inverse('Initializing Modules'));

		return new Promise<string>((resolve, reject) => {
			let i = 0;
			let fails = 0;

			const onSuccessfull = (m: IDroneModule) => {
				this.logStatus(chalk.green('DONE'), m.name);
			};

			const onFail = (m: IDroneModule, message: string) => {
				fails++;
				this.logStatus(chalk.red('FAIL'), m.name);
				console.log(chalk.magenta(message));
			};

			const onEnd = () => {
				if (fails === 0) {
					this.logStatus(chalk.blue('ONLINE'), 'All modules successfully initialized.');
					resolve();
				} else {
					this.logStatus(chalk.red('ERROR'), fails + ' modules failed during initialization.');
					reject();
				}
			};

			const next = () => {
				i++;
				if (i < this.modules.length) {
					checkModule();
				} else {
					onEnd();
				}
			};

			const checkModule = () => {
				const m = this.modules[i];

				let timeout = setTimeout(() => {
					onFail(m, 'Timeout - No response.');
					next();
					timeout = null;
				}, this.moduleInitializationTimeout);

				m.enable().then(() => {
					if (timeout !== null) {
						onSuccessfull(m);
						next();
						clearTimeout(timeout);
						timeout = null;
					}
				}, (message: string) => {
					if (timeout !== null) {
						onFail(m, message);
						next();
						clearTimeout(timeout);
						timeout = null;
					}
				});

			};

			checkModule();
		});
	}

	public disableAll(): Promise<any> {
		console.log(chalk.inverse('Shutting down Modules'));

		const promises: Array<Promise<string>> = [];

		for (let i = (this.modules.length - 1); i >= 0; i--) {
			const promise = this.modules[i].disable();
			promise.catch(message => {
				this.logStatus(chalk.red('ERROR'), this.modules[i].name);
				console.log(chalk.magenta(message));
			});
			promises.push(promise);
		}

		console.log(chalk.grey('Shutdown command was sent to all modules.'));

		return Promise.all(promises).then(() => {
			this.logStatus(chalk.grey('SHUTDOWN'), 'All modules successfully disabled.');
		}, () => {
			this.logStatus(chalk.red('SHUTDOWN FAILED'), 'Some modules has failed during shutdown.');
		});
	}
}
