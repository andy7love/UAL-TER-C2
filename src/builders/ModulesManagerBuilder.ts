import { ModulesManager } from '../managers/ModulesManager';
import { DroneState } from '../states/DroneState';

export class ModulesManagerBuilder {
	public static BuildHardwareModules(moduleMgr: ModulesManager) {
		moduleMgr.loadModule('hardware/EnginesController');
		moduleMgr.loadModule('hardware/IMU');
	}

	public static BuildSimulationModules(moduleMgr: ModulesManager) {
		moduleMgr.loadModule('simulation/EnginesController');
		moduleMgr.loadModule('simulation/IMU');
		moduleMgr.loadModule('simulation/DCSensor');
		moduleMgr.loadModule('simulation/Simulation');
	}

	public static BuildLogicModules(moduleMgr: ModulesManager) {
		moduleMgr.loadModule('logic/Battery');
		moduleMgr.loadModule('logic/STS');
		moduleMgr.loadModule('logic/Communication');
	}
}
