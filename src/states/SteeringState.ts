import { StateProperty } from '../helpers/StateProperty';

export interface ISteeringValue {
	yaw: number;
	pitch: number;
	roll: number;
	throttle: number;
}

export class SteeringState extends StateProperty<ISteeringValue> {
	constructor() {
		super({
			yaw: 0,
			pitch: 0,
			roll: 0,
			throttle: 0
		});
	}
}
