import { WebRTCConnection } from "../helpers/WebRTCConnection";

export module System {
	export class MyTest {
		private connection: WebRTCConnection;
		
		public log() {
			console.log('Hi!! im working and alive!!');

			this.connection = new WebRTCConnection({
				events: {
					connected: () => {
						console.log('connected!');
					},
					disconnected: () => {
						console.log('disconnected!');
					},
					messageReceived: (message) => {
						console.log('message received: ', message);
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
	}	
} 