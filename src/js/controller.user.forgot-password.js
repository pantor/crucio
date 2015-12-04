angular.module('userModule')
	.controller('forgotPasswordCtrl', function($scope, $location, Auth, Page, $route, API) {
		$scope.user = Auth.getUser();

		$scope.confirm = $location.search().confirm;
		$scope.deny = $location.search().deny;

		$scope.is_working = 0;

		$scope.error_email = 0;
		$scope.error_already_requested = 0;

		if (!$scope.confirm && !$scope.deny)
			$scope.reset = 1;

		if ($scope.confirm) {
			$scope.reset = 0;

			var post_data = {'token': $scope.confirm};
			API.post('users/password/confirm', post_data).success(function(data) {
				$scope.status = data.status;
				$('#forgotConfirmModal').modal('show');
			});
		}

		if ($scope.deny) {
			$scope.reset = 0;

			var data = {'token': $scope.deny};
			API.post('users/password/deny', data).success(function(data) {
				$scope.status = data.status;
				$('#forgotDenyModal').modal('show');
			});
		}

		$scope.$watch("user.email", function(newValue, oldValue) {
			$scope.error_email = 0;
			$scope.error_already_requested = 0;
		}, true);

		$scope.reset_password = function() {
			var validate = true;
			if (!$scope.user) {
				validate = false;
				$scope.error_email = 1;
			} else if (!$scope.user.email) {
				validate = false;
				$scope.error_email = 1;
			}

			if (validate) {
				$scope.is_working = 1;

				var data = {'email': $scope.user.email.replace('@','(@)')};
				API.post('users/password/reset', data).success(function(data) {	
					$scope.is_working = 0;
					
					if (!data) {
						$scope.error_email = 1;
						
					} else {
						
						if (data.status == 'success') {
							$scope.error_email = 0;
							$scope.error_already_requested = 0;
						
							$('#forgotSucessModal').modal('show');
						
						} else if(data.status == 'error_email') {
							$scope.error_email = 1;
						
						} else if(data.status == 'error_already_requested') {
							$scope.error_already_requested = 1;
						}
					}
				});
			}
		};
	});
