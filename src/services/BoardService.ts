import { DroneConfiguration, BoardsIds } from '../interfaces/Configuration'

class BoardService {
	private static instance: BoardService = null;
    private boards: Array<any> = [];

	private constructor () {

	}

    private initBoards():Promise<any> {
        return new Promise<string>((resolve, reject) => {
            let five: any = require("johnny-five"),
                Raspi_IO: any,
                arduino: any,
                raspberry: any;

            try {
                Raspi_IO = require("raspi-io");
            } catch (er) {
                Raspi_IO = null;
                reject("Raspi-io not installed!");
            }

            let ports = [
                { id: "A", port: "/dev/ttyACM0" },
                { id: "rpi", io: new Raspi_IO() }
            ];

            console.log('Waiting for boards...');

            let assignBoards = () => {
                this.boards[BoardsIds.arduino] = arduino;
                this.boards[BoardsIds.raspberry] = raspberry;
            };

            let allBoards = new five.Boards(ports).on("ready", function() {
                arduino = this[0];
                raspberry = this[1];
                assignBoards();
                resolve();
            });
        });
    }

    public static getBoard(boardId: BoardsIds):Promise<any> {
        if(BoardService.instance === null)
            BoardService.instance = new BoardService();
        
        return BoardService.instance.initBoards()
            .then(() => {
                return BoardService.instance.boards[boardId];
            });
    }

    public static getArduino():Promise<any> {
        return BoardService.getBoard(BoardsIds.arduino);
    }

    public static getRaspberry():Promise<any> {
        return BoardService.getBoard(BoardsIds.raspberry);
    }
}

export default BoardService;