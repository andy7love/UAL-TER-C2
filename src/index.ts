/// <reference path="../typings/globals/node/index.d.ts" />
import { DroneState } from './states/DroneState';
import { Communication } from './modules/Communication';
import { FlightControl } from './modules/FlightControl';

/*
let d = require('johnny-five');
*/

let state = new DroneState();
let communication = new Communication(state);
let flightControl = new FlightControl(state);