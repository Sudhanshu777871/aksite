import angular from 'angular';

import routing from './siteSettings.routes';
import SiteSettingsController from './siteSettings.controller';

//import '!raw!sass!./siteSettings.scss';

export default angular.module('aksiteApp.admin.siteSettings', [])
    .config(routing)
    .controller('SiteSettingsController', SiteSettingsController)
    .name;
