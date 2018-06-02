import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import Configuration from '../../services/ConfigurationService';

export class Battery implements IDroneModule {
	public name: string = 'Battery';
	private state: DroneState;
	private disposers: Array<any> = [];

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

	private getPercentage(currentVoltage: number) {
		const totalRange = Configuration.battery.voltageMax - Configuration.battery.voltageMin;
		const current = (currentVoltage - Configuration.battery.voltageMin);
		return current / totalRange;
	}

	private configureActions() {
		this.disposers.push(this.state.current.dcSensor
			.getStream()
			.changes()
			.onValue(dcSensorState => {
				this.state.current.battery.setValue({
					voltage: dcSensorState.voltage,
					percentage: this.getPercentage(dcSensorState.voltage),
					dischargeRate: 0,
					autonomy: 0
				});
			}));
	}
}
