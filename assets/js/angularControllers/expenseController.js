var demo = angular.module('demo',['ui.bootstrap']);

function expenseController($scope, $http){

	$scope.loginData = {};
	$scope.expenseData={};
	$scope.userData = {};
	$scope.isTenant=false;

	$scope.tenantReservations=[];
	
	$scope.editExpenseData={};
	$scope.showExpenseSelection=true;
	$scope.showExpenseAssign=false;
	$scope.showHistory=false;
	$scope.tenantPaymentMethod=false;
	$scope.managerPaymentMethod=false;

	$scope.PaymentMethod="select";
	$scope.PaymentNote="";

	
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
	$scope.variableBuildingData.buildingId="select";
	$scope.variableBuildingData.selectedExpenses=[];

	//$scope.variableBuildingData.buildingId;
	//$scope.variableBuildingData.buildingName;
	$scope.tempSelectedTenant;
	$scope.assignExpenseData={};
	$scope.setPaymentDate;
	$scope.assignExpenseData.activeTenantList=[];
	$scope.assignExpenseData.selectedTenants=[];

	
	$scope.reservationData={};
	$scope.reservationData.reservationId;
	$scope.reservationData.reservationExpenses=[];
	$scope.reservationCurrency;
	$scope.reservationData.expensesForPayment=[];
	$scope.reservationData.reservationExpensesHistory=[];
	$scope.subTotalAmountToPay=0;

	$scope.monthToDisplay="";
	$scope.monthHeader=0;





	
	$scope.buildings = [];
	
	
	$scope.expenseData.buildingId;
	$scope.expenseData.expenseName;
	$scope.expenseData.expenseAmount;
	$scope.expenseData.expenseType;


	$scope.editExpenseData.buildingExpenses=[];
	$scope.editExpenseData.building;

	$scope.tenantBankAccountData={};
	$scope.tenantBankAccountData.bankId;
	$scope.tenantBankAccountData.accountNumber;
	$scope.tenantBankAccountData.transitNumber;

	$scope.tenantCardData={};
	$scope.tenantCardData.cardNo;
	$scope.tenantCardData.cvv;
	$scope.tenantCardData.expMonth;
	$scope.tenantCardData.expYear;


	$scope.add_expense_init = function(){
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
					}
					else
					{
						$scope.systemErrors = true;
						$scope.message = "Not Authorized";
						window.location="dashboard.html";

					}
					
					
				}
			});	
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
					$scope.userData = data.success.data;
					if($scope.userData.user_type == 1){
						$scope.message = data.success.message;
						$scope.systemErrors = false;
						$scope.loadBuildingsAndExpense();
						
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
					$scope.defaultBuildingId=getUrlParameter('buildingId');
					
					$scope.loadBuildings();
					
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


	$scope.loadBuildingsAndExpense = function(){
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
					buildingId=getUrlParameter('buildingId');
					for(var i = 0; i < $scope.buildings.length; i++){
				        var building = $scope.buildings[i];
				        if(building.id==buildingId)
				        {
				        	$scope.editExpenseData.building=building;
				        	$scope.loadBuildingExpenses($scope.editExpenseData.building.id,$scope.editExpenseData);
				        }	
				    }
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
					$scope.expenseData.buildingId=getUrlParameter('buildingId');
						
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
					alert("Expense Added Successfully");
					window.location="building_expenses.html?buildingId="+$scope.expenseData.buildingId;
					$scope.resetForm();
					
					//$scope.workorder_id = data.success.id;
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};

	$scope.deleteExpense =function(buildingExpenseId){
		$http({
			method: 'POST',
			data: $.param({"buildingExpenseId":buildingExpenseId}),
			url: get_base_url()+'/expenses/deleteExpense',
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
				$scope.loadBuildingExpenses($scope.editExpenseData.building.id,$scope.editExpenseData)
				alert("Expense deleted Successfully");
				
			}
		});
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

		if($scope.defaultBuildingData.selectedExpenses.length>0|| $scope.variableBuildingData.selectedExpenses.length>0)
		{
			if($("#setPaymentDate").val()!="")
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
				alert("Please Select Due Date");
			}
			
		}
		else
		{
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please select atlease one expense to assign";

			$scope.message = false;
		}
	};

	$scope.assignBuildingExpensesToTenants =function(){
		//alert($scope.expenseData.building);
		if($scope.assignExpenseData.selectedTenants.length>0){
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
					window.location="tenants.html?buildingId="+$scope.defaultBuildingId;
					//$scope.workorder_id = data.success.id;
				}
			});
		} else {
			alert("Please Select at least one tenant");
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
				$("#chk_tenant_"+in_tenant.id).prop("checked","");		
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

	$scope.updateTenantEndDate = function updateTenantEndDate(isValid) {
		if(isValid)
		{
			var date=new Date($("#setEndDate").val());

			var endDate=date.toString("yyyy-MM-dd");//getFullYear()+"-"+(date.getMonth('M')+1)+"-"+date.getDate();
			$http({
				method: 'POST',
				data: $.param({"reservationId":$scope.tempSelectedTenant.reservationId,
					"endDate":endDate}),
				url: get_base_url()+'/common_actions/updateTenantEndDate',
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
					$scope.tempSelectedTenant.endDate=endDate;
					$scope.assignExpenseData.selectedTenants.push($scope.tempSelectedTenant);
					$("#chk_tenant_"+$scope.tempSelectedTenant.id).prop("checked","checked");	
					$("#setEndDateModal").modal("hide");
				}
			});
		}
		
	};

	$scope.tenant_expense_init = function(){
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
					$scope.reservationData.reservationId=getUrlParameter('reservationId');
					
					if($scope.userData.user_type==0)
					{
						$scope.isTenant=true;
						$http({
							method: 'POST',
							data:$.param({"tenantId":$scope.userData.id}),
							url: get_base_url()+'/common_actions/findReservationsByTenant',
							headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
						})

						.success(function(data){
							if(!data.success){
								$scope.systemErrors = data.errors.systemError;
								$scope.message = false;
								$scope.reservationData.reservationExpenses = [];
							} else {
								
								$scope.tenantReservations=data.success.data;

								$scope.reservationData.reservationId=$scope.tenantReservations[0].reservationId;
								$scope.loadReservationExpenses($scope.tenantReservations[0].reservationId);
								//$scope.reservationData.reservationExpenses = data.success.data;
								$scope.systemErrors = false;
							}
						});
						
						
					}	
					else if($scope.reservationData.reservationId!=false)
					{
						$scope.loadReservationExpenses($scope.reservationData.reservationId);
					}	
					//$scope.loadReservationExpenseHistory($scope.reservationData.reservationId);
				}
			});
	};

	$scope.expense_payment_init = function(){
		var chk=$("#form_expensePayment").valid();
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
					if($scope.userData.user_type == 1){
						$scope.managerPaymentMethod=true;
						$scope.reservationData.reservationId=getUrlParameter('reservationId');
						$scope.loadReservationExpenses($scope.reservationData.reservationId);
					}
					else
					{
						$scope.isTenant=true;
						$scope.tenantPaymentMethod=true;
						$scope.findReservationsByTenant($scope.userData.id);
						//$scope.reservationData.reservationId=;
						//$scope.loadReservationExpenses($scope.reservationData.reservationId);
					}

					$scope.systemErrors = false;
					

					
					//$scope.loadReservationExpenseHistory($scope.reservationData.reservationId);
				}
			});
	};

	$scope.findReservationsByTenant=function(in_tenantId)
	{
		$http({
				method: 'POST',
				data:$.param({"tenantId":in_tenantId}),
				url: get_base_url()+'/common_actions/findReservationsByTenant',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.reservationData.reservationExpenses = [];
				} else {
					
					$scope.tenantReservations=data.success.data;
					$scope.reservationData.reservationId=$scope.tenantReservations[0].reservationId;
					$scope.loadReservationExpenses($scope.tenantReservations[0].reservationId);
					//$scope.reservationData.reservationExpenses = data.success.data;
					$scope.systemErrors = false;
				}
			});
	}

	$scope.loadReservationExpenses = function(in_reservationId){
				
			$http({
				method: 'POST',
				data:$.param({"reservationId":in_reservationId}),
				url: get_base_url()+'/expenses/getReservationExpenses',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.reservationData.reservationExpenses = [];
				} else {
					
					$scope.reservationData.reservationExpenses=[];
					$scope.reservationCurrency=data.success.currency;
					angular.forEach(data.success.data, function(item) {
						item['amountToPayNow']=item.remainingToPayForNextDueDate;
						$scope.reservationData.reservationExpenses.push(item);
						
						//$scope.reservationData.reservationExpenses[0].concat(item);
					});
					$scope.message=data.success.message;
					//$scope.reservationData.reservationExpenses = data.success.data;
					$scope.systemErrors = false;
				}
			});
		
	};

	$scope.loadReservationExpenseHistory = function(in_reservationId){
				
			$http({
				method: 'POST',
				data:$.param({"reservationId":in_reservationId}),
				url: get_base_url()+'/expenses/getReservationExpensesHistory',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors = data.errors.systemError;
					$scope.message = false;
					$scope.reservationData.reservationExpenses = [];
				} else {
					
					$scope.showHistory=true;
					$scope.reservationData.reservationExpensesHistory = data.success.data;
					$scope.systemErrors = false;
				}
			});
		
	};

	$scope.payReservationExpenses =function(){
		//alert($scope.expenseData.building);
		var form_bankInfo=true;
		var form_cardInfo=true;

		var chk=$("#form_expensePayment").valid();
		if($scope.PaymentMethod=="BankTransfer")
			form_bankInfo=$("#form_bankInfo").valid();
		else if($scope.PaymentMethod=="CardPayment")
			form_cardInfo=$("#form_cardInfo").valid();
		
		if(chk==true && form_bankInfo==true && form_cardInfo==true){
			var paymentMethod;
			var manuallyEntered=0;
			if(!$scope.isTenant)
				manuallyEntered=1;


			if($scope.tenantPaymentMethod)
				paymentMethod=$("#sel_tenantPaymentMethod").val();
			else
				paymentMethod=$("#sel_managerPaymentMethod").val();

			if(paymentMethod!="select")
			{
				if($scope.getSubTotalAmountToPay()>0)
				{
					$http({
						method: 'POST',
						data: $.param({"reservationId":$scope.reservationData.reservationId,
							"manuallyEntered":manuallyEntered,
							"paymentNote":$scope.PaymentNote,
							"paymentMethod":$scope.PaymentMethod,
							"reservationExpenses":JSON.stringify($scope.reservationData.reservationExpenses),
							"tenantBankAccountData":JSON.stringify($scope.tenantBankAccountData),
							"tenantCardData":JSON.stringify($scope.tenantCardData)}),
						url: get_base_url()+'/expenses/payReservationExpenses',
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
							$scope.PaymentNote="";
							if($scope.isTenant)
							{
								alert("Payment made successfully.");
								window.location="tenant_expenses.html";
							}	
							else	
							{
								alert("Payment Added Successfully");
								window.location='tenant_expenses.html?reservationId='+$scope.reservationData.reservationId;
							}	
								
							//$scope.workorder_id = data.success.id;
						}
					});
				}
				else
				{
					alert("Please fill valid amount");
				}

			} 
			else 
			{
				alert("Please select payment method.");
			}
		}
	};





	$scope.addToExpenseForPayment = function(in_expense){
		//ng-keypress="addToExpenseForPayment(expense)"
		//id="txt_amount_{{ expense.reservationExpenseId }}"
		if(parseInt($("#txt_amount_"+in_expense.reservationExpenseId).val())>0)
		{
			var index = $scope.reservationData.expensesForPayment.indexOf(in_expense);
			if(index==-1)
			$scope.reservationData.expensesForPayment.push(in_expense);
		}
		else
		{
			var index = $scope.reservationData.expensesForPayment.indexOf(in_expense);
	  		$scope.reservationData.expensesForPayment.splice(index, 1);     
		}
	};

	$scope.getSubTotalAmountToPay = function(){
		 var total = 0;
	    for(var i = 0; i < $scope.reservationData.reservationExpenses.length; i++){
	        var expense = $scope.reservationData.reservationExpenses[i];
	        if(expense.amountToPayNow>0)
	        total += parseFloat(expense.amountToPayNow);
	    }
	    return total.toFixed(2);
	}
	$scope.monthsBeingPaid = function(in_expense){
		var temp=1+(parseInt(in_expense.amountToPayNow - in_expense.remainingToPayForNextDueDate)/in_expense.perCycleAmount);
		if((in_expense.remainingToPayForNextDueDate-in_expense.amountToPayNow)>0)
		{
			return "≈"+temp.toFixed(1);
		}
		else
			return temp.toFixed(1);
		
	}

	$scope.getNextPaymentDate = function(in_expense){

		var in_months=$scope.monthsBeingPaid(in_expense);
		var result=0;
		if((in_expense.remainingToPayForNextDueDate-in_expense.amountToPayNow)<=0)
		{
			if(in_months>=1)
			{
				var date=new Date(in_expense.nextPaymentDate);

				date.setMonth(date.getMonth() + parseInt(in_months));
				//result=date.toISOString().slice(0,10).replace(/-/g,"");
				
				result=date.toString('yyyy-MM-dd');	//date.getFullYear()+"-"+(date.getMonth('M')+1)+"-"+date.getDate();
				//date.addMonths(parseInt(in_months));
			}
			else
				result=in_expense.nextPaymentDate;
		}
		else
			result=in_expense.nextPaymentDate;
		
		return result;
	};
	
	$scope.expenseStatus = function(in_expense){
		if(in_expense!=null)
		{
			var date=new Date(in_expense.nextPaymentDate);
			var today=new Date();
			if(in_expense.totalAmountRemaining==0)
			{
				in_expense['status']="Paid";
				in_expense['nextPaymentDate']="N/A";
				in_expense['gray']=true;
			}	
			else if(in_expense.expenseCycle=="One-Time")
				in_expense['status']="One-Time";
			else
				in_expense['status']="Ongoing";

			if(date<today && in_expense['status']!="Paid")
				in_expense['red']=true;
		

		}
		

	};

	$scope.isMonthChngHistory = function(expense){
		
		if($scope.monthToDisplay!=expense.header)
		{
			expense['monthHeader']=1;
			$scope.monthToDisplay=expense.header;	
		}	
		else
			expense['monthHeader']=0; 
		expense['monthHeader']=1;
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
  	$scope.parseFloat=function(amount){
		return parseFloat(amount).toFixed(2);
	};


}