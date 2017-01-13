import { DroneState } from "../../states/DroneState";
import { DroneModule } from "../../interfaces/Module";

export class EnginesController implements DroneModule {
	public name: string = 'Engines Controller';
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
        this.disposers.push(this.state.target.engines
            .getStream()
            .changes()
            .onValue((enginesState) => {
                // nothing to do here, all is calculated on the simulation loop.
            }));
	}
}