import { DroneState } from "../../states/DroneState";
import { DroneModule } from "../../interfaces/Module";
import Configuration from '../../services/ConfigurationService';
import BoardService from "../../services/BoardService";

export class EnginesController implements DroneModule {
	public name: string = 'Engines Controller';
	private state: DroneState;
	private disposers: Array<any> = [];
	private enabled: boolean = false;
	private escs: {
		fl: any,
		fr: any,
		bl: any,
		br: any
	};

	constructor () {

	}

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return this.configureMotors()
				.then(this.armMotors.bind(this))
				.then(this.configureActions.bind(this));
	}

	public disable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.disarmMotors().then(() => {
				this.enabled = false;
				this.disposers.forEach(dispose => {
					dispose();
				});
				resolve();
			});
		});
	}

	private configureESC(pin: number) {
		let five: any = require("johnny-five");
		return new five.ESC({
			pwmRange: Configuration.motors.pwmRange,
			pin: pin
		});
	}

	private configureMotors(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			BoardService.getBoard(Configuration.motors.board).then((board) => {
				this.escs = {
					fl: this.configureESC(Configuration.motors.pins.fl),
					fr: this.configureESC(Configuration.motors.pins.fr),
					bl: this.configureESC(Configuration.motors.pins.bl),
					br: this.configureESC(Configuration.motors.pins.br)
				};
				resolve();
			});
		});
	}

	private armMotor(esc: any) {
		setTimeout(() => {
			esc.speed(100);
		}, 100);

		setTimeout(() => {
			esc.speed(0);
		}, 1000);
	}

	private armMotors(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.armMotor(this.escs.fl);
			this.armMotor(this.escs.fr);
			this.armMotor(this.escs.bl);
			this.armMotor(this.escs.br);

			setTimeout(() => {
				this.enabled = true;
				resolve();
			}, 1400);
		});
	}

	private disarmMotors(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if(this.enabled) {
				this.escs.fl.speed(0);
				this.escs.fr.speed(0);
				this.escs.bl.speed(0);
				this.escs.br.speed(0);
			}
			resolve();
		});
	}

	private configureActions(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.disposers.push(this.state.target.engines
				.getStream()
				.changes()
				.onValue((enginesState) => {
					if(this.enabled) {
						if(enginesState.fl.throttle > 0) {
							console.log(enginesState.fl.throttle);
						}
						
						this.escs.fl.speed(enginesState.fl.throttle*100);
						this.escs.fr.speed(enginesState.fr.throttle*100);
						this.escs.bl.speed(enginesState.bl.throttle*100);
						this.escs.br.speed(enginesState.br.throttle*100);
					}
				}));

			resolve();
		});
	}
}