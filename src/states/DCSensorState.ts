import { StateProperty } from "../helpers/StateProperty";

interface DCSensorStateValue {
	voltage: number
}

export class DCSensorState extends StateProperty<DCSensorStateValue> {
	constructor () {
		super({
			voltage: 0
		});
	}
}