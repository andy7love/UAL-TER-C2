import { CommunicationState } from './CommunicationState';
import { SteeringState } from './SteeringState';
import { OrientationState } from './OrientationState';
import { AccelerometerState } from './AccelerometerState';
import { GyroscopeState } from './GyroscopeState';
import { SimulationState } from './SimulationState';
import { EnginesState } from './EnginesState';
import { DCSensorState } from './DCSensorState';
import { BatteryState } from './BatteryState';
import { StateProperty } from '../helpers/StateProperty';

interface IDroneTargetStates {
	engines: EnginesState;
	steering: SteeringState;
	// attitude: AttitudeTargetState,
	// movement: MovementTargetState,
	// position: PositionState
}

interface IDroneCurrentStates {
	// position: PositionState,
	calibratedImu: StateProperty<boolean>;
	temperature: StateProperty<number>;
	orientation: OrientationState;
	accelerometer: AccelerometerState;
	gyroscope: GyroscopeState;
	dcSensor: DCSensorState;
	battery: BatteryState;
	// speed: (movement,orientation),
	// proximity: (bottom,left,right,top)
}

export class DroneState {
	public communication: CommunicationState;
	public simulation: SimulationState;

	public target: IDroneTargetStates;
	public current: IDroneCurrentStates;

	constructor() {
		this.communication = new CommunicationState();
		this.simulation = new SimulationState();

		this.target = {
			engines: new EnginesState(),
			steering: new SteeringState()
		};

		this.current = {
			calibratedImu: new StateProperty(false),
			temperature: new StateProperty(0),
			orientation: new OrientationState(),
			accelerometer: new AccelerometerState(),
			gyroscope: new GyroscopeState(),
			dcSensor: new DCSensorState(),
			battery: new BatteryState()
		};
	}
}
