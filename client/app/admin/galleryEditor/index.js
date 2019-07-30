import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import GalleryEditorController from './galleryEditor.component';

//import '!raw!sass!./galleryEditor.scss';

export default angular.module('aksiteApp.admin.galleryEditor', [ngFileUpload])
    .controller('GalleryEditorController', GalleryEditorController)
    .name;
