angular.module('userModule')
	.controller('accountCtrl', function($scope, Auth, Page, API, Validate) {
		Page.set_title_and_nav('Account | Crucio', 'Name');

		$scope.user = Auth.getUser();

		$scope.Validate = Validate;

		$scope.old_password = '';
		$scope.wrong_password = false;

		$scope.submit_button_title = 'Speichern';

		$scope.$watch("user.email", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);
		$scope.$watch("old_password", function( newValue, oldValue ) {
			if (newValue != oldValue) {
				$scope.submit_button_title = 'Speichern';
				$scope.wrong_password = false;
			}
		}, true);
		$scope.$watch("new_password", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);
		$scope.$watch("new_password_c", function( newValue, oldValue ) {
			if (newValue != oldValue)
				$scope.submit_button_title = 'Speichern';
		}, true);

		$scope.save_user = function() {
			var validate = true;
			if (!Validate.email($scope.user.email))
				validate = false;
			if ($scope.user.semester < 1)
				validate = false;
			if ($scope.user.semester > 30)
				validate = false;

			// Assuming User Wants to Change Password
			if ($scope.old_password.length > 0) {
				if ($scope.new_password.length < 6)
					validate = false;
				if ($scope.new_password != $scope.new_password_c)
					validate = false;
			}

			if (validate) {
				$scope.submit_button_title = 'Speichern...';

				var data = {'email': $scope.user.email.replace('@','(@)'), 'course_id': $scope.user.course_id, 'semester': $scope.user.semester, 'current_password': $scope.old_password, 'password': $scope.new_password};
				API.put('users/' + $scope.user.user_id + '/account', data).success(function(data, status, headers) {
					if (data.status == 'success') {
    					Auth.setUser($scope.user);
				    	$scope.submit_button_title = 'Gespeichert';

					} else {
						$scope.user = Auth.getUser();

						if (data.status == 'error_incorrect_password')
							$scope.wrong_password = true;

						$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
					}
				});

			} else {
				$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
			}
		};
	});