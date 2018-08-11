import { StateProperty } from '../helpers/StateProperty';
import { IBatteryState } from 'ual-ter-protocol';

export class BatteryState extends StateProperty<IBatteryState> {
	constructor() {
		super({
			voltage: 0,
			percentage: 0,
			dischargeRate: 0,
			autonomy: 0
		});
	}
}
