import { CommunicationState } from "./CommunicationState";
import { SteeringState } from "./SteeringState";
import { OrientationState } from "./OrientationState";
import { SimulationState } from "./SimulationState";
import { EnginesState } from "./EnginesState";

interface DroneTargetStates {
	engines: EnginesState,
	steering: SteeringState,
	//attitude: AttitudeTargetState,
	//movement: MovementTargetState,
	//position: PositionState	
}

interface DroneCurrentStates {
	//position: PositionState,
	orientation: OrientationState,
	//speed: (movement,orientation),
	//proximity: (bottom,left,right,top)	
}

export class DroneState {
	public communication: CommunicationState;
	public simulation: SimulationState;

	public target: DroneTargetStates;
	public current: DroneCurrentStates;

	constructor() {
		this.communication = new CommunicationState();
		this.simulation = new SimulationState();

		this.target = {
			engines: new EnginesState(),
			steering: new SteeringState()
		};

		this.current = {
			orientation: new OrientationState()
		};
	}
}