import { System } from './modules/test';
let s = require('socket.io');
let d = require('johnny-five');
let myClass = new System.MyTest();
myClass.log();
console.log(s);