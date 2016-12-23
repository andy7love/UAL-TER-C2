/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />

interface DirectConnectionSettings {
    events: {
        connected: () => void,
        disconnected: () => void,
        readyToSend: (ready: boolean) => void,
        messageReceived: (data: string) => void
    }
}

export class DirectConnection {
    // Enable this when start using LTE-4G-3G connections. 
    private signalingServerURL: string = 'http://localhost:8080';
    private socket:SocketIOClient.Socket;
    // ----------------------------------------------------
    
    private kalm: any;
    private isPeerConnectionStarted: boolean = false;
    private settings: DirectConnectionSettings;

    constructor(settings: DirectConnectionSettings) {
        this.settings = settings;
        this.kalm = require('kalm');
    }

    public connect(): void {
        // Enable this when start using LTE-4G-3G connections. 
        //this.socket = require('socket.io-client')(this.signalingServerURL);  
        this.createReliableDataChannel(); 
        this.createFastDataChannel();
    }

    public disconnect() {
        // TODO!
    }

    private createReliableDataChannel() {
        let server = new this.kalm.Server({
            port: 6000,
            adapter: 'tcp',
            encoder: 'json',
            channels: {
                messageEvent: (data:any) => {
                    console.log('TCP User sent message ' + data.body);
                }
            }
        });

		server.on('ready', () => {
			console.log('TCP Server is listening on port 6000');
		});

		server.on('error', (error:any) => {
			console.log('ERROR: ', error);
		});

		server.on('connect', (socket:any) => {
			console.log('Client connected');
            server.broadcast('userEvent', 'A new user has connected');  
            socket.on("error", (error:any) => {
                if(	error.code != 'ECONNREFUSED' &&
                    error.code != 'ECONNRESET' ) {
                    console.log('TCP ERROR: ', error);
                }
            });
		});

		server.on('disconnect', (socket:any) => {
			console.log('Client disconnected');
		});
    }

    private createFastDataChannel() {
        let server = new this.kalm.Server({
            port: 7000,
            adapter: 'udp',
            encoder: 'json',
            channels: {
                messageEvent: (data:any) => {
                    console.log('UDP User sent message ' + data.body);
                }
            }
        });

		server.on('ready', () => {
			console.log('UDP Server is listening on port 7000');
		});

		server.on('error', (error:any) => {
			console.log('ERROR: ', error);
		});
    }

    private handleIncomingChannels(event: any) {
        /* TODO! needed??
        let receiveChannel: RTCDataChannel = event.channel;
        receiveChannel.onmessage = (event) => {
            this.receiveMessage(event);
        };
        */
    }

    private receiveMessage(event: any) {
        /* TODO!
        let data = event.data;
        this.settings.events.messageReceived(data);
        */
    }

    private handleReliableChannelStateChange() {
        let readyToSend = this.isReadyToSend();
        this.settings.events.readyToSend(readyToSend);
    }

    public isReadyToSend(): boolean {
        /* TODO! 
        return (this.isPeerConnectionStarted && 
            this.channels.reliable.channel.readyState === 'open');
        */
        return false;
    }

    public sendDataUsingReliableChannel(data: any) {
        /*
        TODO! 
        if(typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        if(this.isReadyToSend()) {
            this.channels.reliable.channel.send(data);
        } else {
            console.log('Warning! Reliable channel not ready to send data! - data lost');
        }
        */
    }

    public sendDataUsingFastChannel(data: any) {
        /*
        TODO!
        if(typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        if(this.isPeerConnectionStarted && this.channels.fast.channel.readyState === 'open') {
            this.channels.fast.channel.send(data);
        }
        */
    }

    private closeConnection() {
        this.isPeerConnectionStarted = false;
        /*
        TODO! 
        this.peerConnection.close();
        this.peerConnection = null;
        this.settings.events.disconnected();
        */
    }
}