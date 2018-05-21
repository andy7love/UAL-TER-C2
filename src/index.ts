import Configuration from './services/ConfigurationService';
import { DroneState } from "./states/DroneState";
import { ModulesManager } from './managers/ModulesManager';
import { ModulesManagerBuilder } from './builders/ModulesManagerBuilder';
import { DroneConfiguration, InitializationMode } from './interfaces/Configuration';
import chalk from 'chalk';

/**
 * BUILDING MODULES.
 */
let state = new DroneState();
let modulesManager = new ModulesManager(state);

switch(Configuration.mode) {
    case InitializationMode.NORMAL:
        console.log(chalk.blue('Initialization mode: NORMAL'));
        ModulesManagerBuilder.BuildHardwareModules(modulesManager);
        break;
    case InitializationMode.SIMULATION:
        console.log(chalk.blue('Initialization mode: SIMULATION'));
        ModulesManagerBuilder.BuildSimulationModules(modulesManager);
        break;
    default:
        throw new Error('Invalid initialization mode.');
}

ModulesManagerBuilder.BuildLogicModules(modulesManager);

/**
 * STARTING.
 */
if(process.argv[2] !== undefined && process.argv[2] === 'check') {
    modulesManager.checkAll().then(() => {
        process.exit();
    }).then(() => {
        process.exit();
    });
} else {
    modulesManager.enableAll().catch(() => {
        console.log(chalk.red('System critical error on 1 module'));
        modulesManager.disableAll();
        process.exit();
    });
}

/**
 * CONSOLE.
 */
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        switch(chunk.toString().trim()) {
            case 'shutdown':
            case 'exit':
            case 'close':
            case 'c':
            case 'q':
                console.log(chalk.yellow('Shutdown command received.'));
                modulesManager.disableAll().then(() => {
                    process.exit();
                }, () => {
                    process.exit();
                });
            break;
            default:
                console.log(chalk.grey('Command not found: ' + chunk));
                break;
        }
    }
});
