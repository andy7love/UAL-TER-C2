import { DroneState } from "../../states/DroneState";
import { DroneModule } from "../../interfaces/Module";

export class EnginesController implements DroneModule {
	public name: string = 'Engines Controller';
	private state: DroneState;
	private disposers: Array<any> = [];
	private enabled: boolean = false;

	constructor () {

	}

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.configureActions(() => {
				resolve();
			});
		});
	}

	public disable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.disposers.forEach(dispose => {
				dispose();
			});
			resolve();
		});
	}

	private configureActions(cb: Function) {
		let five = require("johnny-five");
		let Raspi;
		try {
			Raspi = require("raspi-io");
		} catch (er) {
			Raspi = null;
			throw "Raspi-io not installed!";
		}

		var ports = [
			{ id: "A", port: "/dev/ttyACM0" },
			{ id: "rpi", io: new Raspi() }
		];

		console.log('Waiting for boards...');

		let arduino;
		let rpi;
		var esc: any;

		var initMotors = () => {
			esc = new five.ESC({
				pwmRange: [2000,1000],
				pin: 9
			});

			setTimeout(() => {
				esc.speed(100);
				console.log('100');
			}, 100);

			setTimeout(() => {
				esc.speed(0);
				console.log('0');
				this.enabled = true;
				cb();
			}, 1000);
		};

		var board = new five.Boards(ports).on("ready", function() {
			arduino = this[0];
			rpi = this[1];
			initMotors();
		});
		
        this.disposers.push(this.state.target.engines
            .getStream()
            .changes()
            .onValue((enginesState) => {
				if(this.enabled) {
					esc.speed(enginesState.blEngine.throttle*100);
				}
            }));
	}
}