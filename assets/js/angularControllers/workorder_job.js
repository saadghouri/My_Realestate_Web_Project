var LoginApp = angular.module('',['ui.bootstrap']);

function workorderJobController($scope, $http, dateFilter){

	$scope.secureFlag = false;
	$scope.isCompletedFlag = false;
	$scope.isEscalateFlag = false;

	$scope.isRequired = false;

	$scope.workData = { id : getUrlParameter('id') , amount: 0};
	$scope.workorder_id = getUrlParameter('id');
	$scope.workData.startTime = dateFilter(new Date(), 'h:mm a');

	$scope.workData.wo_complete = 0;
	$scope.workData.wo_escalate = 0;

	$scope.priorities = [];
	$scope.workData.priority;

	$scope.assignees =  [];
	$scope.workData.assignee;

	$scope.building_id = 0;

	$scope.popupMessage = "Detail Saved";

	$scope.isSaved = false;

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
					$scope.workData.startTime = data.success.time;
					$('#startTime').timepicker({ 
						setTime: data.success.time
                          });
					$scope.userData = data.success.data;
					$scope.systemErrors = false;
					$scope.loadPriorities();
					$scope.loadWorkOrderDetail();
					if($scope.userData.user_type == 1){
						$scope.secureFlag = true;
						$scope.isSecured = true;
						$scope.presenceFlag = false;
					}
				}
			});
	};
	$scope.update_form = function(){
		if($scope.workData.wo_complete==0){
			$scope.isCompletedFlag = false;
		} else{
			$scope.popupMessage = "Work order job completed.";
			$scope.isCompletedFlag = true;
		}

		if($scope.workData.wo_escalate==0){
			$scope.isEscalateFlag = false;
		} else{
			$scope.isEscalateFlag = true;
		}
	}
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
	$scope.loadAssignees = function(){
		$scope.building = {};
		$scope.building.id = $scope.building_id;
			$http({
				method: 'POST',
				data: $.param($scope.building),
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
					$scope.systemErrors = false;
				}
			});
	};
	$scope.loadWorkOrderDetail = function(){
			$http({
				method: 'POST',
				data: $.param($scope.workData),
				url: get_base_url()+'/workorder/building_id',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.assignees = [];
					$scope.workData.assignee = -1;
				} else {
					$scope.order = data.success.data;
					$scope.systemErrors = false;
					$scope.building_id = data.success.data.building_id;
					$scope.workData.priority = data.success.data.priority;
					$scope.loadAssignees();
					$scope.workData.assignee = data.success.data.assignee_id;
				}
			});
	};
	$scope.save_workOrder = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.workData),
				url: get_base_url()+'/workorderjob/save',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.popupMessage = data.errors.systemError;
					$('#myModal').modal('show');
					$scope.message = false;
				} else {
					$scope.message = data.success.message;
					$scope.systemErrors = false;
					$scope.popupMessage = data.success.popupMessage;
					$('#myModal').modal('show');
					$scope.isSaved = data.success.saved;
					if(data.success.saved)
						$scope.resetForm();
				}
			});
		}
	};
	$scope.updateIsRequired = function(){
		/*if($scope.workData.description == null && $scope.isRequired){
			$scope.isRequired = true;
		} else if($scope.workData.description == null && !$scope.isRequired){
			$scope.isRequired = false;
		} else {
			console.log('Material Changed');
			$scope.isRequired = false;
		}

		if($scope.workData.amount <= 0 && $scope.isRequired){
			$scope.isRequired = true;
		} else if($scope.workData.amount <= 0 && !$scope.isRequired){
			$scope.isRequired = false;
		} else {
			console.log($scope.workData.amount+'Cost');
			$scope.isRequired = false;
		}

		if($scope.workData.note_t == null && $scope.isRequired){
			$scope.isRequired = true;
		} else {
			console.log($scope.workData.note_t+'note_t');
			$scope.isRequired = false;
		}

		if($scope.workData.note_m == null && $scope.isRequired){
			$scope.isRequired = true;
		} else {
			console.log($scope.workData.note_m+'note_m');
			$scope.isRequired = false;
		}*/
		console.log($scope.workData.description+"-"+$scope.isRequired);
	};
	$scope.resetForm = function() {
	    $scope.workData = {};
        $scope.woForm.$setPristine();
  	};
  	$scope.get_workorder_view = function(){
  		if($scope.isSaved)
  			window.location.href = "workorder_view.html?id="+$scope.workorder_id;
  		else
  			$('#myModal').modal('hide');
  	};
  	$scope.checkZero = function(){
  		if($scope.workData.amount == "0.00" || $scope.workData.amount == "0"){
  			$scope.workData.amount = "";
  		}
  	}
  	$scope.checkZeroBlur = function(){
  		if($scope.workData.amount == ""){
  			$scope.workData.amount = 0;
  		}
  	}
}