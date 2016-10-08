var LoginApp = angular.module('',['UserValidation']);

function registerStep1Controller($scope, $http){
	$scope.invData = { refID: getUrlParameter('refID') };
	$scope.isDisabled = false;
	$scope.isManager = false;
	$scope.init = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/invitations/get_invitation',
				data: $.param($scope.invData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.invalidInvitation = true;
				} else {
					if(data.success.data.role == 1){
						$scope.isManager = true;
					}
					//$scope.message = data.success.message;
					$scope.building_name = data.success.data.building_name;
					$scope.invData.email = data.success.data.email;
					$scope.invData.nemail = data.success.data.email;
					$scope.invData.id = data.success.data.id;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.verify_invitation = function(isValid){
		if(isValid){
			$scope.isDisabled = true;
			$http({
				method: 'POST',
				url: get_base_url()+'/invitations/verify_invitation',
				data: $.param($scope.invData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					//$scope.systemErrors = "Your invitation to "+$scope.building_name+" was canceled. Please contact the landlord and ask them to invite you again, if you believe this is a mistake.";
					$scope.systemErrors = data.errors.systemError;
					$scope.isDisabled = false;
				} else {
					if(data.success.data.registered){
						window.location.href = 'login.html?refID='+$scope.invData.refID;
					} else {
						switch_to("#signup-box");
						$scope.code_required = data.success.code_required;;
					}
				}
			});
		}
	};

	$scope.join_building = function(isValid){
		if($scope.invData.tos_pp){
			if(isValid){
				$scope.isDisabled = true;
				$http({
					method: 'POST',
					url: get_base_url()+'/invitations/join_building',
					data: $.param($scope.invData),
					headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
				})

				.success(function(data){
					if(!data.success){
						//$scope.systemErrors = "Your invitation to "+$scope.building_name+" was canceled. Please contact the landlord and ask them to invite you again, if you believe this is a mistake.";
						$scope.systemErrors2 = data.errors.systemError;
						$scope.isDisabled = false;
						$('html, body').animate({scrollTop: '0px'}, 0);
					} else {
						if(data.success.data.registered){
							window.location.href = 'login.html?refID='+$scope.invData.refID;
						}
						$scope.message2 = data.success.message;
						$scope.systemErrors2 = false;
						if(data.success.data.redirect){
							window.location.href = data.success.data.redirect;
						}
					}
				});
			}
		} else {
			$scope.tos_pp_msg = "You must agree with the Terms of Service and Privacy Policy.";
		}
	};
}

function switch_to(data){
	$('.widget-box.visible').removeClass('visible');//hide others
	$(data).addClass('visible');//show target
}