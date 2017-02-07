import { Utils } from '../helpers/Utils';
import { DroneConfiguration } from '../interfaces/Configuration'

class ConfigurationService {
	private static instance: ConfigurationService = null;
    private settings: DroneConfiguration;

	private constructor () {
        let defaults: DroneConfiguration = require('../../config/default.config.json');
        let env = require('../../config/env.config.json');
        this.settings = defaults;
        Utils.deepExtend(this.settings, env);
	}

    public static getSettings():DroneConfiguration {
        if(ConfigurationService.instance === null)
            ConfigurationService.instance = new ConfigurationService();
        
        return ConfigurationService.instance.settings;
    }
}

export default ConfigurationService.getSettings();