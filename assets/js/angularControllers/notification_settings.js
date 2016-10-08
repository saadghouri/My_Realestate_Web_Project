var notificationListApp = angular.module('NotificationListApp',[]);

function NotificationListController($scope, $http){
	$scope.notifications;

	$scope.priorities = [];
	$scope.spriority = { label_15 : "", label_17 : ""};
	$scope.init = function(){
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
					if(data.success.data.user_type == 1){
						$scope.isSecured = true;
					}
					$scope.after_init();
				}
			});
	};
	$scope.after_init = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/notification/settings',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					window.location.href = "login.html";
				} else {
					$scope.loadPriorities();
					$scope.message = data.success.message;
					$scope.notifications = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.updateSelection = function($event, id, type){
		var checkbox = $event.target;
		var action = (checkbox.checked ? 1 : 0);
		$scope.temp_data= { id: id, type: type, val:action };

		$http({
				method: 'POST',
				url: get_base_url()+'/notification/settings/update',
				data: $.param($scope.temp_data),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					checkbox.checked = (checkbox.checked ? false : true);
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
				}
			});
	};

	$scope.loadPriorities = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/priorities',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.priorities = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.updateSettings = function(ref_id){
		var temp_val = "";
		if(ref_id == 15 && $scope.spriority.label_15 != null){
			temp_val = $scope.spriority.label_15;
		} else if(ref_id == 17 && $scope.spriority.label_17 != null){
			temp_val = $scope.spriority.label_17;
		}

		if(temp_val != ""){
			$scope.temp_data= { id: ref_id, type: 'priority', val: temp_val };
			$http({
				method: 'POST',
				url: get_base_url()+'/notification/settings/update_condition',
				data: $.param($scope.temp_data),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					checkbox.checked = (checkbox.checked ? false : true);
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
				}
			});
		}
	};
}