export enum InitializationMode {
	NORMAL = 0,
	SIMULATION = 1
}

export enum BoardsIds {
	arduino = 0,
	raspberry = 1
}

export interface IDroneConfiguration {
	mode: InitializationMode;
	communication: {
		hostname: string,
		tcpPort: number,
		udpPort: number
	};
	battery: {
		voltageMin: number,
		voltageMax: number,
		voltageStore: number
	};
	motors: {
		pwmRange: Array<number>,
		board: BoardsIds,
		pins: {
			fl: number,
			fr: number,
			bl: number,
			br: number
		}
	};
	imu: {
		board: BoardsIds
	};
}
