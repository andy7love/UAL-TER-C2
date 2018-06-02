import { Utils } from '../helpers/Utils';
import { IDroneConfiguration } from '../interfaces/Configuration';

class ConfigurationService {
	public static getSettings(): IDroneConfiguration {
		if (ConfigurationService.instance === null) {
			ConfigurationService.instance = new ConfigurationService();
		}

		return ConfigurationService.instance.settings;
	}

	private static instance: ConfigurationService = null;
	private settings: IDroneConfiguration;

	private constructor() {
		const defaults: IDroneConfiguration = require('../../config/default.config.json');
		const env = require('../../config/env.config.json');
		this.settings = defaults;
		Utils.deepExtend(this.settings, env);
	}
}

export default ConfigurationService.getSettings();
