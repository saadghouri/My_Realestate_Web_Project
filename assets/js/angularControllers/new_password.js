var NewPasswordApp = angular.module('newPasswordApp',['UserValidation']);

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

function newPasswordController($scope, $http){
	$scope.npData = { code: getUrlParameter('code'), email: getUrlParameter('email') };
	$scope.isDisabled = false;
	console.log($scope);
	$scope.submitForm = function(isValid){
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
}