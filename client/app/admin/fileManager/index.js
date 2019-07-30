import angular from 'angular';

import FileManagerController from './fileManager.component';

//import '!raw!sass!./fileManager.scss';

export default angular.module('aksiteApp.admin.fileManager', [])
    .controller('FileManagerController', FileManagerController)
    .name;
