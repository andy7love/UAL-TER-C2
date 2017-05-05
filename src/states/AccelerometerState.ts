/// <reference path="../../typings/globals/cannon/index.d.ts" />
import { StateProperty } from "../helpers/StateProperty";
let CANNON = require('cannon');

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