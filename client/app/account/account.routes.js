'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider.state('login', {
        url: '/login',
        component: 'login',
        onEnter($rootScope) {
            $rootScope.title = `${$rootScope.titleRoot} | Login`;
        },
    }).state('signup', {
        url: '/signup',
        component: 'signup',
        onEnter($rootScope) {
            $rootScope.title = $rootScope.titleRoot + ' | Signup';
        },
    });
}
