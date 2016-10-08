realestateApp.controller('loginController', function ($scope, $http, $location, $sce, $stateParams, $i18next, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.loginData = {};
    $scope.registerData = {};

    $scope.reg_message = false;
    $scope.reg_systemErrors = false;
//    $scope.isLoggedin = true;
//    $rootScope.isLoggedin = true;

    $scope.init = function () {
        if($rootScope.logout == 1){
            window.location.reload();
            $rootScope.logout = 0;
        }
        $http({
            method: 'POST',
            url: get_base_url() + '/validate_user',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    if (!data.success) {
                        $scope.systemErrors = data.errors.systemError;
                        $scope.systemErrors = false;
                        $scope.message = false;
                        $scope.isLoggedin = false;
                        $rootScope.isLoggedin = false;
//                        window.location.reload();
                    } else {
                        $scope.isLoggedin = true;
                        $rootScope.isLoggedin = true;
                        $scope.message = data.success.message;
                        $scope.systemErrors = false;
                        $location.path('/profile');
                    }
                })
                .error(function (data, status) {
                    if (status == 0 || status == 404) {
                        $scope.message = false;
                        if ($scope.counter > 0) {
                            $scope.systemErrors = "Connectivity problem while logging in. Trying to connect...";
                            $scope.init();
                        } else {
                            $scope.systemErrors = "Error while trying to log in. Please refresh the page and try again.";
                        }
                    }
                    $('#login_btn').button('reset');
                });
    };
    $scope.submitLoginForm = function (isValid) {
        console.log("URL: " + $rootScope.redirectURL);
        if (isValid) {
            $('#login_btn').button('loading');
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/do_login',
                data: $.param($scope.loginData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            $scope.errorEmail = data.errors.email;
                            $scope.errorPassword = data.errors.password;
                            $scope.systemErrors = data.errors.systemError;
                            $scope.isDisabled = false;
                            $('#login_btn').button('reset');
                        } else {
                            location.reload();
                            $('#login_btn').button('complete');
                            $scope.isDisabled = true;
                            $scope.message = data.success.message;
                            $scope.errorEmail = false;
                            $scope.errorPassword = false;
                            $scope.systemErrors = false;

                            $location.path('/profile');
                        }
                    })
                    .error(function (data, status) {
                        if (status == 0) {
                            $scope.systemErrors = "Connectivity problem while logging in. Please try again.";
                            $scope.message = false;
                            $scope.isDisabled = false;
                        }
                    });
        }
    };
    $scope.submitRegisterForm = function (isValid) {
        console.log("Submit Register Form");
        console.log("URL: " + $rootScope.redirectURL);
        if (isValid) {
            $('#login_btn').button('loading');
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/register',
                data: $.param($scope.registerData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        console.log(data);
                        if (!data.success) {
                            $scope.errorEmail = data.errors.email;
                            $scope.errorPassword = data.errors.password;
                            $scope.reg_systemErrors = data.errors.systemError;
                            $scope.isDisabled = false;
                            $('#login_btn').button('reset');
                        } else {
                            if (data.success.login == "1") {
                                $location.path('/');
                                $scope.reg_message = data.success.message;
                                $('html, body').animate({scrollTop: '0px'}, 0);
                            } else if (data.success.login == "1") {
                                $location.path('/');
                            } else {
                                $('#login_btn').button('complete');
                                $scope.isDisabled = true;
                                $scope.reg_message = data.success.message;
                                $scope.errorEmail = false;
                                $scope.errorPassword = false;
                                $scope.reg_systemErrors = false;
                            }
                        }
                    })
                    .error(function (data, status) {
                        if (status == 0) {
                            $scope.systemErrors = "Connectivity problem while logging in. Please try again.";
                            $scope.message = false;
                            $scope.isDisabled = false;
                        }
                    });
        }
    };


    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.remove_alert = function () {
        $scope.systemError = false;
        $scope.systemErrors = false;
        $scope.message = false;
    };
});

