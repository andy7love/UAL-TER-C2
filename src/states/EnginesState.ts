import { StateProperty } from "../helpers/StateProperty";

interface EngineStateValue {
	throttle: number;
}

interface EnginesStateValue {
	fl: EngineStateValue, // 4 CW
	fr: EngineStateValue, // 3 CCW
	bl: EngineStateValue, // 1 CCW
	br: EngineStateValue // 2 CW
}

export class EnginesState extends StateProperty<EnginesStateValue> {
	constructor () {
		super({
			fl: {
				throttle: 0
			},
			fr: {
				throttle: 0	
			},
			bl: {
				throttle: 0
			},
			br: {
				throttle: 0
			}
		});
	}
}