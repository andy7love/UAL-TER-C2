/// <reference path="../../typings/globals/cannon/index.d.ts" />
import { StateProperty } from "../helpers/StateProperty";
let CANNON = require('cannon');

export class OrientationState extends StateProperty<CANNON.Quaternion> {
	constructor () {
		super(new CANNON.Quaternion(0,0,0,1));
	}
}