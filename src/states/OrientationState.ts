import { StateProperty } from '../helpers/StateProperty';
import * as CANNON from 'cannon';

export class OrientationState extends StateProperty<CANNON.Quaternion> {
	constructor() {
		super(new CANNON.Quaternion(0, 0, 0, 1));
	}
}
