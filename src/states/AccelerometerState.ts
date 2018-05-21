import { StateProperty } from "../helpers/StateProperty";
import * as CANNON from 'cannon';

interface AccelerometerStateValue {
	vector: CANNON.Vec3,
	acceleration: Number
}

export class AccelerometerState extends StateProperty<AccelerometerStateValue> {
	constructor () {
		super({
			vector: new CANNON.Vec3(0,0,0),
			acceleration: 0
		});
	}
}
