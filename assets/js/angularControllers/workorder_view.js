var WorkOrderViewApp = angular.module('workOrderViewApp',[]);

function WorkOrderViewController($scope, $http, $sce){
	$scope.woData = { id: getUrlParameter('id') };
	$scope.isDisabled = false;
	$scope.workData = { id: getUrlParameter('id') };
	$scope.order;
	$scope.managerEnabled = false;
	$scope.noteData = { id: getUrlParameter('id') };
	$scope.isCompleted = false;

	$scope.iLocations = [];
	$scope.workData.issue_location;

	$scope.buildings = [];
	$scope.workData.building;

	$scope.mcategories = [];
	$scope.workData.cat;

	$scope.subcats = [];
	$scope.workData.subcat;

	$scope.init = function(){
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/view',
				data: $.param($scope.woData),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
					window.location.href = "login.html";
					$('#view_history').css('display', 'none');
					$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
				} else {
					$scope.message = data.success.message;
					$scope.order = data.success.data;
					$scope.work_data = data.success.work_data;
					if($scope.order.status==9){
						$scope.isCompleted = true;
					}
					$scope.systemErrors = false;
					//$scope.workData = data.success.workData;
					if(data.success.manager){
						$scope.managerEnabled = true;
						$scope.isSecured = true;
					}
					if(data.success.jobFlag == 0){
						$('#view_history').css('display', 'none');
					}
					$scope.loadCats();
					$scope.loadIssueLocations();
					$scope.loadBuildings();
					$scope.workData = angular.copy(data.success.workData);
					$scope.update_subCat();
					$scope.issueLocationFlag = true;
				}
				$('#cust_loading').removeClass('cl_show');
				$('#cust_loading').addClass('cl_hide');
			});
	};

	$scope.get_user = function(){
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
					if(data.success.data.user_type){
						$scope.isSecured = true;
					}
					$scope.init();
					$("#user_id").val(data.success.data.id);
				}
			});
	};

	$scope.update_iLoc = function(){
		if($scope.workData.issue_location != null){
			$scope.issueLocationFlag = true;
			$scope.issue_location = $scope.iLocations[$scope.workData.issue_location-1].label;
		} else if($scope.workData.issue_location == null) {
			$scope.issueLocationFlag = false;
		}
	}

	$scope.add_note = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.noteData),
				url: get_base_url()+'/workorderjob/add_note',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.systemErrors_2 = data.errors.systemError;
					$scope.message_2 = false;
				} else {
					$scope.message_2 = data.success.message;
					$scope.systemErrors_2 = false;
					$scope.resetForm();
					setTimeout($scope.hideModal, 1000);
					window.location.href = "workorder_view.html?id="+getUrlParameter('id')+"&history=ture";
				}
			});
		}
	};

	$scope.isCost = function(att){
		if($scope.managerEnabled)
			return true;
		else {
			if(att.label == "Cost")
				return false;
			else
				return true;
		}
	};

	$scope.hideModal = function(){
		$('#myModal').modal('hide');
	};

	$scope.resetForm = function() {
	    $scope.noteData = {};
        $scope.noteForm.$setPristine();
  	};
  	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
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
					$scope.update_iLoc();
					$scope.systemErrors = false;
				}
			});
	};
	$scope.update_subCat = function(){
		if($scope.workData.cat != null){
			$scope.temp = { id: $scope.workData.cat };
			$http({
				method: 'POST',
				url: get_base_url()+'/workorder/subcategories',
				data: $.param($scope.temp),
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
					$scope.systemErrors = false;
				}
			});
	};
	$scope.update_workOrder = function(isValid){
		if(isValid){
			$http({
				method: 'POST',
				data: $.param($scope.workData),
				url: get_base_url()+'/workorder/update',
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$("html, body").animate({ scrollTop: 0 }, 600);
					$scope.systemErrors_2 = data.errors.systemError;
					$scope.message_2 = false;
				} else {
					$scope.message_2 = data.success.message;
					$scope.systemErrors_2 = false;
					$scope.resetForm();
					setTimeout($('#workOrderUpdateModal').modal('hide'), 1000);
					window.location.href = "workorder_view.html?id="+getUrlParameter('id')+"&history=ture";
				}
			});
		} else {
			$("html, body").animate({ scrollTop: 0 }, 600);
			$scope.systemErrors = "Please fill all required fields.";
			$scope.message = false;
		}
	};
}

