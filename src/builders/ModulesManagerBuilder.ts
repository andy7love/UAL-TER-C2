import { ModulesManager } from '../managers/ModulesManager';
import { DroneState } from '../states/DroneState';
import { Communication } from '../modules/Communication';
import { FlightControl } from '../modules/FlightControl';
import { Simulation } from '../modules/Simulation';

export class ModulesManagerBuilder {
    constructor() {
        
    }

    public static BuildHardwareModules(moduleMgr: ModulesManager) {
        // nothing yet....
    }

    public static BuildSimulationModules(moduleMgr: ModulesManager) {
        moduleMgr.add(new FlightControl());
        moduleMgr.add(new Simulation());
    }

    public static BuildLogicModules(moduleMgr: ModulesManager) {
        moduleMgr.add(new Communication());
    }
}