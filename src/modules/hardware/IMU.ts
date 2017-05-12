/// <reference path="../../../typings/globals/cannon/index.d.ts" />
import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module';
import { Utils } from '../../helpers/Utils';
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
				let five: any = require("johnny-five");
				this.imu = new five.IMU({
					board: board,
					controller: "BNO055",
					enableExternalCrystal: false,
					calibrationMask: 48
				});

				this.configureActions();

				this.imu.on("calibration", (calibration: any) => {
					resolve();
					if(calibration == 179) {
						console.log('IMU calibration complete!');
						this.state.current.calibratedImu.setValue(true);
					}
				});
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
			console.log("---------------------");
			console.log("  heading      : ", this.euler.heading);
			console.log("  roll         : ", this.euler.roll);
			console.log("  pitch        : ", this.euler.pitch);
			console.log("---------------------");

			let q = new CANNON.Quaternion(this.quarternion.x,this.quarternion.y,this.quarternion.z,this.quarternion.w);
			let rot = new CANNON.Quaternion();
			rot.setFromAxisAngle(new CANNON.Vec3(0,1,0), Utils.toRadians(-90));
			let qp = rot.mult(q);
			state.current.orientation.setValue(qp);
		});
	}
}