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
				let enginesState = {
					throttle: flightState.throttle
				};
				/*
				position.y += 0.1 * flightState.throttle;
				orientation.x += 0.1 * (flightState.roll)*-1;
				orientation.y += 0.1 * flightState.yaw;
				orientation.z += 0.1 * flightState.pitch;
				*/
				this.state.engines.setValue({
					flEngine: enginesState,
					frEngine: enginesState,
					rlEngine: enginesState,
					rrEngine: enginesState
				});
			});
	}
}