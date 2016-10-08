var myInfoApp = angular.module('MyInfoApp',[]);

function MyInfoController($scope, $http, $sce){
	$scope.isDisabled = false;
	$scope.userData;
	$scope.managerEnabled = false;
	$scope.loggedIn = false;
	$scope.ufData;
	$scope.init = function(){
		if(getUrlParameter('id')){
			$scope.temp_data = { id: getUrlParameter('id') };
			$http({
				method: 'POST',
				data: $.param($scope.temp_data),
				url: get_base_url()+'/user/info',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					if(data.errors.redirectTo){
						window.location.href = data.errors.redirectTo;
					}
				} else {
					$scope.message = data.success.message;
					$scope.userData = data.success.data;
					$scope.systemErrors = false;
					$("#profile_pic").attr('src', data.success.pic_url);
					$scope.loggedIn = data.success.isEditable;
					$scope.ufData = angular.copy(data.success.user_info);
					if(data.success.user_info.gender)
						$scope.ufData.gender = 1;
					else
						$scope.ufData.gender = 0;
					if(data.success.manager){
						$scope.managerEnabled = true;
						$scope.isSecured = true;
					}
				}
			});
		} else {
			$http({
				method: 'POST',
				url: get_base_url()+'/validate_user',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					window.location.href = "login.html";
				} else {
					$scope.unseen_noti = data.success.unseen_noti;
					window.location.href = "myinfo.html?id="+data.success.data.id;
				}
			});
		}
	};
	$scope.updatePrivacySetting = function($event, type){
		var checkbox = $event.target;
		var action = (checkbox.checked ? 1 : 0);
		$scope.temp_data= { type: type, val:action };
		$http({
				method: 'POST',
				data: $.param($scope.temp_data),
				url: get_base_url()+'/user/update/privacy_settings',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.responseMessage = data.success.message;
					$scope.systemErrors = false;
				}
			});
	};

	$scope.update_myprofile = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.ufData),
				url: get_base_url()+'/user/update/profile',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$("html, body").animate({ scrollTop: 0 }, 600);
					$scope.systemErrors_2 = data.errors.systemError;
					$scope.message_2 = false;
				} else {
					$scope.message_2 = data.success.message;
					$scope.systemErrors_2 = false;
					setTimeout($('#myProfileEditModal').modal('hide'), 1000);
					$scope.init();
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};

	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
}