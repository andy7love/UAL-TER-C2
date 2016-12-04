import { CommunicationState } from "./CommunicationState";
import { FlightState } from "./FlightState";
import { SimulationState } from "./SimulationState";

export class DroneState {
	public communication: CommunicationState;
	public flight: FlightState;
	public simulation: SimulationState;

	constructor() {
		this.communication = new CommunicationState();
		this.flight = new FlightState();
		this.simulation = new SimulationState();
	}
}