function workOrderJobListController($scope, $http, $sce){
	$scope.deletedFlag = false;
	$scope.woList = { index: 0, limit: 10, id: getUrlParameter('id'), deleted: $scope.deletedFlag, max: 0, min: 0 };
	$scope.isDisabled = false;
	$scope.loadMore = true;
	$scope.jobs;
	$scope.delete_id = 0;
	$scope.noData = true;
	$scope.isviewButton = true;
	$scope.isLast = false;
	$scope.jlinit = function(){
		$('#cust_loading').removeClass('cl_hide');
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/workorderjob/list',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
				} else {
					$scope.isviewButton = false;
					$scope.message = data.success.message;
					$scope.jobs = data.success.data;
					$scope.woList.index += data.success.data.length;
					if(data.success.data.length > 0){
						$scope.woList.min = data.success.data[0].workorderjob_no;
					}
					$scope.jobs.forEach(function(entry) {
					    if(entry.workorderjob_no > $scope.woList.max){
					    	$scope.woList.max = entry.workorderjob_no;
					    }
					    if(entry.workorderjob_no < $scope.woList.min){
					    	$scope.woList.min = entry.workorderjob_no;
					    }
					});
					if(data.success.data.length >= $scope.woList.limit)
					{
						$scope.loadMore = false;
					} else{
						$scope.loadMore = true;
						$scope.noData = false;
					}
					$scope.systemErrors = false;
					$scope.isLast = data.success.isLast;
				}
				$('#cust_loading').removeClass('cl_show');
				$('#cust_loading').addClass('cl_hide');
			});
	};
	if(getUrlParameter('history')){
		$scope.jlinit();
		$('html, body').animate({
	        scrollTop: $("#workorderJobList").offset().top
	    }, 2000);
	}
	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
	$scope.loadmore = function(){
		$('#cust_loading').removeClass('cl_hide');
		$('#cust_loading').addClass('cl_show');
			$http({
				method: 'POST',
				url: get_base_url()+'/workorderjob/list',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
				} else {
					$scope.message = data.success.message;
					angular.forEach(data.success.data, function(value, key) {
					  $scope.jobs.push(value);
					});
					$scope.jobs.forEach(function(entry) {
					    if(entry.workorderjob_no > $scope.woList.max){
					    	$scope.woList.max = entry.workorderjob_no;
					    }
					    if(entry.workorderjob_no < $scope.woList.min){
					    	$scope.woList.min = entry.workorderjob_no;
					    }
					});
					$scope.woList.index += data.success.data.length;
					if(data.success.data.length >= $scope.woList.limit)
						$scope.loadMore = false;
					else{
						$scope.loadMore = true;
						$scope.noData = false;
					}
					$scope.systemErrors = false;
					$scope.isLast = data.success.isLast;
				}
				$('#cust_loading').removeClass('cl_show');
				$('#cust_loading').addClass('cl_hide');
			});
	};
	$scope.open_workorder = function(id){
		window.location.href = "workorder_view.html?id="+id;
	};
	$scope.delete = function(id){
		$scope.delete_id = id;
		$('#ConfirmationModal').modal('show');
	};
	$scope.updateDeletedFlag = function($event){
		$('#cust_loading').removeClass('cl_hide');
		$('#cust_loading').addClass('cl_show');
		var checkbox = $event.target;
		$scope.deletedFlag = (checkbox.checked ? false : true);
		$scope.woList.deleted = $scope.deletedFlag;
		if($scope.deletedFlag){
			$http({
				method: 'POST',
				url: get_base_url()+'/workorderjob/deletedlist',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
				} else {
					$scope.message = data.success.message;
					angular.forEach(data.success.data, function(value, key) {
					  $scope.jobs.push(value);
					});
					$scope.woList.index += data.success.data.length;
					$scope.systemErrors = false;
				}
				$('#cust_loading').removeClass('cl_show');
					$('#cust_loading').addClass('cl_hide');
			});
		}
	};
	$scope.confirmed = function(){
		alert($scope.delete_id);
		if($scope.delete_id != 0){
			$scope.temp = { id:$scope.delete_id };
			$http({
				method: 'POST',
				url: get_base_url()+'/workorderjob/delete',
				data: $.param($scope.temp),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					$scope.message = false;
					$scope.systemErrors = data.errors.systemError;
				} else {
					$('#ConfirmationModal').modal('hide');
					$('#myModal_woj').modal('show');
					$scope.message = data.success.message;
					for (index = 0, len = $scope.jobs.length; index < len; ++index) {
						if($scope.delete_id == $scope.jobs[index].workorderjob_no){
							$scope.jobs[index].isDeleted = true;
					   		$scope.delete_id = 0;
						}
					}
					$scope.systemErrors = false;
				}
			});
		}
	}
}