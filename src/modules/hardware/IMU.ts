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

				this.imu.on("calibration", (calibration: any) => {
					console.log('calibrating...');
					resolve();
					if(calibration == 179) {
						console.log('calibration complete!');
						this.state.current.calibratedImu.setValue(true);
					}
				});
				
				console.log('actions ready');
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

		this.imu.on("change", function(err:any, data:any) {
			state.current.accelerometer.setValue({
				// TODO: re-map vector 90 deg CW
				vector: new CANNON.Vec3(this.accelerometer.x, this.accelerometer.y, this.accelerometer.z),
				acceleration: this.accelerometer.acceleration
			});
			state.current.gyroscope.setValue(new CANNON.Vec3(this.gyro.x, this.gyro.y, this.gyro.z));
			state.current.temperature.setValue(this.thermometer.celsius);
		});

		this.imu.orientation.on("change", function(err:any, data:any) {
			// TODO: re-map quaternion 90 deg CW
			let q = new CANNON.Quaternion(this.quarternion.x,this.quarternion.y,this.quarternion.z,this.quarternion.w);
			state.current.orientation.setValue(q);
		});
	}
}