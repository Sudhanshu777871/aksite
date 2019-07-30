import angular from 'angular';

import GalleryManagerController from './galleryManager.component';

//import '!raw!sass!./galleryManager.scss';

export default angular.module('aksiteApp.admin.galleryManager', [])
    .controller('GalleryManagerController', GalleryManagerController)
    .name;
