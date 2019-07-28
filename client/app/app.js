// class RavenExceptionHandler {
//     call(err) {
//         Raven.captureException(err.originalException);
//     }
// }

//     .factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
//         'ngInject';
//         var state;
//         return {
//             // Add authorization token to headers
//             request(config) {
//                 config.headers = config.headers || {};
//                 if($cookies.get('token')) {
//                     config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
//                 }
//                 return config;
//             },
//
//             // Intercept 401s and redirect you to login
//             responseError(response) {
//                 if(response.status === 401) {
//                     (state || (state = $injector.get('$state'))).go('login');
//                     // remove any stale tokens
//                     $cookies.remove('token');
//                     return $q.reject(response);
//                 } else {
//                     return $q.reject(response);
//                 }
//             }
//         };
//     })
//     .run(function($rootScope, $location, Auth, constants) {
//         'ngInject';
//
//         Raven
//             .config(constants.default.sentry.publicDsn)
//             .addPlugin(RavenAngular, angular)
//             .install();
//
//         // Redirect to login if route requires auth and you're not logged in
//         $rootScope.$on('$stateChangeStart', function(event, next) {
//             $rootScope.title = 'Andrew Koroluk';
//             return Auth.isLoggedInAsync().then(loggedIn => {
//                 if(next.authenticate && !loggedIn) {
//                     $location.path('/login');
//                 }
//             });
//         });
//
//         $rootScope.titleRoot = 'AK';
//         $rootScope.title = 'Andrew Koroluk';
//     });

import './app.scss';

// import './polyfills';

import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// depending on the env mode, enable prod mode or add debugging modules
if(process.env.NODE_ENV === 'production') {
    enableProdMode();
}

import { AppModule } from './app.module';

export function main() {
    return platformBrowserDynamic().bootstrapModule(AppModule);
}

if(document.readyState === 'complete') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}
