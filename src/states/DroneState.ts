import { CommunicationState } from "./CommunicationState";
import { FlightState } from "./FlightState";
import { SimulationState } from "./SimulationState";
import { EnginesState } from "./EnginesState";

export class DroneState {
	public communication: CommunicationState;
	public flight: FlightState;
	public simulation: SimulationState;
	public engines: EnginesState;

	constructor() {
		this.communication = new CommunicationState();
		this.flight = new FlightState();
		this.simulation = new SimulationState();
		this.engines = new EnginesState();
	}
}