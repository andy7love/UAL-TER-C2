/// <reference path="../../../typings/globals/baconjs/index.d.ts" />
let Bacon = require('baconjs');

import { Utils } from "../../helpers/Utils";
import { DirectConnection } from "../../helpers/DirectConnection";
import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'

export class Communication implements DroneModule {
	public name: string = 'Communication';
	private state: DroneState;
	private connection: DirectConnection;
	private disposers: Array<any> = [];

	constructor () {

	}

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

	private initConnection(cb: Function) {
		this.connection = new DirectConnection({
			events: {
				messageReceived: (message: any) => {
					this.handleMessageReceived(message);
				},
				readyToSend: (ready:boolean) => {
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
		this.disposers.push(Bacon.when([
					this.state.simulation.position.getStream(),
					this.state.simulation.orientation.getStream().changes(),
					this.state.current.battery.getStream().changes(),
					this.state.current.orientation.getStream().changes()
				],
				(position: any, orientation: any, battery: any, cOrientation: any) => {
					return {
						simulation: {
							position: position,
							orientation: orientation
						},
						drone: {
							battery: battery,
							orientation: cOrientation
						}
					}
				}
			)
			.skipDuplicates()
			.skipWhile(this.state.communication.connected.getStream().map(Utils.negate))
			.onValue((state:any) => {
				console.log(state);
				this.connection.sendDataUsingFastChannel(state);
			}));
	}

	private handleMessageReceived(data: any) {
		try {
			if(data.joystick !== undefined) {
				this.state.target.steering.setValue(data.joystick);
			}
		} catch(e) {
			console.log('Error! Failed to parse message from client');
		}
	}
}