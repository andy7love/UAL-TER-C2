import { DroneState } from "../../states/DroneState";
import { DroneModule } from '../../interfaces/Module'

export class IMU implements DroneModule {
	public name: string = 'Inertial Measurement Unit (IMU)';
	private state: DroneState;
	private disposers: Array<any> = [];

	constructor () {

	}

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
        this.disposers.push(this.state.simulation.orientation
            .getStream()
            .changes()
            .onValue((simulationOrientationState) => {
                this.state.current.orientation.setValue(simulationOrientationState.clone());
            }));
	}
}
