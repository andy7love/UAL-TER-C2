/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />

interface DirectConnectionSettings {
    events: {
        connected: () => void,
        disconnected: () => void,
        readyToSend: (ready: boolean) => void,
        messageReceived: (data: any) => void
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
    private tcpServer: any;
    private udpServer: any;

    constructor(settings: DirectConnectionSettings) {
        this.settings = settings;
        this.kalm = require('kalm');
    }

    public connect(): void {
        // Enable this when start using LTE-4G-3G connections.
        // Can be used for NAT 
        //this.socket = require('socket.io-client')(this.signalingServerURL);
        //----------------------------------------------------------------------

        this.createReliableDataChannel(); 
        this.createFastDataChannel();
    }

    public disconnect() {
        this.closeConnection();
    }

    private createReliableDataChannel() {
        this.tcpServer = new this.kalm.Server({
            port: 6000,
            adapter: 'tcp',
            encoder: 'json',
            channels: {
                clientMessage: (data:any) => {
                    this.receiveMessage(data);
                },
                pang: (data:any) => {
                    console.log(data);
                    this.tcpServer.whisper('pung', {a: 'pong!'});
                },
                messageEvent: (data:any) => {
                    console.log('User sent message ' + data.body);
                }
            }
        });

		this.tcpServer.on('ready', () => {
			console.log('TCP Server is listening on port 6000');
		});

		this.tcpServer.on('error', (error:any) => {
			console.log('ERROR: ', error);
		});

		this.tcpServer.on('connect', (socket:any) => {
			console.log('Client connected - ', this.tcpServer.connections.length);
            this.isPeerConnectionStarted = true;  
            this.settings.events.connected();
            this.handleReliableChannelStateChange();
            socket.on("error", (error:any) => {
                if(	error.code != 'ECONNREFUSED' &&
                    error.code != 'ECONNRESET' ) {
                    console.log('TCP ERROR: ', error);
                }
            });
		});

		this.tcpServer.on('disconnect', (socket:any) => {
			console.log('Client disconnected');
            this.isPeerConnectionStarted = false;
            this.settings.events.disconnected();
            this.handleReliableChannelStateChange();
		});
    }

    private createFastDataChannel() {
        this.udpServer = new this.kalm.Server({
            port: 7000,
            adapter: 'udp',
            encoder: 'json',
            channels: {
                clientMessage: (data:any) => {
                    console.log(data);
                    this.udpServer.whisper('test', {a: 'bye!'});
                    this.receiveMessage(data);
                }
            }
        });

		this.udpServer.on('ready', () => {
			console.log('UDP Server is listening on port 7000');
		});

		this.udpServer.on('error', (error:any) => {
			console.log('ERROR: ', error);
		});
    }

    private receiveMessage(data: any) {
        this.settings.events.messageReceived(data);
    }

    private handleReliableChannelStateChange() {
        let readyToSend = this.isReadyToSend();
        this.settings.events.readyToSend(readyToSend);
    }

    public isReadyToSend(): boolean {
        return this.isPeerConnectionStarted;
    }

    public sendDataUsingReliableChannel(data: any) {
        if(this.isPeerConnectionStarted) {
            this.tcpServer.broadcast('droneMessage', data);  
        }
    }

    public sendDataUsingFastChannel(data: any) {
        if(this.isPeerConnectionStarted) {
            this.udpServer.broadcast('droneMessage', data);
        }
    }

    private closeConnection() {
        this.isPeerConnectionStarted = false;
        this.handleReliableChannelStateChange();
        this.tcpServer.stop();
        this.udpServer.stop();
    }
}