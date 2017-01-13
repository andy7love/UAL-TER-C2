import { StateProperty } from "../helpers/StateProperty";

interface SteeringValue {
	yaw: number;
	pitch: number;
	roll: number;
	throttle: number;
}

export class SteeringState extends StateProperty<SteeringValue> {
	constructor () {
		super({
			yaw: 0,
			pitch: 0,
			roll: 0,
			throttle: 0
		});
	}
}