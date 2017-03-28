import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'
import BoardService from "../../services/BoardService";
import Configuration from '../../services/ConfigurationService';

export class IMU implements DroneModule {
	public name: string = 'Inertial Measurement Unit (IMU)';
	private state: DroneState;
	private disposers: Array<any> = [];
	private imu: any;

	constructor () {

	}

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			console.log(Configuration.imu.board);
			BoardService.getBoard(Configuration.imu.board).then((board) => {
				let five: any = require("johnny-five");
				this.imu = new five.IMU({
					board: board,
					controller: "BNO055",
					enableExternalCrystal: true,
					calibrationMask: 48
				});
				this.configureActions();
				resolve();
			});			
		});
	}

	public disable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.disposers.forEach(dispose => {
				dispose();
			});
			resolve();
		});
	}

	private configureActions() {
		var state = this.state;

		this.imu.on("calibration", (calibration: any) => {
			if(calibration == 179) {
				state.current.calibratedImu.setValue(true);
			}
		});

		this.imu.orientation.on("change", function() {
			state.current.orientation.setValue(this.quarternion);
		});
	}
}