import { IDroneConfiguration, BoardsIds } from '../interfaces/Configuration';

class BoardService {
	public static getBoard(boardId: BoardsIds): Promise<any> {
		if (BoardService.instance === null) {
			BoardService.instance = new BoardService();
		}

		return BoardService.instance.initBoards()
			.then(() => {
				return BoardService.instance.boards[boardId];
			});
	}

	public static getArduino(): Promise<any> {
		return BoardService.getBoard(BoardsIds.arduino);
	}

	public static getRaspberry(): Promise<any> {
		return BoardService.getBoard(BoardsIds.raspberry);
	}

	private static instance: BoardService = null;
	private boards: Array<any> = [];
	private initPromise: Promise<any> = null;

	private initBoards(): Promise<any> {
		if (this.initPromise === null) {
			this.initPromise = new Promise<string>((resolve, reject) => {
				const five: any = require('johnny-five');
				let raspiIO: any;
				let arduino: any;
				let raspberry: any;

				try {
					raspiIO = require('raspi-io');
				} catch (er) {
					raspiIO = null;
					reject('Raspi-io not installed!');
				}

				const ports = [
					{ id: 'A', port: '/dev/ttyACM0' },
					{ id: 'rpi', io: new raspiIO() }
				];

				console.log('Waiting for boards...');

				const assignBoards = () => {
					this.boards[BoardsIds.arduino] = arduino;
					this.boards[BoardsIds.raspberry] = raspberry;
				};

				const allBoards = new five.Boards(ports).on('ready', function() {
					arduino = this[0];
					raspberry = this[1];
					assignBoards();
					resolve();
				});
			});
		}
		return this.initPromise;
	}

}

export default BoardService;
