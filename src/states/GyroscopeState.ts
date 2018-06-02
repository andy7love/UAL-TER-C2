import { StateProperty } from '../helpers/StateProperty';
import * as CANNON from 'cannon';

export class GyroscopeState extends StateProperty<CANNON.Vec3> {
	constructor() {
		super(new CANNON.Vec3(0, 0, 0));
	}
}
