import { DroneState } from "../states/DroneState";
let CANNON = require('cannon');

export class FlightControl {
	private state: DroneState;

	constructor (state: DroneState) {
		this.state = state;
		this.configureActions();
	}

	private configureActions() {
		let position: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
		let orientation: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
		this.state.flight
			.getStream()
			.changes()
			.onValue((flightState) => {
				let steeringFactor = 0.05;

				this.state.engines.setValue({
					flEngine: {
						throttle: (flightState.pitch + flightState.roll) * steeringFactor + flightState.throttle   
					},
					frEngine: {
						throttle: (flightState.pitch - flightState.roll) * steeringFactor + flightState.throttle
					},
					rlEngine: {
						throttle: (-flightState.pitch + flightState.roll) * steeringFactor + flightState.throttle
					},
					rrEngine: {
						throttle: (-flightState.pitch - flightState.roll) * steeringFactor + flightState.throttle
					}
				});
			});
	}
}