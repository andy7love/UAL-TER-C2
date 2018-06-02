import { DroneState } from '../states/DroneState';

export interface IDroneModule {
	name: string;

	// Sets the drone's state reference to the module.
	setState(state: DroneState): void;

	// Module will start, turn on hardware, check things,
	// attach to state changes, map streams and remain active until disable() is called.
	enable(): Promise<string>;

	// Module will check if it is running, de-attach from state changes,
	// unmap streams, shutdown hardware and destroy all instances.
	disable(): Promise<string>;
}
