export enum InitializationMode {
    NORMAL = 0,
    SIMULATION = 1
}

export interface DroneConfiguration {
    mode: InitializationMode, 
    communication: {
        hostname: string,
        tcpPort: number,
        udpPort: number
    }
}