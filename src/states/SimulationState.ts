import { StateProperty } from "../helpers/StateProperty";
import * as CANNON from "cannon";

export class SimulationState {
    public position: StateProperty<CANNON.Vec3>;
	public orientation: StateProperty<CANNON.Quaternion>;

	constructor () {
		this.position = new StateProperty<CANNON.Vec3>(new CANNON.Vec3(0,0,0));
		this.orientation = new StateProperty<CANNON.Quaternion>(new CANNON.Quaternion(0,0,0,1));
	}
}
