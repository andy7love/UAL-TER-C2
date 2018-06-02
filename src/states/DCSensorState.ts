import { StateProperty } from '../helpers/StateProperty';

interface IDCSensorStateValue {
	voltage: number;
}

export class DCSensorState extends StateProperty<IDCSensorStateValue> {
	constructor() {
		super({
			voltage: 0
		});
	}
}
