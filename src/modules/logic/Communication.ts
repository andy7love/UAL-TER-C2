import * as Bacon from 'baconjs';
import { DirectConnection } from '../../helpers/DirectConnection';
import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import {
	IDroneRealTimeTelemetry,
	ClientRealTimeControlParser,
	DroneRealTimeTelemetryParser,
	Utils,
	IBatteryState
} from 'ual-ter-protocol';
import * as CANNON from 'cannon';

// TODO: move this to a Communication/RealTimeTelemetry
export interface IRealTimeTelemetryTemplate {
	battery: IBatteryState;
	orientation: CANNON.Quaternion;
	pong: number;
	simulation: {
		position: CANNON.Vec3,
		orientation: CANNON.Quaternion
	};
}

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
		const combinedProperty = Bacon.combineTemplate({
			battery: this.state.current.battery.getStream(),
			orientation: this.state.current.orientation.getStream(),
			pong: this.state.communication.ping.getStream(),
			simulation: {
				position: this.state.simulation.position.getStream(),
				orientation: this.state.simulation.orientation.getStream()
			}
		});

		const disposable = combinedProperty
			.changes()
			.skipDuplicates()
			.skipWhile(this.state.communication.connected.getStream().map(Utils.negate))
			.onValue((newState: IDroneRealTimeTelemetry) => {
				// Serializing Template.
				const data = DroneRealTimeTelemetryParser.serialize({
					battery: newState.battery,
					orientation: Utils.parseQuaternion(newState.orientation),
					pong: newState.pong,
					simulation: {
						orientation: Utils.parseQuaternion(newState.simulation.orientation),
						position: Utils.parseVector3(newState.simulation.position)
					}
				});

				this.connection.sendDataUsingFastChannel(data);
			});

		this.disposers.push(disposable);
	}

	private handleMessageReceived(data: any) {
		try {
			const realTimeControl = ClientRealTimeControlParser.parse(data);

			if (realTimeControl.joystick !== undefined) {
				this.state.target.steering.setValue(realTimeControl.joystick);
			}

			if (realTimeControl.ping !== undefined) {
				this.state.communication.ping.setValue(realTimeControl.ping);
			}

		} catch (e) {
			console.log('Error! Failed to parse message from client');
		}
	}
}
