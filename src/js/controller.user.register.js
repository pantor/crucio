angular.module('userModule')
	.controller('registerCtrl', function($scope, Auth, Page, $route, API, Validate) {
		$scope.user = Auth.getUser();

		$scope.is_working = 0;
		$scope.semester = 1;
		$scope.course = 1;

		$scope.$watch("username", function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.error_no_name = !Validate.non_empty(newValue);
				$scope.error_duplicate_name = 0;
			}

		}, true);
		$scope.$watch("email", function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.error_no_email = !Validate.email(newValue);
				$scope.error_duplicate_email = 0;
			}
		}, true);
		$scope.$watch("password", function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.error_no_password = !Validate.password(newValue);
			}
		}, true);


		$scope.register = function() {
			var validation_passed = 1;
			if (!$scope.username) {
				validation_passed = 0;
				$scope.error_no_name = 1;
			}
			if (!Validate.email($scope.email)) {
				validation_passed = 0;
				$scope.error_no_email = 1;
			}
			if (!Validate.password($scope.password)) {
				validation_passed = 0;
				$scope.error_no_password = 1;
			}
			if ($scope.password != $scope.passwordc) {
				validation_passed = 0;
			}

			if (validation_passed) {
			    $scope.is_working = 1;

			    var post_data = {'username': $scope.username, 'email': $scope.email.replace('@','(@)'), 'semester': $scope.semester, 'course': $scope.course, 'password': $scope.password};
			    API.post('users', post_data).success(function(data) {
				    $scope.is_working = 0;

					if (data.status == 'success') {
						$('#registerSucessModal').modal('show');

					} else if (data.status == 'error_username_taken') {
						$scope.error_duplicate_name = 1;

			        } else if (data.status == 'error_email_taken') {
			            $scope.error_duplicate_email = 1;
			        }
				});
			}
		};
	});