/// <reference path="../../typings/globals/cannon/index.d.ts" />
import { StateProperty } from "../helpers/StateProperty";
let CANNON = require('cannon');

export class SimulationState {
    public position: StateProperty<CANNON.Vec3>;
	public orientation: StateProperty<CANNON.Vec3>;

	constructor () {
		this.position = new StateProperty<CANNON.Vec3>(new CANNON.Vec3(0,0,0));
		this.orientation = new StateProperty<CANNON.Vec3>(new CANNON.Vec3(0,0,0)); 
	}
}