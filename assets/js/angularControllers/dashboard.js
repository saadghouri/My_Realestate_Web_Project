var LoginApp = angular.module('',[]);

function dashboardController($scope, $http){
	$scope.loginData = {};
	$scope.isSecured = false;
	$scope.userData;
	$scope.workorders = 0;
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
					$scope.userData = data.success.data;
					$scope.unseen_noti = data.success.unseen_noti;
					$scope.workorders = data.success.workorders;
					$scope.systemErrors = false;
					if($scope.userData.user_type == 1){
						$scope.isSecured = true;
					}
				}
			});
	};
}
