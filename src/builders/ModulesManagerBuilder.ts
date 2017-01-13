import { ModulesManager } from '../managers/ModulesManager';
import { DroneState } from '../states/DroneState';
/*
import { Communication } from '../modules/logic/Communication';
import { FlightControl } from '../modules/simulation/EnginesController';
import { Simulation } from '../modules/Simulation';
*/
export class ModulesManagerBuilder {
    constructor() {
        
    }

    public static BuildHardwareModules(moduleMgr: ModulesManager) {
        moduleMgr.loadModule('hardware/EnginesController');
    }

    public static BuildSimulationModules(moduleMgr: ModulesManager) {
        moduleMgr.loadModule('simulation/EnginesController');
        moduleMgr.loadModule('simulation/IMU');
        moduleMgr.loadModule('simulation/Simulation');
    }

    public static BuildLogicModules(moduleMgr: ModulesManager) {
        moduleMgr.loadModule('logic/STS');
        moduleMgr.loadModule('logic/Communication');
    }
}