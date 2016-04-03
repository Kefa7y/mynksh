/* Create Angular App Instance */
App = angular.module('IBERIA', ['ui.bootstrap', 'ngRoute']);

/**
 * Angular Routes
 */
App.config(function($routeProvider) {
    $routeProvider

        // route for the landingPage page
        .when('/', {
            templateUrl : '/partials/landingPage.html',
            controller  : 'landingCtrl',
            controllerAs: 'landing'
        })

        // route for the OutgoingReturnFlights page
        .when('/flights', {
            templateUrl : '/partials/outgoingReturnFlights.html',
            controller  : 'flightsCtrl',
            controllerAs: 'flights'
        })

        // // route for the confirmation page
        .when('/confirm', {
            templateUrl : '/partials/confirmation.html',
            controller  : 'confirmCtrl',
            controllerAs: 'sotre'
        });

        // // route for the payment page
        // .when('/payment', {
        //     templateUrl : '/partials/payment.html',
        //     controller  : ''
        // });
});
