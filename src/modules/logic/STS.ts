import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import { EnginePosiions } from '../../states/EnginesState';
import { ISteeringValue } from '../../states/SteeringState';

export class STS implements IDroneModule {
	public name: string = 'Steering Translation System (STS)';
	private state: DroneState;
	private disposers: Array<any> = [];
	private steeringFactor: number = 0.05;

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.configureActions();
			resolve();
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
		// TODO: MOVE THIS TO ANOTHER MODULE.
		this.disposers.push(this.state.current.accelerometer
			.getStream()
			.changes()
			.filter(a => a.acceleration > 15)
			.onValue(steeringState => {
				console.log('collision detected!!');
			}));
		// ----------------------------------

		this.disposers.push(this.state.target.steering
			.getStream()
			.changes()
			.onValue(steeringState => {
				this.state.target.engines.setValue({
					fl: {
						throttle: this.getEngineThrottle(EnginePosiions.frontLeft, steeringState)
					},
					fr: {
						throttle: this.getEngineThrottle(EnginePosiions.frontRight, steeringState)
					},
					bl: {
						throttle: this.getEngineThrottle(EnginePosiions.backLeft, steeringState)
					},
					br: {
						throttle: this.getEngineThrottle(EnginePosiions.backRight, steeringState)
					}
				});
			}));
	}

	private getEngineThrottle(enginePosition: EnginePosiions, steeringState: ISteeringValue): number {
		if (steeringState.throttle < 0.01) {
			return 0;
		}

		const steeringThrottle = this.getEngineSteeringThrottle(enginePosition, steeringState);
		return (steeringThrottle * this.steeringFactor) + steeringState.throttle;
	}

	private getEngineSteeringThrottle(enginePosition: EnginePosiions, steeringState: ISteeringValue) {
		switch (enginePosition) {
			case EnginePosiions.frontLeft:
				return steeringState.pitch + steeringState.roll - steeringState.yaw;
			case EnginePosiions.frontRight:
				return steeringState.pitch - steeringState.roll + steeringState.yaw;
			case EnginePosiions.backLeft:
				return -steeringState.pitch + steeringState.roll + steeringState.yaw;
			case EnginePosiions.backRight:
				return -steeringState.pitch - steeringState.roll - steeringState.yaw;
		}
	}
}
