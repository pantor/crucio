angular.module('userModule', ['ipCookie'])

	.controller('registerCtrl', function($scope, Page, $route, $http, Validate) {
		$scope.user = angular.fromJson(sessionStorage.user);

		$scope.is_working = 0;
		$scope.semester = 1;
		$scope.course = 1;

		$scope.$watch("username", function( newValue, oldValue ) {
			if(newValue != oldValue) {
				$scope.error_no_name = !Validate.non_empty(newValue);
				$scope.error_duplicate_name = 0;
			}

		}, true);
		$scope.$watch("email", function( newValue, oldValue ) {
			if(newValue != oldValue) {
				$scope.error_no_email = !Validate.email(newValue);
				$scope.error_duplicate_email = 0;
			}
		}, true);
		$scope.$watch("password", function( newValue, oldValue ) {
			if(newValue != oldValue) {
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
			    $http.post('api/v1/users', post_data).success(function(data) {
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
	})


	.controller('activateCtrl', function($scope, Page, $route, $http, $location) {
		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.token = $location.search().token;

		if (!$scope.token) {
			$scope.success = 0;
			$scope.error_no_token = 1;

		} else {
			var post_data = {'token': $scope.token};
			$http.post('api/v1/users/action/activate', post_data).success(function(data) {
				console.log(data);
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
	})


	.controller('forgotPasswordCtrl', function($scope, $location, Page, $route, $http) {
		$scope.user = angular.fromJson(sessionStorage.user);

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
			$http.post('api/v1/users/password/confirm', post_data).success(function(data) {
				$scope.status = data.status;
				$('#forgotConfirmModal').modal('show');
			});
		}

		if ($scope.deny) {
			$scope.reset = 0;

			var data = {'token': $scope.deny};
			$http.post('api/v1/users/password/deny', data).success(function(data) {
				$scope.status = data.status;
				$('#forgotDenyModal').modal('show');
			});
		}

		$scope.$watch("user.email", function( newValue, oldValue ) {
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
				$http.post('api/v1/users/password/reset', data).success(function(data) {	
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
	})


	.controller('loginCtrl', function($scope, Page, $route, $http, ipCookie) {
		$scope.user = angular.fromJson(sessionStorage.user);

		$scope.email = '';
		$scope.remember_me = 1;
		$scope.password = '';

		$scope.login_error = false;

		$scope.$watch("email", function( newValue, oldValue ) {
			$scope.login_error = false;
		}, true);
		$scope.$watch("password", function( newValue, oldValue ) {
			$scope.login_error = false;
		}, true);

		$scope.login = function() {
			if ($scope.email.indexOf("@") == -1)
				$scope.email += '@studserv.uni-leipzig.de';

			var data = {email: $scope.email.replace('@','(@)'), remember_me: $scope.remember_me, password: $scope.password};
			$http.post('api/v1/users/action/login', data).success(function(data) {
				if (data.login == 'success') {
				    if ($scope.remember_me == 1)
				    	ipCookie('CrucioUser', data.logged_in_user, { expires: 21 });

			    	sessionStorage.user = angular.toJson(data.logged_in_user);
			    	window.location.replace('/questions');

			    } else {
			    	$scope.login_error = true;
			    }
			});
		};
	})


	.controller('logoutCtrl', function($scope, Page, ipCookie) {
		$scope.Page = Page;
		$scope.user = angular.fromJson(sessionStorage.user);

		$scope.logout = function() {
			sessionStorage.user = angular.toJson({});
			ipCookie.remove('CrucioUser');
		    window.location.replace(base_url);
		};
	})


	.controller('accountCtrl', function($scope, Page, $http, Validate) {
		Page.set_title_and_nav('Account | Crucio', 'Name');

		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.user.semester = parseInt($scope.user.semester);

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
				$http.put('api/v1/users/' + $scope.user.user_id + '/account', data).success(function(data, status, headers) {
					console.log(data);

					if(data.status == 'success') {
				    	sessionStorage.user = angular.toJson($scope.user);
				    	$scope.submit_button_title = 'Gespeichert';

					} else {
						$scope.user = angular.fromJson(sessionStorage.user);
						$scope.user.semester = parseInt($scope.user.semester);

						if (data.status == 'error_incorrect_password')
							$scope.wrong_password = true;

						$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
					}
				});

			} else {
				$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
			}
		};
	})


	.controller('settingsCtrl', function($scope, Page, $http) {
		Page.set_title_and_nav('Einstellungen | Crucio', 'Name');

		$scope.user = angular.fromJson(sessionStorage.user);

		$('#repetitionSlider').slider({ value: $scope.user.repetitionValue});

		$scope.submit_button_title = 'Speichern';

	    $scope.update_user = function() {
		    $scope.submit_button_title = 'Speichern...';

		    var repetition = $('#repetitionSlider').slider('option', 'value');
		    $scope.user.repetitionValue = repetition;

		    var data = {'highlightExams': $scope.user.highlightExams, 'showComments': $scope.user.showComments, 'repetitionValue': repetition, 'useAnswers': $scope.user.useAnswers, 'useTags': $scope.user.useTags};
		    $http.put('api/v1/users/' + $scope.user.user_id + '/settings', data).success(function(data) {
		      	if (data.status=='success') {
			      	sessionStorage.user = angular.toJson($scope.user);
			      	$scope.submit_button_title = 'Gespeichert';

		      	} else {
		      		$scope.user = angular.fromJson(sessionStorage.user);
		      		$scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
		      	}
		    });
		};

		$scope.remove_all_results = function() {
			var data = {};
			$http.delete('api/v1/results/' + $scope.user.user_id, data);
		};
	})


	.service('Validate', function($http) {
		var whitelist = Array();
		$http.get('api/v1/whitelist').success(function(data) {
			whitelist = data.whitelist;
		});

		this.email = function(email) {
			var regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
			// var regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi

			if (0 === whitelist.length)
				return true;

			if (regex.test(email))
				return true;

			for (var i = 0; i < whitelist.length; i++) {
				if(whitelist[i].mail_address == email)
					return true;
			}
			return false;
		};

		this.password = function(password) {
			if (!password)
				return false;
			if (6 > password.length)
				return false;
			return true;
		};

		this.non_empty = function(text) {
			if (0 === text.length)
				return false;
			return true;
		};
	});