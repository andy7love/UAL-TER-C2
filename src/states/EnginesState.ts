import { StateProperty } from '../helpers/StateProperty';

export enum EnginePosiions {
	frontLeft,
	frontRight,
	backLeft,
	backRight
}

export interface IEngineStateValue {
	throttle: number;
}

export interface IEnginesGroupStateValue {
	fl: IEngineStateValue; // 4 CW
	fr: IEngineStateValue; // 3 CCW
	bl: IEngineStateValue; // 1 CCW
	br: IEngineStateValue; // 2 CW
}

export class EnginesState extends StateProperty<IEnginesGroupStateValue> {
	constructor() {
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
