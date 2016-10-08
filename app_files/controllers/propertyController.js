realestateApp.controller('propertyAddController', function ($compile, $scope, $http, $location, $sce, $stateParams, $i18next, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.loginData = {};
    $scope.propertyData = {};    
    $scope.propertyData.propertyImages = [];
    
    $scope.countries = {
        'CANADA': {
            'Quebec': ['Montreal']
        }
    };
    

    $scope.init = function () {
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
                        $location.path('/login')
                    } else {
                        $scope.message = false;
                        $scope.systemErrors = false;
                        $scope.loadLocation();
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
    
    $scope.addProperty = function (isValid) {
        console.log("URL: " + $rootScope.redirectURL);
        if (isValid) {
            $('#login_btn').button('loading');
            $scope.isDisabled = true;
            $http({
                method: 'POST',
                url: get_base_url() + '/property/add',
                data: $.param($scope.propertyData),
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
                            $('#login_btn').button('complete');
                            $scope.isDisabled = true;
                            $scope.message = data.success.message;
                            $scope.errorEmail = false;
                            $scope.errorPassword = false;
                            $scope.systemErrors = false;
                            
                            $location.path('/property/view/'+data.success.id);
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

    $scope.camera_upload = function ($event) {
        $event.preventDefault();
        $("input[id='my_file']").click();
    };

    $scope.prepareUpload2 = function (event) {
        var files = event.target.files;
        if (files.length > 0) {
            loading(true);
            event.stopPropagation(); // Stop stuff happening
            event.preventDefault(); // Totally stop stuff happening

            // START A LOADING SPINNER HERE

            // Create a formdata object and add the files
            var data = new FormData();
            $.each(files, function (key, value)
            {
                data.append(key, value);
            });

            $.ajax({
                url: get_base_url() + '/property/photo',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR)
                {
                    if (!data.success) {
                        $scope.$apply(function () {
                            $("html, body").animate({scrollTop: 0}, 600);
                            $scope.systemErrors = data.errors.systemError;
                            $scope.message = false;
                        });
                    } else {
                        // file is uploaded successfully
                        var image_url = data.success.data.pic_url;
                        var image_name = data.success.data.pic_name;
                        var image_html = "";
                        image_html += '';
                        image_html += '<div class="img-wrap" style="position: relative;display: inline-block;font-size: 0;padding-bottom: 20px;">';
                        image_html += '<span class="close red" ng-click="remove($event,\'' + image_name + '\')" style="position: absolute;top: 8px;right: 6px;z-index: 100;background-color: #FFF;padding: 1px 3px 3px 3px;color: #000;font-weight: bold;cursor: pointer;opacity: 1;text-align: center;font-size: 23px;line-height: 16px;border-radius: 50%;">&times;</span>';
                        image_html += '<img src="' + image_url + '" style="max-width: 100%;height: auto;"/>';
                        image_html += '<input type="hidden" value="' + image_url + '" name="property_images[]" ng-model="propertyData.propertyImages" />';
                        image_html += '</div><div style="clear:both"></div>';
                        var html = $compile(image_html)($scope);
                        $('#property_images').append(html);
                        $scope.propertyData.propertyImages.push(image_name);
                    }
                    loading(false);
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    $scope.message = false;
                    $scope.systemErrors = "Videos and audio recordings cannot be uploaded. You can only upload photos.";
                    loading(false);
                    $("html, body").animate({scrollTop: 0}, 600);
                }
            });
        }
    };
    
    $scope.remove = function ($event, image_name) {
        console.log(image_name);
        var elem = $event.currentTarget || $event.srcElement;
        var el = angular.element(elem);
        $http({
            method: 'POST',
            data: $.param({'image_name': image_name}),
            url: get_base_url() + '/property/remove/photo',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data) {
                    console.log(data);
                    if (!data.success) {

                    } else {

                    }
                });
        var index = $scope.propertyData.propertyImages.indexOf(image_name);
        if (index >= 0) {
            $scope.propertyData.propertyImages.splice(index, 1);
        }
        el.parent().remove();
    };
    
    $scope.loadLocation = function () {
        console.log("URL: " + $rootScope.redirectURL);
        $('#login_btn').button('loading');
        $scope.isDisabled = true;
        $http({
            method: 'POST',
            url: get_base_url() + '/property/location',
            data: $.param($scope.propertyData),
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

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.remove_alert = function () {
        $scope.systemError = false;
        $scope.systemErrors = false;
        $scope.message = false;
    };
});

realestateApp.controller('propertyViewController', function ($scope, $http, $stateParams, $sce, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.loginData = {};
    $scope.propertyData = {id: $stateParams.id};
    $scope.offerData = {id: $stateParams.id};
    $scope.owner = [];
    
    $scope.searchData = {flag : $stateParams.flag};
    $scope.noResult = true;
    $scope.offerList = [];
    $scope.makeOffer = false;
    
    $scope.searchProperty = function () {
        if ($scope.searchData.flag == 1) {
            $scope.searchResult = $rootScope.searchResult;
            $scope.searchData.flag == 0;
            if($scope.searchResult){
                $scope.noResult = false;
            }
        } else {
            $http({
                method: 'POST',
                url: get_base_url() + "/property/search",
                data: $.param($scope.searchData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                    .success(function (data) {
                        if (!data.success) {
                            $scope.noResult = true;
                            $scope.searchResult = [];
                            $rootScope.searchResult = [];
                        } else {

                            $scope.noResult = false;
                            $scope.searchResult = data.success.data.search_property;
                            $rootScope.searchResult = data.success.data.search_property;
                            $location.path('/search/1');
                        }
                    });
        }
    };

    $scope.init = function () {
        $scope.getPropertyInfo();
        $scope.listOffer();
    };
    
    $scope.getPropertyInfo = function () {
        $scope.isDisabled = true;
        $http({
            method: 'POST',
            url: get_base_url() + '/property/view',
            data: $.param($scope.propertyData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    if (!data.success) {
                        $scope.systemErrors = data.errors.systemError;
                        $scope.makeOffer = false;
                        $scope.propertyOwner = false;
                        $scope.offerAlreadyMade = false;
                    } else {
                        $scope.propertyData = data.success.data.propertyData;
                        $scope.makeOffer = data.success.data.makeOffer;
                        $scope.owner = data.success.data.ownerData;
                        $scope.propertyOwner = data.success.data.propertyOwner;
                        $scope.propertyImage = data.success.data.property_images;
                        $scope.offerAlreadyMade = data.success.data.offer_already_made;
                        $scope.totalOffers = data.success.data.total_offers;
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
    
    $scope.submitOffer = function (isValid) {
        if (isValid) {
            $http({
                method: 'POST',
                url: get_base_url() + '/submit/offer',
                data: $.param($scope.offerData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })

                    .success(function (data) {
                        if (!data.success) {
                            
                        } else {
                            location.reload();
                            $scope.listOffer();
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
    
    $scope.listOffer = function () {
            $http({
            method: 'POST',
            url: get_base_url() + '/list/offer',
            data: $.param($scope.propertyData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    if (!data.success) {

                    } else {
                        $scope.offerList = data.success.data;
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
    
    $scope.acceptOffer = function (offerId) {
        $http({
            method: 'POST',
            url: get_base_url() + '/accept/offer',
            data: $.param({id: offerId , pid: $scope.propertyData.id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

                .success(function (data) {
                    if (!data.success) {

                    } else {
                        location.reload();
//                        $scope.listOffer();
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

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.remove_alert = function () {
        $scope.systemError = false;
        $scope.systemErrors = false;
        $scope.message = false;
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

realestateApp.controller('searchController', function ($scope, $http, $stateParams, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.searchData = {flag : $stateParams.flag};
    $scope.noResult = true;
    $scope.searchData.sort = 0;
    
    $scope.init = function () {
//        console.log($scope)
        if ($scope.searchData.flag == 1 && $rootScope.searchResult) {
            $scope.searchData = $rootScope.searchResult;
            $scope.searchData.flag = 0;
        }
        $http({
            method: 'POST',
            url: get_base_url() + "/property/search",
            data: $.param($scope.searchData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data) {
                    $("html, body").animate({scrollTop: 0}, 600);
                    if (!data.success) {
                        $scope.noResult = true;
                        $scope.searchResult = [];
//                        $rootScope.searchResult = [];
                    } else {

                        $scope.noResult = false;
                        $scope.searchResult = data.success.data.search_property;
//                        $rootScope.searchResult = data.success.data.search_property;
//                            $location.path('/search/1');
                    }
                });
    };
});

realestateApp.controller('MyPropertiesController', function ($scope, $http, $stateParams, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.searchData = {};
    $scope.noResult = true;
    $scope.searchData.sort = 0;
    
    $scope.init = function () {
        $http({
            method: 'POST',
            url: get_base_url() + "/user/properties",
            data: $.param($scope.searchData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data) {
                    $("html, body").animate({scrollTop: 0}, 600);
                    if (!data.success) {
                        $scope.noResult = true;
                        $scope.searchResult = [];
                    } else {
                        $scope.noResult = false;
                        $scope.searchResult = data.success.data.user_property;
                    }
                });
    };
});

realestateApp.controller('MyOffersController', function ($scope, $http, $stateParams, $location, $rootScope) {
    
    $("html, body").animate({scrollTop: 0}, 600);
    $scope.searchData = {};
    $scope.noResult = true;
    
    $scope.init = function () {
        $http({
            method: 'POST',
            url: get_base_url() + "/user/offers",
            data: $.param($scope.searchData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data) {
                    $("html, body").animate({scrollTop: 0}, 600);
                    if (!data.success) {
                        $scope.noResult = true;
                        $scope.offerList = [];
//                        $rootScope.searchResult = [];
                    } else {

                        $scope.noResult = false;
                        $scope.offerList = data.success.data.user_offer;
//                        $rootScope.searchResult = data.success.data.search_property;
//                            $location.path('/search/1');
                    }
                });
    };
});