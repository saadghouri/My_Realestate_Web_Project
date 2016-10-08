var CodeVerificationApp = angular.module('codeVerificationApp',[]);

function codeVerificationController($scope, $http){
	$scope.cvData = { code: getUrlParameter('code'), email: getUrlParameter('email') };
	$scope.isDisabled = false;
	console.log($scope);
	$scope.submitForm = function(isValid){
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
					$scope.message = data.success.message;
					$scope.errorCode = false;
					$scope.systemErrors = false;
					window.location.href = "new_password.html?code="+data.success.code+"&email="+data.success.email;
				}
			});
		}
	};
}