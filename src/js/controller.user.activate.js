angular.module('userModule')
	.controller('activateCtrl', function($scope, Auth, Page, API, $route, $location) {
		$scope.user = Auth.getUser();
		$scope.token = $location.search().token;

		if (!$scope.token) {
			$scope.success = 0;
			$scope.error_no_token = 1;

		} else {
			var post_data = {'token': $scope.token};
			API.post('users/action/activate', post_data).success(function(data) {
			    if (data.status == 'error_unknown') {
					$scope.success = 0;
					$scope.error_no_token = 0;
					$scope.error_unknown = 1;

				} else if (data.status == 'error_no_token') {
					$scope.success = 0;
					$scope.error_no_token = 1;
					$scope.error_unknown = 0;

				} else if (data.status == 'success') {
					$scope.success = 1;
					$scope.error_no_token = 0;
					$scope.error_unknown = 0;
				}
			});
		}
	});