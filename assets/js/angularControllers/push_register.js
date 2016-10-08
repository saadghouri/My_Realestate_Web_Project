var LoginApp = angular.module('workOrderListApp',[]);

function workOrderListController($scope, $http){
	$scope.woList = { user_token: "asdfsdfsadffdsaf" };

	$scope.init = function(){
			$http({
				method: 'POST',
				url: get_base_url()+'/notification/register_push',
				data: $.param($scope.woList),
				headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			})

			.success(function(data){
				if(!data.success){
					console.log(data.errors.systemError);
				} else {
					console.log(data.success.message);
				}
			});
	};
}