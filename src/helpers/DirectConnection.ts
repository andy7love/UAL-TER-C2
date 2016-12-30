/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />
import * as net from 'net';
import * as dgram from 'dgram';

interface DirectConnectionSettings {
    events: {
        readyToSend: (ready: boolean) => void,
        messageReceived: (data: any) => void
    }
}

export class DirectConnection {
    // Enable this when start using LTE-4G-3G connections. 
    private signalingServerURL: string = 'http://localhost:8080';
    private socket:SocketIOClient.Socket;
    // ----------------------------------------------------
    
    private settings: DirectConnectionSettings;
    private jsonSocket: any = null;
    private hostname: string =  '127.0.0.1';

    private tcpPort: number = 6000;
    private tcpServer: net.Server = null;
    private tcpSockets: Array<net.Socket> = [];

    //private udpServer: dgram.Socket;
    //private udpPort: number = 7000;

    constructor(settings: DirectConnectionSettings) {
        this.settings = settings;
        this.jsonSocket = require('json-socket');
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
        this.tcpServer = net.createServer((socket:net.Socket) => {
            socket.setKeepAlive(true, 0);
                  
            socket.on("error", (error:any) => {
                if(	error.code != 'ECONNREFUSED' &&
                    error.code != 'ECONNRESET' ) {
                    console.log('TCP ERROR: ', error);
                }
            });

            socket.on('close', (had_error) => {
                console.log('closed connection');
                this.disconnectFromClient(socket);
            });

            socket.on('end', () => {
                console.log('ended connection');
                this.disconnectFromClient(socket);
            });

            this.connectToClient(socket);
        });

        this.tcpServer.on('error', (err:any) => {
            console.log('error on tcp server!', err);
        });

        this.tcpServer.listen(this.tcpPort, this.hostname, () => {
            console.log('TCP Server is listening on port ', this.tcpPort);
        });
    }

    private connectToClient(socket: net.Socket) {
        var jsonSocket: any = new this.jsonSocket(socket);
        jsonSocket.on('message', (data:any) => {
            console.log('TCP! received data from client! - ', data);
            jsonSocket.sendMessage({
                message: 'Im server!'
            });
        });
        this.tcpSockets.push(socket);
        console.log('client connected!');
        this.handleReliableChannelStateChange();
    }

    private disconnectFromClient(socket: net.Socket) {
        var i = this.tcpSockets.indexOf(socket);
        if (i > -1)
            this.tcpSockets.splice(i, 1);

        console.log('Client disconnected');
        this.handleReliableChannelStateChange();
    } 

    private createFastDataChannel() {
        /*
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
        */
    }

    private receiveMessage(data: any) {
        this.settings.events.messageReceived(data);
    }

    private handleReliableChannelStateChange() {
        let readyToSend = this.isReadyToSend();
        this.settings.events.readyToSend(readyToSend);
    }

    public isReadyToSend(): boolean {
        return this.tcpSockets.length > 0;
    }

    public sendDataUsingReliableChannel(data: any) {
        if(this.isReadyToSend()) {
            //his.tcpServer.broadcast('droneMessage', data);  
        }
    }

    public sendDataUsingFastChannel(data: any) {
        if(this.isReadyToSend()) {
            //this.udpServer.broadcast('droneMessage', data);
        }
    }

    private closeConnection() {
        this.handleReliableChannelStateChange();
        
        this.tcpServer.close();
        this.tcpSockets.forEach((socket) => {
            socket.end();
        });
        this.tcpSockets = [];


        //this.udpServer.stop();
    }
}