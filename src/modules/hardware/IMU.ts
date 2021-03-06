import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import BoardService from '../../services/BoardService';
import Configuration from '../../services/ConfigurationService';
import * as CANNON from 'cannon';

export class IMU implements IDroneModule {
	public name: string = 'Inertial Measurement Unit (IMU)';
	private state: DroneState;
	private disposers: Array<any> = [];
	private imu: any;

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			BoardService.getBoard(Configuration.imu.board).then(board => {
				const five: any = require('johnny-five');
				this.imu = new five.IMU({
					board,
					controller: 'BNO055',
					enableExternalCrystal: false,
					calibrationMask: 48
				});

				this.configureActions();

				this.imu.on('calibration', (calibration: any) => {
					resolve();
					if (calibration === 179) {
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
		const state = this.state;

		this.imu.on('change', function(err: any, data: any) {
			state.current.accelerometer.setValue({
				// TODO: re-map vector 90 deg CW
				vector: new CANNON.Vec3(this.accelerometer.x, this.accelerometer.y, this.accelerometer.z),
				acceleration: this.accelerometer.acceleration
			});
			state.current.gyroscope.setValue(new CANNON.Vec3(this.gyro.x, this.gyro.y, this.gyro.z));
			state.current.temperature.setValue(this.thermometer.celsius);
		});

		this.imu.orientation.on('change', function(err: any, data: any) {
			// TODO: re-map quaternion 90 deg CW
			try {
				let q = new CANNON.Quaternion();
				const rot = new CANNON.Quaternion();

				rot.set(this.quarternion.x, this.quarternion.y, this.quarternion.z, this.quarternion.w);
				q = q.mult(rot);
				// q = q.inverse();

				// rot.setFromAxisAngle(new CANNON.Vec3(0,1,0), Utils.toRadians(-90));
				// q = q.mult(rot);

				// rot.setFromAxisAngle(new CANNON.Vec3(0,0,1), Utils.toRadians(90));
				// q = q.mult(rot);

				state.current.orientation.setValue(rot);
			} catch (e) {
				console.log('warning error!');
				console.log(e);
			}
		});
	}
}
