/// <reference path="../../../typings/globals/cannon/index.d.ts" />
import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'
import BoardService from "../../services/BoardService";
import Configuration from '../../services/ConfigurationService';
let CANNON = require('cannon');

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
			state.current.accelerometer.setValue(new CANNON.Vec3(this.accelerometer.x, this.accelerometer.y, this.accelerometer.z));
			state.current.gyroscope.setValue(new CANNON.Vec3(this.gyro.x, this.gyro.y, this.gyro.z));
			state.current.temperature.setValue(this.temperature.celsius);
		});

		this.imu.orientation.on("change", function(err:any, data:any) {
			console.log(this.quaternion);
			state.current.orientation.setValue(this.quarternion);
		});
	}
}