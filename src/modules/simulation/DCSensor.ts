import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import Configuration from '../../services/ConfigurationService';

export class DCSensor implements IDroneModule {
	public name: string = 'DC Sensor';
	private state: DroneState;
	private disposers: Array<any> = [];

	private fakeInitValue = Configuration.battery.voltageMax;
	private startTime: number;

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
		this.startTime = Date.now();

		this.disposers.push(this.state.simulation.position
			.getStream()
			.onValue(enginesState => {
				const elapsed = Date.now() - this.startTime;
				const dischargeRage = 0.00001; // fake, for simulation purposes.
				const current = this.fakeInitValue - (elapsed * dischargeRage);

				this.state.current.dcSensor.setValue({
					voltage: current
				});
			}));
	}
}
