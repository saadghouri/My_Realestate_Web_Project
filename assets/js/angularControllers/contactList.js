var LoginApp = angular.module('',[]);

function contactController($scope, $http){
	$scope.loginData = {};
	$scope.isSecured = false;
	$scope.userData;
	$scope.contacts = [];
	$scope.contactList = { building_id : 0, user_type: 0, index: 0, limit: 20};

	$scope.buildings = [];
	$scope.building = 0;

	$scope.searchText;

	$scope.isVisible = false;
	$scope.loadMore = true;
	$scope.isLast = true;

	$scope.init = function(type){
		$scope.contactList.user_type = type;

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
					$scope.unseen_noti = data.success.unseen_noti;
					if(data.success.data.user_type == 1){
						$scope.isSecured = true;
					}
					/*
					if(!$scope.isSecured){
						if($scope.contactList.user_type ==1)
							window.location.href = 'dashboard.html';
					}
					*/
					$scope.loadBuildings();
					//$scope.message = data.success.message;
					$scope.systemErrors = false;
				}
			});
	};

	$scope.loadBuildings = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/buildings',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.buildings = [];
				} else {
					$scope.buildings = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};

	$scope.loadmore_init = function(){
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/contacts/get_manager_list',
				data: $.param($scope.contactList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.isVisible = false;
					//$scope.systemErrors = data.errors.systemError;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				} else {
					$scope.isVisible = true;
					//$scope.message = data.success.message;
					$scope.contactList.index += data.success.data.length;
					if(data.success.data.length >= $scope.contactList.limit)
						$scope.loadMore = false;

					$scope.contacts = data.success.data;
					$scope.systemErrors = false;
					$scope.isLast = data.success.isLast;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				}
			});
	};

	$scope.loadmore_act = function(){
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/contacts/get_manager_list',
				data: $.param($scope.contactList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					//$scope.systemErrors = data.errors.systemError;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				} else {
					$scope.isVisible = true;
					//$scope.message = data.success.message;
					$scope.contactList.index += data.success.data.length;
					if(data.success.data.length >= $scope.contactList.limit)
						$scope.loadMore = false;
					else
						$scope.loadMore = true;
					angular.forEach(data.success.data, function(value, key) {
					  $scope.contacts.push(value);
					});
					$scope.systemErrors = false;
					$scope.isLast = data.success.isLast;
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				}
			});
	};

	$scope.updateResult = function(){
		if($scope.building != null && $scope.building != 0){
			$scope.contactList.searchQuery = $scope.searchText;
			$scope.isLast = true;
			$scope.contactList.limit = 20;
			$scope.contactList.index = 0;
			$scope.loadmore_init();
		}
	};

	$scope.redirectToProfile = function(id){
		window.location.href = "myinfo.html?id="+id;
	};

	$scope.loadContacts = function(){
		if($scope.building != null){
			$scope.contactList.building_id = $scope.building.id;
		$scope.loadmore_init();
		} else {
			$scope.isVisible = false;
		}
	};
}
