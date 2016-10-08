var LoginApp = angular.module('workOrderApp',['ui.bootstrap']);

function workOrderController($scope, $http){

	$scope.loginData = {};
	$scope.workorder_id = 0;
	$scope.presenceFlag = true;
	$scope.isDisabled = false;
	$scope.isHidden = false;
	$scope.issueLocationFlag = false;
	$scope.workData = {};
	$scope.userData = {};
	$scope.mcategories = [];
	$scope.workData.cat;

	$scope.secureFlag = false;
	$scope.workData.presence = 1;

	$scope.iLocations = [];
	$scope.workData.issue_location;

	$scope.priorities = [];
	$scope.workData.priority;

	$scope.buildings = [];
	$scope.workData.building;

	$scope.assignees =  [];
	$scope.workData.assignee = -1;

	$scope.workData.time1_from = "9:00";
	$scope.workData.time2_from = "9:00";
	$scope.workData.time1_to = "17:00";
	$scope.workData.time2_to = "17:00";

	$scope.apartment_no = 0;
	$scope.floor_no = 0;

	$scope.update_form = function(){
		if($scope.workData.presence==0){
			$scope.isHidden = true;
		} else{
			$scope.isHidden = false;
		}
	}
	$scope.update_iLoc = function(){
		if($scope.workData.issue_location != null){
			$scope.issueLocationFlag = true;
			$scope.issue_location = $scope.workData.issue_location.label;
			if($scope.issue_location=="Floor"){
				$scope.workData.iLoc_data = $scope.floor_no;
			} else if($scope.issue_location == "Suite No."){
				$scope.workData.iLoc_data = $scope.apartment_no;
			}
		} else if($scope.workData.issue_location == null) {
			$scope.issueLocationFlag = false;
		}
	}
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
					$scope.unseen_noti = data.success.unseen_noti;
					$scope.userData = data.success.data;
					$scope.systemErrors = false;
					$scope.loadCats();
					$scope.loadIssueLocations();
					$scope.loadBuildings();
					if($scope.userData.user_type == 1){
						$scope.secureFlag = true;
						$scope.isSecured = true;
						$scope.presenceFlag = false;
						$scope.loadPriorities();
					}
				}
			});
	};
	$scope.loadCats = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/categories',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.mcategories = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.loadIssueLocations = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/issueLocations',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.iLocations = data.success.data;
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
					$scope.workData.priority = "3";
					$scope.systemErrors = false;
				}
			});
	};
	$scope.update_subCat = function(){
		if($scope.workData.cat != null){
			$scope.workData.priority = $scope.workData.cat.d_priority;
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/subcategories',
				data: $.param($scope.workData.cat),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.subcats = [];
				} else {
					$scope.subcats = data.success.data;
					$scope.systemErrors = false;
				}
			});
		}
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
					$scope.workData.building = data.success.data[0];
					$scope.loadAssignees();
					$scope.systemErrors = false;
				}
			});
	};
	$scope.loadAssignees = function(){
		if($scope.workData.building != null){
			$http({
				method: 'POST',
				data: $.param($scope.workData.building),
				url: get_base_url()+'/workorder/assignees',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.assignees = [];
					$scope.workData.assignee = -1;
				} else {
					$scope.assignees = data.success.data;
					$scope.workData.assignee = data.success.default_manager_id;
					$scope.systemErrors = false;
					if($scope.userData.user_type == 0){
						if(data.success.apart_no){
							$scope.apartment_no = data.success.apart_no;
						}
						if(data.success.floor_no){
							$scope.floor_no = data.success.floor_no;
						}
					}
				}
			});
		}
	};
	$scope.save_workOrder = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.workData),
				url: get_base_url()+'/workorder/save',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$("html, body").animate({ scrollTop: 0 }, 600);
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
					$scope.resetForm();
					$('#myModal').modal('show');
					$scope.workorder_id = data.success.id;
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};
	$scope.resetForm = function() {
	    $scope.workData = {};
        $scope.woForm.$setPristine();
  	};
  	$scope.get_workorder_view = function(){
  		window.location.href = "workorder_view.html?id="+$scope.workorder_id;
  	};
}