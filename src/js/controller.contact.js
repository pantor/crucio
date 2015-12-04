angular.module('crucioApp')
	.controller('contactCtrl', function($scope, Auth, Page, API, $routeParams, $location, $modal) {
		$scope.user = $scope.user = Auth.getUser();

		var route_params = $location.search();
		$scope.question_id = route_params.question_id;
		$scope.subject = route_params.s;
		if ($scope.subject == 'Antwort')
			$scope.subject = 'Falsche Antwort';
		$scope.text = '';

		if ($scope.user) {
			$scope.name = $scope.user.username;
			$scope.email = $scope.user.email;
		}

		if ($scope.question_id) {
			API.get('questions/' + $scope.question_id).success(function(data) {
				$scope.question = data.question;
			});
		}

		$scope.is_working = 0;

		$scope.$watch("name", function(newValue, oldValue) {
			$scope.error_no_name = 0;
		}, true);
		$scope.$watch("email", function(newValue, oldValue) {
			$scope.error_no_email = 0;
		}, true);

		$scope.validate_email = function(email) {
			var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (regex.test(email))
				return false;
			return true;
		};

		$scope.send_mail = function() {
			var text = $scope.text;

			var destination = 'kontakt@crucio-leipzig.de';

			var validation_passed = 1;
			if (!$scope.name) {
				validation_passed = 0;
				$scope.error_no_name = 1;
			}
			if ($scope.validate_email($scope.email)) {
				validation_passed = 0;
				$scope.error_no_email = 1;
			}

			if (validation_passed) {
			    $scope.is_working = 1;

			    if ($scope.question_id) {
					destination += ', ' + $scope.question.email; // Author

					var data1 = {'name': $scope.name, 'email': $scope.email.replace('@','(@)'), 'text': text, 'question_id': $scope.question_id, 'author': $scope.question.username, 'question': $scope.question.question, 'exam_id': $scope.question.exam_id, 'subject': $scope.question.subject, 'date': $scope.question.date, 'author_email': $scope.question.email, 'mail_subject': $scope.subject};
					API.post('contact/send-mail-question', data1).success(function(data) {
						$scope.is_working = 0;
					    $scope.open();
					});

				} else {
					var data2 = {'name': $scope.name, 'email': $scope.email.replace('@','(@)'), 'text': text};
					API.post('contact/send-mail', data2).success(function(data) {
						$scope.is_working = 0;
					    $scope.open();
					});
				}
			}
		};

		$scope.open = function () {
			var modalInstance = $modal.open({
		    	templateUrl: 'myModalContent.html'
			});
		};
	});