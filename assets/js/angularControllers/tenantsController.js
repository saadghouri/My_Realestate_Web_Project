var LoginApp = angular.module('',['ui.bootstrap']);

function tenantsController($scope, $http){

	$scope.loginData = {};
	$scope.userData = {};
	
	$scope.selectedBuildingId="";
	$scope.activeTenantList=[];
	$scope.showOverdue=true;

	$scope.buildings = [];
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
					$scope.userData = data.success.data;
					$scope.systemErrors = false;
					$scope.loadBuildings();
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
	$scope.loadBuildings = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/common_actions/getBuildingsByManager',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.buildings = [];
				} else {
					$scope.buildings = data.success.data;
					$scope.selectedBuildingId=getUrlParameter("buildingId");
					if($scope.selectedBuildingId!=false)
						$scope.loadActiveReservation($scope.selectedBuildingId);
					
					$scope.systemErrors = false;
				}
			});
	};
	
	$scope.loadActiveReservation = function(in_buildingId){
		$http({
			method: 'POST',
			data:$.param({"buildingId":in_buildingId,"onlyOverdue":$scope.showOverdue,"userId":$scope.userData.id}),
			url: get_base_url()+'/common_actions/getActiveReservationWithOverDueOption',
			headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
		})

		.success(function(data){
			if(!data.success){
				$scope.systemErrors = data.errors.systemError;
				$scope.message = false;
				$scope.activeTenantList = [];
			} else {
				$scope.activeTenantList = data.success.data;
				$scope.systemErrors = false;
			}
		});
			
	};
	$scope.$watch('showOverdue', function() {
      $scope.loadActiveReservation($scope.selectedBuildingId);
   	});

	
	$scope.gotoExpenseSummary = function(in_reservationId){
		window.location = "tenant_expenses.html?reservationId="+in_reservationId;
	};

	$scope.resetForm = function() {
	    $scope.workData = {};
        $scope.woForm.$setPristine();
  	};
  	
}