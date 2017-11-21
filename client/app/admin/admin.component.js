'use strict';
import { Component } from '@angular/core';
import template from './admin.html';

@Component({
    selector: 'admin',
    template,
})
export class AdminComponent {
    sections = [{
        title: 'Home',
        icon: 'fa-home',
        link: '',
    }, {
        title: 'Users',
        icon: 'fa-user',
        link: 'users',
    }, {
        title: 'Galleries',
        icon: 'fa-photo',
        link: 'galleries',
    }, {
        title: 'Projects',
        icon: 'fa-briefcase',
        link: 'projects',
    }, {
        title: 'Blog',
        icon: 'fa-newspaper-o',
        link: 'blog',
    }, {
        title: 'Files',
        icon: 'fa-files-o',
        link: 'files',
    }, {
        title: 'Settings',
        icon: 'fa-cog',
        link: 'settings',
    }];

    // static parameters = [];
    // constructor() {
    //     this.$mdSidenav = $mdSidenav;
    // }

    // toggleLeft() {
    //     this.$mdSidenav('left').toggle()
    //         .then(function() {
    //             //$log.debug("toggle left is done");
    //         });
    // }
}
