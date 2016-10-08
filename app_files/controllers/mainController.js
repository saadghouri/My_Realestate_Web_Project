realestateApp.controller('mainController', function ($scope, $http, $location, $i18next, $rootScope) {
    $("html, body").animate({scrollTop: 0}, 600);
    console.log('start');
    $rootScope.isSecured = false;
    $rootScope.appInitFlag = false;

    $scope.searchData = {};
    $scope.loginData = {};

    $scope.init = function () {
        $scope.loadRecentProperty();
        $scope.loadLocation();
        $http({
            method: 'POST',
            url: get_base_url() + '/validate_user',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    console.log(data);
                    if (!data.success) {
                        $scope.systemErrors = false;
                        $scope.message = false;
                        $scope.isSecured = false;
                        $rootScope.isSecured = false;
                        $scope.isLoggedin = false;
                        $rootScope.isLoggedin = false;
                    } else {
                        $scope.userData = data.success.data;
                        $scope.welcomeMessage = data.success.message;
                        $rootScope.welcomeMessage = data.success.message;
                        $scope.systemErrors = false;
                        $scope.isSecured = true;
                        $rootScope.isSecured = true;
                        $scope.isLoggedin = true;
                        $rootScope.isLoggedin = true;
                    }
                });
        $rootScope.appInitFlag = true;
    };

    $scope.loadRecentProperty = function () {
        console.log($location.path());
        console.log('main_init');
        $http({
            method: 'POST',
            url: get_base_url() + '/property/recent',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function (data) {
            console.log(data);
            if (!data.success) {
                $location.path('/home');
            } else {
                $scope.recentProperty = data.success.data.recent_property;
                $rootScope.recentProperty = data.success.data.recent_property;
                $scope.systemErrors = false;
            }
        });
        $rootScope.appInitFlag = true;
    };

    $scope.loadLocation = function () {
        $('#login_btn').button('loading');
        $scope.isDisabled = true;
        $http({
            method: 'POST',
            url: get_base_url() + '/property/location',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function (data) {
            if (!data.success) {

            } else {
                $scope.countries = data.success.data;
            }
        })
        .error(function (data, status) {
            if (status == 0) {
                $scope.systemErrors = "Connectivity problem while logging in. Please try again.";
                $scope.message = false;
                $scope.isDisabled = false;
            }
        });
    };

    $scope.searchProperty = function () {
        $('#login_btn').button('loading');
        $scope.isDisabled = true;
        $scope.searchData.state = $('#state').val();
        $scope.searchData.sort = 0;
        $http({
            method: 'POST',
            url: get_base_url() + '/property/search',
            data: $.param($scope.searchData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function (data) {
            console.log(data);
            if (!data.success) {
                $rootScope.searchResult = [];
                $location.path('/search/0');
            } else {
                $scope.searchResult = $scope.searchData;
                $rootScope.searchResult = $scope.searchData;
//                        $scope.searchResult = data.success.data.search_property;
//                        $rootScope.searchResult = data.success.data.search_property;
                $location.path('/search/1');
            }
        })
        .error(function (data, status) {
            if (status == 0) {
                $scope.systemErrors = "Connectivity problem while logging in. Please try again.";
                $scope.message = false;
                $scope.isDisabled = false;
            }
        });
    };

    $scope.redirect_link = function (link) {
        $location.path('' + link);
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