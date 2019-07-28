/*eslint-env node*/

Error.stackTraceLimit = Infinity;

import './client/app/polyfills';

// require('core-js/client/shim');
// import 'reflect-metadata';

// require('ts-helpers');

// require('zone.js/dist/zone');
// require('zone.js/dist/long-stack-trace-zone');
// require('zone.js/dist/proxy');
// require('zone.js/dist/sync-test');
// // require('zone.js/dist/jasmine-patch');
// require('zone.js/dist/async-test');
// require('zone.js/dist/fake-async-test');

var testsContext;

require('babel-polyfill');
// require('angular');
// require('angular-mocks');

// require('./client/app/app');

testsContext = require.context('./client', true, /\.spec\.js$/);
// testsContext.keys().forEach(testsContext);
testsContext('./app/main/main.component.spec.js');

// Select BrowserDomAdapter.
// see https://github.com/AngularClass/angular2-webpack-starter/issues/124
// Somewhere in the test setup
import { TestBed, getTestBed } from '@angular/core/testing';
var browser = require('@angular/platform-browser-dynamic/testing');

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

var hook = new Mocha.Hook('Modified Angular beforeEach Hook', function() {
    getTestBed().resetTestingModule();
});

hook.ctx = mocha.suite.ctx;
hook.parent = mocha.suite;
mocha.suite._beforeEach = [hook];
