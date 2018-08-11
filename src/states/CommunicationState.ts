import { StateProperty } from '../helpers/StateProperty';

export class CommunicationState {
	public connected: StateProperty<boolean>;
	public ping: StateProperty<number>;

	constructor() {
		this.connected = new StateProperty<boolean>(false);
		this.ping = new StateProperty<number>(0);
	}
}
