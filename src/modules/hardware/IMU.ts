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
			BoardService.getBoard(Configuration.imu.board).then((board) => {
				console.log('imu start');
				
				let five: any = require("johnny-five");
				this.imu = new five.IMU({
					board: board,
					controller: "BNO055",
					enableExternalCrystal: false,
					calibrationMask: 48
				});
				//console.log(this.imu);
				this.configureActions();
				console.log('actions ready');
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

		console.log('setup!!');

		this.imu.on("calibration", (calibration: any) => {
			console.log('calibration!');
			if(calibration == 179) {
				state.current.calibratedImu.setValue(true);
			}
		});

		this.imu.on("change", function(err:any, data:any) {
			console.log('data');
			console.log("Accelerometer: %d, %d, %d", this.accelerometer.x, this.accelerometer.z, this.accelerometer.z);
			console.log("Gyro: %d, %d, %d", this.gyro.x, this.gyro.z, this.gyro.z);
			console.log("Temperature: %d", this.temperature.celsius);
			console.log('---');
		});

		this.imu.on("data", function(err:any, data:any) {
			/*
			console.log('data');
			console.log("Accelerometer: %d, %d, %d", this.accelerometer.x, this.accelerometer.z, this.accelerometer.z);
			console.log("Gyro: %d, %d, %d", this.gyro.x, this.gyro.z, this.gyro.z);
			console.log("Temperature: %d", this.temperature.celsius);
			console.log('---');
			*/
		});

		this.imu.orientation.on("change", function(err:any, data:any) {
			console.log(' orientation: ');
			console.log("  heading      : ", this.euler.heading);
			console.log("  roll         : ", this.euler.roll);
			console.log("  pitch        : ", this.euler.pitch);
			state.current.orientation.setValue(this.quarternion);
			console.log('---');
		});
	}
}