var LoginApp = angular.module('',['UserValidation']);

function registerStep1Controller($scope, $http){
	$scope.invData = { refID: getUrlParameter('refID') };
	$scope.isDisabled = false;
	$scope.isManager = false;
	$scope.redirectURI = "login.html";
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
					$scope.get_invitation();
					$scope.systemErrors = false;
				}
			});
	};

	$scope.get_invitation = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/invitations/get_invitation_s',
				data: $.param($scope.invData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					if(data.success.data.role){
						$scope.isManager = true;
					}
					//$scope.message = data.success.message;
					$scope.building_name = data.success.data.building_name;
					$scope.invData.email = data.success.data.email;
					$scope.invData.id = data.success.data.id;
					$scope.systemErrors = false;
				}
			});
	};

	$scope.join_building = function(isValid){
		if(isValid){
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/invitations/join_building_s',
				data: $.param($scope.invData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					//$scope.systemErrors = "Your invitation to "+$scope.building_name+" was canceled. Please contact the landlord and ask them to invite you again, if you believe this is a mistake.";
					$scope.systemErrors = data.errors.systemError;
					$scope.isDisabled = false;
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
					if(data.success.data.redirect){
						$('#myModal').modal('show');
						$scope.popupMessage = data.success.message;
						$scope.redirectURI = data.success.data.redirect;
					}
				}
			});
		}
	};

	$scope.get_redirect = function(){
		window.location.href = $scope.redirectURI;
	};
}