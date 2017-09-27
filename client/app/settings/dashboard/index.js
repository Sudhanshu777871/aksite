import angular from 'angular';

import routing from './dashboard.routes';
import SettingsDashboardController from './dashboard.component';

//import '!raw!sass!./dashboard.scss';

export default angular.module('aksiteApp.settings.dashboard', [])
    .config(routing)
    .controller('SettingsDashboardController', SettingsDashboardController)
    .name;
