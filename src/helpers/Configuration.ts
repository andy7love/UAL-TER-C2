import { Utils } from '../helpers/Utils';
import { DroneConfiguration } from '../interfaces/Configuration'

class Configuration {
	private static instance: Configuration = null;
    private settings: DroneConfiguration;

	private constructor () {
        let defaults: DroneConfiguration = require('../../config/default.config.json');
        let env = require('../../config/env.config.json');
        this.settings = defaults;
        Utils.deepExtend(this.settings, env);
	}

    public static getSettings():DroneConfiguration {
        if(Configuration.instance === null)
            Configuration.instance = new Configuration();
        
        return Configuration.instance.settings;
    }
}

export default Configuration.getSettings();