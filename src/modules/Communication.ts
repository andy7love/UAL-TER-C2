import { Utils } from "../helpers/Utils";
import { WebRTCConnection } from "../helpers/WebRTCConnection";
import { DroneState } from "../states/DroneState";

export class Communication {
	private state: DroneState;
	private connection: WebRTCConnection;

	constructor (state: DroneState) {
		this.state = state;
		this.initConnection();
		this.configureStreaming();
	}

	private initConnection() {
		this.connection = new WebRTCConnection({
			events: {
				connected: () => {
					console.log('connected!');
				},
				disconnected: () => {
					console.log('disconnected!');
					this.state.communication.connected.setValue(false);
				},
				messageReceived: (message) => {
					this.handleMessageReceived(message);
				},
				readyToSend: (ready:boolean) => {
					console.log('ready to send', ready);
					this.state.communication.connected.setValue(ready);
				}
			}
		});
		this.connection.connect();
	}

	private configureStreaming() {
		this.state.simulation.position.getStream()
			.zip(this.state.simulation.orientation.getStream().toEventStream(), (position: any, orientation: any) => {
				return {
					position: position,
					orientation: orientation
				}
			})
			.skipDuplicates()
			.skipWhile(this.state.communication.connected.getStream().map(Utils.negate))
			.onValue((state) => {
				this.connection.sendDataUsingFastChannel({
					simulation: {
						position: state.position,
						orientation: state.orientation
					}
				});
			});
	}

	private handleMessageReceived(message: string) {
		try {
			let data: any = JSON.parse(message);
			if(data.joystick !== undefined) {
				this.state.flight.setValue(data.joystick);
			}
		} catch(e) {
			console.log('Error! Failed to parse message from client');
		}
	}
}