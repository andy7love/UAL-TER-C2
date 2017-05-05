/// <reference path="../../typings/globals/cannon/index.d.ts" />
import { StateProperty } from "../helpers/StateProperty";
let CANNON = require('cannon');

export class AccelerometerState extends StateProperty<CANNON.Vec3> {
	constructor () {
		super(new CANNON.Vec3(0,0,0));
	}
}