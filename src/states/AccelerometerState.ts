import { StateProperty } from '../helpers/StateProperty';
import * as CANNON from 'cannon';

interface IAccelerometerStateValue {
	vector: CANNON.Vec3;
	acceleration: number;
}

export class AccelerometerState extends StateProperty<IAccelerometerStateValue> {
	constructor() {
		super({
			vector: new CANNON.Vec3(0, 0, 0),
			acceleration: 0
		});
	}
}
