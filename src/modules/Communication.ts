/// <reference path="../../typings/globals/baconjs/index.d.ts" />
let Bacon = require('baconjs');

import { Utils } from "../helpers/Utils";
import { DirectConnection } from "../helpers/DirectConnection";
import { DroneState } from "../states/DroneState";

export class Communication {
	private state: DroneState;
	private connection: DirectConnection;

	constructor (state: DroneState) {
		this.state = state;
		this.initConnection();
		this.configureStreaming();
	}

	private initConnection() {
		this.connection = new DirectConnection({
			events: {
				connected: () => {
					console.log('connected!');
				},
				disconnected: () => {
					console.log('disconnected!');
					this.state.communication.connected.setValue(false);
				},
				messageReceived: (message: any) => {
					this.handleMessageReceived(message);
				},
				readyToSend: (ready:boolean) => {
					console.log('ready to send', ready);
					this.state.communication.connected.setValue(ready);

					this.connection.sendDataUsingFastChannel('hola');
					this.connection.sendDataUsingFastChannel({a: 'hola'});
				}
			}
		});
		this.connection.connect();
	}

	private configureStreaming() {
		Bacon.when([
					this.state.simulation.position.getStream(),
					this.state.simulation.orientation.getStream().changes()
				],
				(position: any, orientation: any) => {
					return {
						position: position,
						orientation: orientation
					}
				}
			)
			.skipDuplicates()
			.skipWhile(this.state.communication.connected.getStream().map(Utils.negate))
			.onValue((state:any) => {
				this.connection.sendDataUsingFastChannel({
					simulation: {
						position: state.position,
						orientation: state.orientation
					}
				});
			});
	}

	private handleMessageReceived(data: any) {
		try {
			if(data.joystick !== undefined) {
				this.state.flight.setValue(data.joystick);
			}
		} catch(e) {
			console.log('Error! Failed to parse message from client');
		}
	}
}