var LoginApp = angular.module('workOrderJobListApp',[]);

function workOrderJobListController($scope, $http, $sce){
	$scope.deletedFlag = false;
	$scope.woList = { index: 0, limit: 10, id: getUrlParameter('id'), deleted: $scope.deletedFlag, max: 0, min: 0 };
	$scope.isDisabled = false;
	$scope.loadMore = true;
	$scope.jobs;
	$scope.delete_id = 0;
	$scope.noData = true;
	$scope.init = function(){
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
					window.location.href = "login.html";
				} else {
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
				}
			});
	};
	$scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
    };
	$scope.loadmore = function(){
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
				}
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
			});
		}
	};
	$scope.confirmed = function(){
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
					$('#myModal').modal('show');
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