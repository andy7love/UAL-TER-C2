import { DroneState } from './states/DroneState';
import { Communication } from './modules/Communication';
import { FlightControl } from './modules/FlightControl';
import { Simulation } from './modules/Simulation';
import Configuration from './helpers/Configuration';

/*
let d = require('johnny-five');
*/

console.log(Configuration.mode);

let state = new DroneState();
let communication = new Communication(state);
let flightControl = new FlightControl(state);
let simulation = new Simulation(state);