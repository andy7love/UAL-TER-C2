import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'
let CANNON = require('cannon');

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
		this.disposers.push(this.state.target.steering
			.getStream()
			.changes()
			.onValue((steeringState) => {
				let steeringFactor = 0.03;

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