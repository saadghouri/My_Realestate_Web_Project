var LoginApp = angular.module('loginApp',['UserValidation', 'jm.i18next']);

function loginController($scope, $http, $i18next){
	$scope.loginData = { };
	$scope.isDisabled = false;
	$scope.counter = 10;
	
	$scope.init = function(){
		$scope.counter--;
			$http({
				method: 'POST',
				url: get_base_url()+'/validate_user',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.systemErrors = false;
					$scope.message = false;
					$('#login_btn').button('reset');
				} else {
					$('#login_btn').button('complete');
					$scope.message = data.success.message;
					$scope.systemErrors = false;
					window.location.href = "dashboard.html";
				}
			})
			.error(function(data, status){
				if(status == 0){
					if($scope.counter>0){
						$scope.counter--;
						$scope.systemErrors = "Connectivity problem while logging in. Trying to connect...";
					} else {
						$scope.systemErrors = "Connectivity problem while logging in. Please refresh the page.";
					}
					$scope.message = false;
					
				}
			});
	};
	$scope.submitLoginForm = function(isValid){
		if(isValid){
			$('#login_btn').button('loading');
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/do_login',
				data: $.param($scope.loginData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.errorEmail = data.errors.email;
					$scope.errorPassword = data.errors.password
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
					if(getUrlParameter('refID')){
						window.location.href = "join_building.html?refID="+getUrlParameter('refID');
					} else
						window.location.href = "dashboard.html";
				}
			})
			.error(function(data, status){
				if(status == 0){
					$scope.systemErrors = "Connectivity problem while logging in. Please try again.";
					$scope.message = false;
					$scope.isDisabled = false;
				}
			});
		}
	};

	$scope.changeLng = function (lng) {
		if (lng === 'patrick') {
			$i18next.options.postProcess = 'patrick';
		} else {
			$i18next.options.postProcess = '';
			$i18next.options.lng = lng;
			console.log($i18next.debugMsg[$i18next.debugMsg.length - 1]);
		}
	};
}

function resetPassController($scope, $http, $i18next, $sce){
	$scope.rpData = {};
	$scope.cvData = { code: getUrlParameter('code'), email: getUrlParameter('email') };
	$scope.isDisabled = false;
	$scope.resetForm = true;
	$scope.newPassword = false;
	$scope.npData = {};
	$scope.submitrpForm = function(isValid){
		if(isValid){
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/reset_password',
				data: $.param($scope.rpData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.errorEmail = data.errors.email;
					$scope.systemErrors = data.errors.systemError;
					$scope.isDisabled = false;
				} else {
					$scope.isDisabled = true;
					$scope.message = data.success.message;
					$scope.cvData.code = data.success.code;
					$scope.cvData.email = data.success.email;
					$scope.npData.code = data.success.code;
					$scope.npData.email = data.success.email;
					$scope.errorEmail = false;
					$scope.resetForm = false;
				}
			});
		}
	};

	$scope.submitcvForm = function(isValid){
		if(isValid){
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/code_verification',
				data: $.param($scope.cvData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.errorCode = data.errors.code;
					$scope.systemErrors = data.errors.systemError;
					$scope.isDisabled = false;
				} else {
					$scope.isDisabled = true;
					$scope.npData.code = data.success.code;
					$scope.message = data.success.message;
					$scope.errorCode = false;
					$scope.systemErrors = false;
					$scope.newPassword = true;					
				}
			});
		}
	};

	$scope.submitnpForm = function(isValid){
		if(isValid){
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/new_password',
				data: $.param($scope.npData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.errorPass = data.errors.pass;
					$scope.errorCPass = data.errors.cpass;
					$scope.systemErrors = data.errors.systemError;
					$scope.isDisabled = false;
				} else {
					$scope.isDisabled = true;
					$scope.message = data.success.message;
					$scope.errorCode = false;
					$scope.systemErrors = false;
					window.location.href = "login.html";
				}
			});
		}
	};
	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
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
})

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
		fallbackLng: 'en', // Default is dev
		useCookie: false,
		useLocalStorage: false,
		resGetPath: 'assets/ln/locales/__lng__.json'
	};
});