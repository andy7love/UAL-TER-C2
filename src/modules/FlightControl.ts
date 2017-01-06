import { DroneState } from "../states/DroneState";
import { DroneModule } from '../interfaces/Module'
let CANNON = require('cannon');

export class FlightControl implements DroneModule {
	public name: string = 'Flight Control';
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
		let position: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
		let orientation: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
		this.disposers.push(this.state.flight
			.getStream()
			.changes()
			.onValue((flightState) => {
				let steeringFactor = 0.03;

				this.state.engines.setValue({
					flEngine: {
						throttle: (flightState.pitch + flightState.roll - flightState.yaw) * steeringFactor + flightState.throttle   
					},
					frEngine: {
						throttle: (flightState.pitch - flightState.roll + flightState.yaw) * steeringFactor + flightState.throttle
					},
					rlEngine: {
						throttle: (-flightState.pitch + flightState.roll + flightState.yaw) * steeringFactor + flightState.throttle
					},
					rrEngine: {
						throttle: (-flightState.pitch - flightState.roll - flightState.yaw) * steeringFactor + flightState.throttle
					}
				});
			}));
	}
}