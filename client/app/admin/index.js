import angular from 'angular';
import uirouter from 'angular-ui-router';

import SidenavController from './sidenav.controller';

import dashboard from './dashboard';
import blogManager from './blogManager';
import fileManager from './fileManager';
import photoManager from './photoManager';
import postEditor from './postEditor';
import galleryEditor from './galleryEditor';
import projectEditor from './projectEditor';
import projectManager from './projectManager';
import userEditor from './userEditor';
import userManager from './userManager';
import siteSettings from './siteSettings';

import routing from './admin.routes';
import AdminController from './admin.controller';

import navbar from '../../components/navbar';

//import '!raw!sass!./admin.scss'

export default angular.module('aksiteApp.admin', [
    uirouter,
    navbar,
    dashboard,
    blogManager,
    fileManager,
    photoManager,
    postEditor,
    galleryEditor,
    projectEditor,
    projectManager,
    userEditor,
    userManager,
    siteSettings
])
    .config(routing)
    .controller('SidenavController', SidenavController)
    .controller('AdminController', AdminController)
    .name;
