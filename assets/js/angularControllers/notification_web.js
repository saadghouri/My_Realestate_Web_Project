var app = angular.module('app', []);
function NotificationListController($scope, $http){
	$scope.nList = { index: 0, limit: 10};
	$scope.isDisabled = false;
	$scope.loadMore = true;
	$scope.notifications;
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
					$scope.workorders = data.success.workorders;
					if(data.success.data.user_type == 1){
						$scope.isSecured = true;
					}
					$scope.init_loadmore();
				}
			});
	};
	$scope.init_loadmore = function(){
		$('#cust_loading').addClass('cl_show');
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
					$scope.notifications = data.success.data;
					$scope.nList.index += data.success.data.length;
					if(data.success.data.length >= $scope.nList.limit)
						$scope.loadMore = false;
					$scope.systemErrors = false;					
				}
				$('#cust_loading').removeClass('cl_show');
				$('#cust_loading').addClass('cl_hide');
			});
	};
	$scope.loadmore = function(){
		$('#cust_loading').removeClass('cl_hide');
		$('#cust_loading').addClass('cl_show');
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
				$('#cust_loading').removeClass('cl_show');
				$('#cust_loading').addClass('cl_hide');
			});
	};
    $scope.redirect_link = function(link){
        window.location.href = link;
    };
}

