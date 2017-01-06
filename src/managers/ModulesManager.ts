import { DroneModule, DroneModuleCheckStatus } from '../interfaces/Module'
let chalk: any = require('chalk');

export class ModulesManager {
    private modules: Array<DroneModule>;

    constructor() {
        
    }

    public add(m: DroneModule) {
        this.modules.push(m);
    }

    public runHealthCheck() {
        let i = 0;
        var checkModule = () => {
            let m = this.modules[i];
            m.check().then((result) => {
                let statusText;
                if(result.status === DroneModuleCheckStatus.DONE) {
                    statusText = chalk.green("DONE");
                } else if(result.status === DroneModuleCheckStatus.WARN) {
                    statusText = chalk.yellow("WARN");
                } else {
                    statusText = chalk.red("FAIL");
                }

                statusText = '[' + statusText + '] ' + m.name;

                console.log(statusText);

                i++;
                if(i < this.modules.length) {
                    checkModule();
                }
            });
        };
    }
}