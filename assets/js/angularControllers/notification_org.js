var notificationListApp = angular.module('NotificationListApp',['cordovaPushProvider']);

function NotificationListController($scope, $http){
	$scope.nList = { index: 0, limit: 10};
	$scope.isDisabled = false;
	$scope.loadMore = true;
	$scope.notifications;
	$scope.init = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/notification/list',
				data: $.param($scope.nList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					window.location.href = "login.html";
				} else {
					$scope.message = data.success.message;
					$scope.notifications = data.success.data;
					$scope.nList.index += data.success.data.length;
					if(data.success.data.length >= $scope.nList.limit)
						$scope.loadMore = false;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.loadmore = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/notification/list',
				data: $.param($scope.nList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
				} else {
					$scope.message = data.success.message;
					angular.forEach(data.success.data, function(value, key) {
					  $scope.notifications.push(value);
					});
					$scope.nList.index += data.success.data.length;
					if(data.success.data.length >= $scope.nList.limit)
						$scope.loadMore = false;
					else
						$scope.loadMore = true;
					$scope.systemErrors = false;
				}
			});
	};
}