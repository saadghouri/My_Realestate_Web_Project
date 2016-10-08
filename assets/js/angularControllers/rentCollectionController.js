var LoginApp = angular.module('',['ui.bootstrap']);

function rentCollectionController($scope, $http){

	$scope.loginData = {};
	$scope.expenseData={};
	$scope.editExpenseData={};
	$scope.showExpenseSelection=true;
	$scope.showExpenseAssign=false;

	
	$scope.defaultBuildingId;
	$scope.defaultBuildingData={};
	$scope.defaultBuildingData.buildingExpenses=[];
	$scope.defaultBuildingData.building;
	$scope.defaultBuildingData.selectedExpenses=[];
	
	//$scope.defaultBuilding.buildingId;
	//$scope.defaultBuilding.buildingName;

	$scope.variableBuildingData={};
	$scope.variableBuildingData.buildingExpenses=[];
	$scope.variableBuildingData.building;
	$scope.variableBuildingData.selectedExpenses=[];

	//$scope.variableBuildingData.buildingId;
	//$scope.variableBuildingData.buildingName;
	$scope.tempSelectedTenant;
	$scope.assignExpenseData={};
	$scope.setPaymentDate;
	$scope.assignExpenseData.activeTenantList=[];
	$scope.assignExpenseData.selectedTenants=[];

	



	
	$scope.buildings = [];
	
	
	$scope.expenseData.building;
	$scope.expenseData.expenseName;
	$scope.expenseData.expenseAmount;
	$scope.expenseData.expenseType;


	$scope.editExpenseData.buildingExpenses=[];
	$scope.editExpenseData.building;


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
					buildingId=getUrlParameter('buildingId');
					if(buildingId)
					$scope.expenseData.building.id=buildingId;
					if($scope.userData.user_type == 1){
						//$scope.presenceFlag = false;
					}
				}
			});
	};


	$scope.expense_selection_init = function(){
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
					$scope.defaultBuildingId=getUrlParameter('buildingId');
					$scope.loadBuildingExpenses($scope.defaultBuildingId,$scope.defaultBuildingData);
				}
			});
	}


	$scope.assign_expense_init = function(){
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
					$scope.defaultBuildingId=getUrlParameter('buildingId');
					$scope.loadActiveReservation($scope.defaultBuildingId);
				}
			});
	}



	
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

	$scope.loadBuildingExpenses = function(in_buildingId,in_buildingExpense){
			$http({
				method: 'POST',
				data:$.param({"buildingId":in_buildingId}),
				url: get_base_url()+'/expenses/loadBuildingExpenses',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					in_buildingExpense.buildingExpenses = [];
					//$scope.editExpenseData.buildingExpenses = [];
				} else {
					in_buildingExpense.buildingExpenses = data.success.data;
					//$scope.editExpenseData.buildingExpenses = data.success.data;
					$scope.systemErrors = false;
				}
			});
	};
	
	$scope.addExpense =function(isValid){
		//alert($scope.expenseData.building);

		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.expenseData),
				url: get_base_url()+'/expenses/addExpense',
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
					alert("Expense Added Successfully");
					//$scope.workorder_id = data.success.id;
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};

	$scope.updateBuildingExpenses =function(isValid){
		//alert($scope.expenseData.building);
		if(isValid){
			$http({
				method: 'POST',
				data: $.param({"buildingId":$scope.editExpenseData.building.id,"buildingExpenses":JSON.stringify($scope.editExpenseData.buildingExpenses)}),
				url: get_base_url()+'/expenses/updateBuildingExpenses',
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
					alert("Expense Updated Successfully");
					//$scope.workorder_id = data.success.id;
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};
	

	$scope.loadActiveReservation = function(in_buildingId){

		if($scope.defaultBuildingData.selectedExpenses.length>0)
		{
			
			$scope.showExpenseSelection=false;
			$scope.showExpenseAssign=true;

			$http({
				method: 'POST',
				data:$.param({"buildingId":in_buildingId}),
				url: get_base_url()+'/common_actions/getActiveReservation',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.assignExpenseData.activeTenantList = [];
				} else {
					$scope.assignExpenseData.activeTenantList = data.success.data;
					$scope.systemErrors = false;
				}
			});
		}
		else
		{
			$scope.systemErrors = "Please select atlease one expense to assign";
			$scope.message = false;
		}
	};

	$scope.assignBuildingExpensesToTenants =function(){
		//alert($scope.expenseData.building);
		if(true){
			$http({
				method: 'POST',
				data: $.param({"buildingId":$scope.defaultBuildingId,
					"paymentDate":$("#setPaymentDate").val(),
					"selectedTenants":JSON.stringify($scope.assignExpenseData.selectedTenants),
					"defaultSelectedExpenses":JSON.stringify($scope.defaultBuildingData.selectedExpenses),
					"variableSelectedExpenses":JSON.stringify($scope.variableBuildingData.selectedExpenses),
				}),
				url: get_base_url()+'/expenses/assignBuildingExpensesToTenants',
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
					alert("Expense Updated Successfully");
					//$scope.workorder_id = data.success.id;
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};


	$scope.addToSelectedExpense = function(in_expense){
		if($("#chk_"+in_expense.buildingExpenseId).is(':checked'))
			$scope.defaultBuildingData.selectedExpenses.push(in_expense);
		else
		{
			var index = $scope.defaultBuildingData.selectedExpenses.indexOf(in_expense)
	  		$scope.defaultBuildingData.selectedExpenses.splice(index, 1);     
		}
	};

	$scope.addToVariableSelectedExpense = function(in_expense){
		if($("#chk_variable_"+in_expense.buildingExpenseId).is(':checked'))
			$scope.variableBuildingData.selectedExpenses.push(in_expense);
		else
		{
			var index = $scope.variableBuildingData.selectedExpenses.indexOf(in_expense)
	  		$scope.variableBuildingData.selectedExpenses.splice(index, 1);     
		}
	};

	$scope.addToSelectedTenant = function(in_tenant){
		if($("#chk_tenant_"+in_tenant.id).is(':checked'))
		{
			if(in_tenant.endDate==null)
			{
				$scope.tempSelectedTenant=in_tenant;
				$("#setEndDateModal").modal("show");
			}
			else
				$scope.assignExpenseData.selectedTenants.push(in_tenant);

		}
			
		else
		{
			var index = $scope.assignExpenseData.selectedTenants.indexOf(in_tenant)
	  		$scope.assignExpenseData.selectedTenants.splice(index, 1);     
		}
	};

	


	$scope.gotoExpenseSelection=function(){
		$scope.showExpenseAssign=false;
		$scope.showExpenseSelection=true;
	};


	$scope.resetForm = function() {
	    $scope.expenseData = {};
        $scope.addExepenseForm.$setPristine();
  	};
  	$scope.get_workorder_view = function(){
  		window.location.href = "workorder_view.html?id="+$scope.workorder_id;
  	};
}