var LoginApp = angular.module('workOrderListApp',[]);

function workOrderListController($scope, $http, $sce){
	$scope.woList = { index: 0, limit: 10, sortType: "timestamp"};
	$scope.isDisabled = false;
	$scope.loadMore = true;
	$scope.orders;
	$scope.isSecured = true;
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
					if(data.success.data.user_type==0)
						$scope.isSecured = false;
					$scope.loadmore_init();
				}
			});
	};
	$scope.loadmore_init = function(){
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/list',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				} else {
					$scope.message = data.success.message;
					$scope.orders = data.success.data;
					$scope.woList.index += data.success.data.length;
					if(data.success.data.length >= $scope.woList.limit)
						$scope.loadMore = false;
					$scope.systemErrors = false;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				}
			});
	};
	$scope.loadmore = function(){
		$('#cust_loading').removeClass('cl_hide');
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/list',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
					$scope.loadMore = true;
				} else {
					$scope.message = data.success.message;
					angular.forEach(data.success.data, function(value, key) {
					  $scope.orders.push(value);
					});
					$scope.woList.index += data.success.data.length;
					if(data.success.data.length >= $scope.woList.limit)
						$scope.loadMore = false;
					else
						$scope.loadMore = true;
					$scope.systemErrors = false;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				}
			});
	};

	$scope.updateList = function(){
		$scope.orders = [];
		$scope.woList.index = 0;
		$scope.woList.limit = 10;
		$scope.loadmore_init();
	};

	$scope.open_workorder = function(id){
		window.location.href = "workorder_view.html?id="+id;
	};
	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
}