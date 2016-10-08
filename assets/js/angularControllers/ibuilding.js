var ibulidingApp = angular.module('ibulidingApp',[]);

function iBuildingController($scope, $http, $sce){

	$scope.loginData = {};
	$scope.workorder_id = 0;

	$scope.isHidden = true;

	$scope.workData = {};
	$scope.userData = {};

	$scope.buildings = [];
	$scope.workData.building;

	$scope.pendingInvitations = [];
	$scope.canceledInvitations = [];

	$scope.update_form = function(){
		if($scope.workData.building==0){
			$scope.isHidden = true;
		} else{
			$scope.isHidden = false;
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
					$scope.unseen_noti = data.success.unseen_noti;
					if(data.success.data.user_type == 0){
						window.location.href = "dashboard.html";
					} else {
						$scope.message = data.success.message;
						$scope.userData = data.success.data;
						$scope.systemErrors = false;
							$scope.isSecured = true;
						$scope.loadBuildings();
					}
				}
			});
	};
	$scope.loadPendingList = function(){
			$http({
				method: 'POST',
				data: $.param($scope.workData.building),
				url: get_base_url()+'/invitations/get_pending_list',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.pendingInvitations = [];
					$scope.message = false;
				} else {
					$scope.pendingInvitations = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};
	$scope.loadCanceledList = function(){
			$http({
				method: 'POST',
				data: $.param($scope.workData.building),
				url: get_base_url()+'/invitations/get_canceled_list',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.canceledInvitations = [];
					$scope.message = false;
				} else {
					$scope.canceledInvitations = data.success.data;
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
	$scope.send_inv = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.workData),
				url: get_base_url()+'/invitations/send',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$scope.responseMessage = data.success.message;
					$scope.systemErrors = false;
					$('#responseModal').modal('show');
					$scope.resetForm();
				}
			});
		} else {
			$scope.$broadcast('kickOffValidations');
		}
	};

	$scope.resend = function(id){
		if(id != null && id != 0){
			$scope.tempResend = { id: id };
			$http({
				method: 'POST',
				data: $.param($scope.tempResend),
				url: get_base_url()+'/invitations/resend',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
				} else {
					$('#resend_btn_'+id).html('<button class="btn btn-xs disabled btn-gray" style="margin-top: -20px;padding: 0px;">Sent</button>');
				}
			});
		} else {
			$scope.$broadcast('kickOffValidations');
		}
	};

	$scope.updateRole = function($event, id){
		var checkbox = $event.target;
		var action = (checkbox.checked ? 1 : 0);
		$scope.temp_data= { id: id, type: "role", val:action };
		$http({
				method: 'POST',
				data: $.param($scope.temp_data),
				url: get_base_url()+'/invitations/updateRole',
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

	$scope.updateCanceled = function($event, id){
		var checkbox = $event.target;
		var action = (checkbox.checked ? 1 : 0);
		$scope.temp_data= { id: id, type: "cancel", val:action };
		$http({
				method: 'POST',
				data: $.param($scope.temp_data),
				url: get_base_url()+'/invitations/updateCanceled',
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

	$scope.removeSpace = function(){
		if($scope.workData.tenants){
			var temp = $scope.workData.tenants;
			temp = temp.replace(/ +(?= )/g,'');
			$scope.workData.tenants = temp.replace(/\n+(?=\r\n|\n|\r)/gm,"");
		}
		if($scope.workData.managers){
			var temp = $scope.workData.managers;
			temp = temp.replace(/ +(?= )/g,'');
			$scope.workData.managers = temp.replace(/\n+(?=\r\n|\n|\r)/gm,"");
		}
	}
	$scope.resetForm = function() {
		$scope.isHidden = true;
	    $scope.workData = {};
        $scope.invForm.$setPristine();
  	};
  	$scope.get_workorder_view = function(){
  		window.location.href = "workorder_view.html?id="+$scope.workorder_id;
  	};

  	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
}