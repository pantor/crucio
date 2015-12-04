angular.module('learnModule')
	.controller('examCtrl', function($scope, $rootScope, $routeParams, Auth, Page, API, $location, $modal) {
		Page.set_title_and_nav('Klausur | Crucio', 'Lernen');

		$scope.user = Auth.getUser();
		$scope.exam_id = $routeParams.id;
		$scope.questionList = {'exam_id': $scope.exam_id, 'list': []};

		$scope.Math = window.Math;

		$scope.current_index = 0;

		API.get('exams/' + $scope.exam_id).success(function(data) {
			$scope.exam = data;

			var questions =  $scope.exam.questions;
			for (i = 0; i < questions.length; i++) {
				var q = questions[i];
				$scope.questionList.list[i] = q;
			}
		});


		$scope.save_answer = function(question_i, given_answer) {
			$scope.questionList.list[question_i].given_result = String(given_answer);
		};

		$scope.scroll_to_top = function() {
			$(window).scrollTop(0);
		};

		$scope.hand_exam = function() {
			sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
			$location.path('/analysis').search('id', null);
		};

		$scope.open_image_model = function (file_name) {
			var modalInstance = $modal.open({
		    	templateUrl: 'imageModalContent.html',
		    	controller: 'ModalInstanceCtrl',
				resolve: {
				    image_url: function () {
				        return file_name;
				    }
				}
			});
		};
	});