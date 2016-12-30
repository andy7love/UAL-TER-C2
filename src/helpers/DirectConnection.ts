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
    private hostname: string =  '0.0.0.0';

    private tcpPort: number = 6000;
    private tcpServer: net.Server = null;
    private tcpSockets: Array<net.Socket> = [];
    private tcpJsonSocket: any = null;

    private udpServer: dgram.Socket;
    private udpPort: number = 7000;
    private udpClientAddress: string = null;
    private udpClientPort: number = null;

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
        this.tcpJsonSocket = new this.jsonSocket(socket);
        this.tcpJsonSocket.on('message', (data:any) => {
            this.receiveMessage(data);
        });
        this.tcpSockets.push(socket);
        console.log('client connected!');
        this.handleReliableChannelStateChange();
    }

    private disconnectFromClient(socket: net.Socket) {
        var i = this.tcpSockets.indexOf(socket);
        if (i > -1)
            this.tcpSockets.splice(i, 1);

        console.log('client disconnected');
        this.handleReliableChannelStateChange();
    } 

    private createFastDataChannel() {
        this.udpServer = dgram.createSocket('udp4');

        this.udpServer.on('listening', () => {
            var address = this.udpServer.address();
            console.log('UDP Server listening on ' + address.address + ":" + address.port);
        });

        this.udpServer.on('message', (message, remote) => {
            this.udpClientAddress = remote.address;
            this.udpClientPort = remote.port;

            this.receiveMessage(JSON.parse(message.toString())); 
        });

        this.udpServer.bind(this.udpPort, this.hostname);
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
            this.tcpJsonSocket.sendMessage(data);
        }
    }

    public sendDataUsingFastChannel(data: any) {
        if(this.isReadyToSend() && this.udpClientAddress && this.udpClientPort) {
            var buff = new Buffer(JSON.stringify(data));
            this.udpServer.send(buff, 0, buff.length, this.udpClientPort, this.udpClientAddress);
        }
    }

    private closeConnection() {
        this.tcpServer.close();
        this.tcpServer.removeAllListeners();

        this.tcpSockets.forEach((socket) => {
            socket.removeAllListeners();
            socket.end();
        });
        this.tcpSockets = [];

        this.udpServer.removeAllListeners();
        this.udpServer.close();
        this.udpServer.unref();

        this.handleReliableChannelStateChange();
    }
}