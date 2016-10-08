var DashboardApp = angular.module('',[]);

function loginController($scope, $http){
	$scope.isLogin = false;
	$scope.init = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/validate_user',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					window.location.href = "login.html";
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
				}
			});
	};
}