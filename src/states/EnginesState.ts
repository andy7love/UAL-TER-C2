import { StateProperty } from "../helpers/StateProperty";

interface EngineStateValue {
	throttle: number;
}

interface EnginesStateValue {
	flEngine: EngineStateValue, // 4 CW
	frEngine: EngineStateValue, // 3 CCW
	blEngine: EngineStateValue, // 1 CCW
	brEngine: EngineStateValue // 2 CW
}

export class EnginesState extends StateProperty<EnginesStateValue> {
	constructor () {
		super({
			flEngine: {
				throttle: 0
			},
			frEngine: {
				throttle: 0	
			},
			blEngine: {
				throttle: 0
			},
			brEngine: {
				throttle: 0
			}
		});
	}
}