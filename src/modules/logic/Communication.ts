import * as Bacon from 'baconjs';
import { Utils } from '../../helpers/Utils';
import { DirectConnection } from '../../helpers/DirectConnection';
import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';

export class Communication implements IDroneModule {
	public name: string = 'Communication';
	private state: DroneState;
	private connection: DirectConnection;
	private disposers: Array<any> = [];

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.initConnection(() => {
				resolve();
			});
			this.configureStreaming();
		});
	}

	public disable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.connection.disconnect();
			this.disposers.forEach(dispose => {
				dispose();
			});
			resolve();
		});
	}

	private initConnection(cb: () => void) {
		this.connection = new DirectConnection({
			events: {
				messageReceived: (message: any) => {
					this.handleMessageReceived(message);
				},
				readyToSend: (ready: boolean) => {
					this.state.communication.connected.setValue(ready);
				},
				started: () => {
					cb();
				}
			}
		});
		this.connection.connect();
	}

	private configureStreaming() {
		const commData = Bacon.combineTemplate({
			simulation: {
				position: this.state.simulation.position.getStream(),
				orientation: this.state.simulation.orientation.getStream()
			},
			drone: {
				battery: this.state.current.battery.getStream(),
				orientation: this.state.current.orientation.getStream()
			}
		});

		this.disposers.push(commData
			.changes()
			.skipDuplicates()
			.skipWhile(this.state.communication.connected.getStream().map(Utils.negate))
			.onValue((state: any) => {
				this.connection.sendDataUsingFastChannel(state);
			}));
	}

	private handleMessageReceived(data: any) {
		try {
			if (data.joystick !== undefined) {
				this.state.target.steering.setValue(data.joystick);
			}
		} catch (e) {
			console.log('Error! Failed to parse message from client');
		}
	}
}
