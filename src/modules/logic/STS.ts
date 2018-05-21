import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'

export class STS implements DroneModule {
	public name: string = 'Steering Translation System (STS)';
	private state: DroneState;
	private disposers: Array<any> = [];

	constructor () {

	}

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.configureActions();
			resolve();
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

	private configureActions() {
		// TODO: MOVE THIS TO ANOTHER MODULE.
		this.disposers.push(this.state.current.accelerometer
			.getStream()
			.changes()
			.filter(a => a.acceleration > 15)
			.onValue((steeringState) => {
				console.log('collision detected!!');
			}));
		// ----------------------------------

		this.disposers.push(this.state.target.steering
			.getStream()
			.changes()
			.onValue((steeringState) => {
				let steeringFactor = 0.03;

				if(steeringState.throttle < 0.01) {
					steeringState.throttle = 0;
					steeringFactor = 0;
				}

				this.state.target.engines.setValue({
					fl: {
						throttle: (steeringState.pitch + steeringState.roll - steeringState.yaw) * steeringFactor + steeringState.throttle
					},
					fr: {
						throttle: (steeringState.pitch - steeringState.roll + steeringState.yaw) * steeringFactor + steeringState.throttle
					},
					bl: {
						throttle: (-steeringState.pitch + steeringState.roll + steeringState.yaw) * steeringFactor + steeringState.throttle
					},
					br: {
						throttle: (-steeringState.pitch - steeringState.roll - steeringState.yaw) * steeringFactor + steeringState.throttle
					}
				});
			}));
	}
}
