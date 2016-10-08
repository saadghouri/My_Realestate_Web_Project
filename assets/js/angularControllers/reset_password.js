var ResetPassApp = angular.module('resetPassApp',[]);

function resetPassController($scope, $http){
	$scope.rpData = {};
	$scope.isDisabled = false;
	$scope.submitForm = function(isValid){
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
					$scope.errorEmail = false;
					window.location.href = "code_verification.html?code="+data.success.code+"&email="+data.success.email;
				}
			});
		}
	};
}