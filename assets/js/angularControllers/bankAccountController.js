var LoginApp = angular.module('demo',['ui.bootstrap']);

function bankAccountController($scope, $http){

	$scope.loginData = {};
	$scope.userData = {};
	$scope.isTenant=false;

	$scope.bankAccountData={};
	$scope.bankAccountData.buildingId;
	$scope.bankAccountData.bankId;
	$scope.bankAccountData.bankAccountNumber;
	$scope.bankAccountData.bankTransitNumber;

	
	$scope.defaultBuildingId;
	$scope.defaultBuildingData={};
	$scope.defaultBuildingData.buildingExpenses=[];
	$scope.defaultBuildingData.building;
	$scope.defaultBuildingData.selectedExpenses=[];

	$scope.selectedBuildingId;
	$scope.buildings = [];
	
	$scope.bankAccount=[];

	
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
					$scope.userData = data.success.data;
					if($scope.userData.user_type == 1){
						$scope.message = data.success.message;
						$scope.systemErrors = false;
						$scope.loadBuildings();
						
						//if(buildingId)
						//	$scope.expenseData.building.id=buildingId;
						//alert($scope.expenseData.building.id);
					}
					else
					{
						$scope.systemErrors = true;
						$scope.message = "Not Authorized";
						window.location="dashboard.html";

					}
					
					
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
					$scope.systemErrors = false;
				}
			});
	};

	$scope.loadBuildingBankAccount = function(){

		$http({
				method: 'POST',
				data: $.param({"buildingId":$scope.selectedBuildingId}),
				url: get_base_url()+'/bankaccount/loadBuildingBankAccount',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				$scope.bankAccountData.buildingId=$scope.selectedBuildingId;
				if(!data.success){
					$("html, body").animate({ scrollTop: 0 }, 600);
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.bankAccountData = {};
        			$scope.saveBankAccountForm.$setPristine();

				} else {
					$scope.bankAccountData.buildingId=data.success.data['buildingId'];
					$scope.bankAccountData.bankTransitNumber=data.success.data['transitNumber'];
					$scope.bankAccountData.bankId=data.success.data['bankId'];
					$scope.bankAccountData.bankAccountNumber=data.success.data['accountNumber'];
					$scope.systemErrors = false;
					//$scope.workorder_id = data.success.id;
				}
			});
	}

	$scope.saveBankAccount =function(isValid){

		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.bankAccountData),
				url: get_base_url()+'/bankaccount/saveBankAccount',
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
					alert("Bank Account Added Successfully");
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};



	$scope.resetForm = function() {
	    $scope.expenseData = {};
        $scope.addExepenseForm.$setPristine();
  	};
  	$scope.get_workorder_view = function(){
  		window.location.href = "workorder_view.html?id="+$scope.workorder_id;
  	};
}