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
				},
				messageReceived: (message) => {
					if(typeof message === 'string') {
						console.log('Message from client: ', message);
					} else {
						this.handleMessageReceived(message);
					}
				},
				readyToSend: (ready:boolean) => {
					console.log('ready to send', ready);
					if(ready === true) {
						this.connection.sendDataUsingReliableChannel('hey im drone!');
					}
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
			.skipWhile(this.state.communication.connected.getStream())
			.onValue((state) => {
				this.connection.sendDataUsingFastChannel({
					simulation: {
						position: {
							x: state.position.x,
							y: state.position.y,
							z: state.position.z
						},
						orientation: {
							x: state.orientation.x,
							y: state.orientation.y,
							z: state.orientation.z
						}
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