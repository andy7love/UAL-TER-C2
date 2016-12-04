import { StateProperty } from "../helpers/StateProperty";

interface FlightStateValue {
	yaw: number;
	pitch: number;
	roll: number;
	throttle: number;
}

export class FlightState extends StateProperty<FlightStateValue> {
	constructor () {
		super({
			yaw: 0,
			pitch: 0,
			roll: 0,
			throttle: 0
		});
	}
}