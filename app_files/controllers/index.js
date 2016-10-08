var realestateApp = angular.module('realestateApp', ['ui.router', 'jm.i18next', 'angularFileUpload', 'checklist-model', 'ngSanitize']);
var back_url;

realestateApp.config(function ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/home');

    $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            .state('rooturl', {
                url: '/',
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .state('root', {
                url: '',
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'loginController'
            })
            .state('logout', {
                url: '/logout',
                templateUrl: 'pages/logout.html',
                controller: 'logoutController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'pages/profile.html',
                controller: 'profileController'
            })
            .state('property_add', {
                url: '/property/add',
                templateUrl: 'pages/property_add.html',
                controller: 'propertyAddController'
            })
            .state('property_view_id', {
                url: '/property/view/:id',
                templateUrl: 'pages/property_view.html',
                controller: 'propertyViewController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'pages/contact.html'
            })
            .state('search_flag', {
                url: '/search/:flag',
                templateUrl: 'pages/search.html',
                controller: 'searchController'
            })
            .state('offers', {
                url: '/offers',
                templateUrl: 'pages/user_offers.html',
                controller: 'MyOffersController'
            })
            .state('properties', {
                url: '/properties',
                templateUrl: 'pages/user_properties.html',
                controller: 'MyPropertiesController'
            })
            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('about', {
                // we'll get to this in a bit       
            });

});

realestateApp.run(function ($rootScope, $location) {
    $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                console.log(toState);
                if ($rootScope.locationSearch != null) {
                    $location.search($rootScope.locationSearch);
                }
                var searchVal = $location.search();
                console.log(searchVal);
                if (searchVal.building_id) {
                    var css_url = jQuery('#main-ace-style').attr('href');
                    console.log(css_url);
                    if (css_url == "") {
                        if (searchVal.building_id) {
                            jQuery('#main-ace-style').attr('href', 'theme/css/buildings/' + searchVal.building_id + ".css");
                        }
                    }
                }
            });
});

realestateApp.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
});

function login() {
    window.location.href = "#/login";
}

function switch_to(data) {
    $('.widget-box.visible').removeClass('visible');//hide others
    $(data).addClass('visible');//show target
}

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.npForm.pass.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});

angular.module('jm.i18next').config(function ($i18nextProvider) {
    'use strict';
    /*jshint unused:false */
    window.i18n.addPostProcessor('patrick', function (value, key, options) {
        //https://www.youtube.com/watch?v=YSzOXtXm8p0
        return 'No, this is Patrick!';
    });
    window.i18n.addPostProcessor('test', function (value, key, options) {
        return 'PostProcessor is working!';
    });
    /*jshint unused:true */
    $i18nextProvider.options = {
        lng: 'en', // If not given, i18n will detect the browser language.
        fallbackLng: 'fr', // Default is dev
        useCookie: false,
        useLocalStorage: false,
        resGetPath: 'assets/ln/locales/__lng__.json'
    };
});

realestateApp.directive('isNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope) {
            scope.$watch('workData.amount', function (newValue, oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                    return;
                if (arr.length === 2 && newValue === '-.')
                    return;
                var temp_arr = String(newValue).split(".");
                if (temp_arr[1] && temp_arr[1].length === 3) {
                    scope.workData.amount = oldValue;
                }
                if (isNaN(newValue)) {
                    scope.workData.amount = oldValue;
                }
            });
        }
    };
});