realestateApp.controller('resetPassController', function ($scope, $http, $i18next, $sce, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $rootScope.act_btn_isHidden = true;
    $rootScope.bottom_menu_isHidden = true;
    $scope.rpData = {};
    $scope.rpData.building_id = $rootScope.building_id;
    $scope.cvData = {code: 0, email: getUrlParameter('email')};
    $scope.cvData.building_id = $rootScope.building_id;
    $scope.isDisabled = false;
    $scope.resetForm = true;
    $scope.newPassword = false;
    $scope.npData = {};
    $scope.npData.building_id = $rootScope.building_id;
    $scope.submitrpForm = function (isValid) {
        if (isValid) {
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/reset_password',
                data: $.param($scope.rpData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            $scope.errorEmail = data.errors.email;
                            $scope.systemErrors = data.errors.email;
                            $scope.message = false;
                            $scope.isDisabled = false;
                            $scope.isEDisabled = false;
                        } else {
                            $scope.isDisabled = true;
                            $scope.isEDisabled = true;
                            $scope.message = data.success.message;
                            $scope.cvData.code = data.success.code;
                            $scope.cvData.email = data.success.email;
                            $scope.npData.code = data.success.code;
                            $scope.npData.email = data.success.email;
                            $scope.systemErrors = false;
                            $scope.errorEmail = false;
                            $scope.resetForm = false;
                        }
                    });
        }
    };

    $scope.submitcvForm = function (isValid) {
        $scope.systemErrors = false;
        if (isValid) {
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/code_verification',
                data: $.param($scope.cvData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            $scope.errorCode = data.errors.code;
                            $scope.systemErrors = data.errors.systemError;
                            $scope.isDisabled = false;
                        } else {
                            $scope.isDisabled = true;
                            $scope.message = data.success.message;
                            $scope.errorCode = false;
                            $scope.systemErrors = false;
                            $scope.newPassword = true;
                        }
                    });
        }
    };

    $scope.submitnpForm = function (isValid) {
        $scope.systemErrors = false;
        $scope.npData.code = $scope.cvData.code;
        if (isValid) {
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/new_password',
                data: $.param($scope.npData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            $scope.errorPass = data.errors.pass;
                            $scope.systemErrors = data.errors.systemError;
                            $scope.isDisabled = false;
                        } else {
                            $scope.isDisabled = true;
                            $scope.message = data.success.message;
                            $scope.errorCode = false;
                            $scope.systemErrors = false;
                            setTimeout(window.location.reload(), 2000);
                        }
                    });
        }
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
});

realestateApp.controller('profileController', function ($scope, $http, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.userData = {};
    $scope.profileData = {};

    $scope.reg_message = false;
    $scope.reg_systemErrors = false;

    $scope.init = function () {
        console.log($location.path());
        console.log('main_init');
        $http({
            method: 'POST',
            url: get_base_url() + '/validate_user',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    console.log(data);
                    if (!data.success) {
                        $scope.systemErrors = data.errors.systemError;
                        $scope.message = false;
                        if ($location.path().indexOf('get-register') == -1 && $location.path().indexOf('join-building') == -1) {
                            $rootScope.redirectURL = $location.path();
                            $location.path('/login');
                        }
                    } else {
                        $scope.userData = data.success.data;
                        $scope.welcomeMessage = data.success.message;
                        $rootScope.welcomeMessage = data.success.message;
                        $scope.systemErrors = false;
                        $scope.first_name = data.success.data.first_name;
                        $scope.isLoggedin = true;
                        $rootScope.isLoggedin = true;
                    }
                });
        $rootScope.appInitFlag = true;
    };

    $scope.updateProfileForm = function (isValid) {
        if (isValid) {
            $('#login_btn').button('loading');
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/profile/update',
                data: $.param($scope.userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            $scope.errorEmail = data.errors.email;
                            $scope.errorPassword = data.errors.password;
                            $scope.systemErrors = data.errors.systemError;
                            $scope.isDisabled = false;
                        } else {
                            $('html, body').animate({scrollTop: '0px'}, 0);
                            $scope.isDisabled = true;
                            $scope.message = data.success.message;
                            $scope.systemErrors = false;
                        }
                    })
                    .error(function (data, status) {
                        if (status == 0) {
                            $scope.systemErrors = "Connectivity problem while logging in. Please try again.";
                            $scope.message = false;
                            $scope.isDisabled = false;
                        }
                    });
        }
    };
});

realestateApp.controller('logoutController', function ($scope, $http, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.isLoggedin = false;
    $rootScope.isLoggedin = false;
    $scope.init = function () {
        $http({
            method: 'POST',
            url: get_base_url() + "/logout",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data) {
                    $scope.isLoggedin = false;
                    $rootScope.isLoggedin = false;
                    $rootScope.logout = 1;
//                    window.location.href = "http://localhost/real_estate/#/login";
                    $location.path("/login");
//                    window.location.href= "http://localhost/real_estate/#/login";
                });
    };
    
//    $scope.init = function () {
//        $http({
//            method: 'POST',
//            url: get_base_url() + '/validate_user',
//            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//        })
//
//                .success(function (data) {
//                    if (!data.success) {
//                        $scope.systemErrors = data.errors.systemError;
//                        $scope.systemErrors = false;
//                        $scope.message = false;
//                        $scope.isLoggedin = false;
//                        $rootScope.isLoggedin = false;
////                        window.location.reload();
//                    } else {
//                        $scope.isLoggedin = true;
//                        $rootScope.isLoggedin = true;
//                        $scope.message = data.success.message;
//                        $scope.systemErrors = false;
//                        $location.path('/');
//                    }
//                })
//                .error(function (data, status) {
//                    if (status == 0 || status == 404) {
//                        $scope.message = false;
//                        if ($scope.counter > 0) {
//                            $scope.systemErrors = "Connectivity problem while logging in. Trying to connect...";
//                            $scope.init();
//                        } else {
//                            $scope.systemErrors = "Error while trying to log in. Please refresh the page and try again.";
//                        }
//                    }
//                    $('#login_btn').button('reset');
//                });
//    };
});