import { DroneState } from './states/DroneState';
import { Communication } from './modules/Communication';
import { FlightControl } from './modules/FlightControl';
import { Simulation } from './modules/Simulation';

/*
let d = require('johnny-five');
*/

let state = new DroneState();
let communication = new Communication(state);
let flightControl = new FlightControl(state);
let simulation = new Simulation(state);