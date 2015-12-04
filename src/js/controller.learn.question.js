angular.module('learnModule')
	.controller('questionCtrl', function($scope, Auth, Page, API, $routeParams, $location, $modal) {
		Page.set_title_and_nav('Frage | Crucio', 'Lernen');

		$scope.answerButtonClass = 'btn-primary';

		$scope.user = Auth.getUser();
		$scope.questionList = angular.fromJson(sessionStorage.currentQuestionList);

		$scope.question_id = $routeParams.id;
		$scope.reset_session = $routeParams.reset_session;

		if (!$scope.question_id)
			$window.location.replace('/questions');

		$scope.show_explanation = 0;
		$scope.given_result = 0;
		$scope.strike = {};

		if ($scope.reset_session) {
			$scope.questionList = {};
			sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
		}

		if ($scope.questionList) {
			if (Object.keys($scope.questionList).length) {
				$scope.index = $scope.questionList.list.getIndexBy('question_id', $scope.question_id);
				$scope.length = $scope.questionList.list.length;
				$scope.show_answer = $scope.questionList.list[$scope.index].mark_answer;
				$scope.given_result = $scope.questionList.list[$scope.index].given_result;
				if ($scope.questionList.list[$scope.index].strike)
					$scope.strike = $scope.questionList.list[$scope.index].strike;
			}
		}

		$scope.$watch("strike", function(newValue, oldValue) {
			if ($scope.questionList) {
				if (Object.keys($scope.questionList).length) {
					$scope.questionList.list[$scope.index].strike = newValue;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
				}
			}
		}, true);

		API.get('questions/' + $scope.question_id + '/user/' + $scope.user.user_id).success(function(data) {
			$scope.question = data;

			if ($scope.question.question_image_url)
				$scope.question.question_image_url = '/public/files/' + $scope.question.question_image_url;

			for (var i = 0; i < $scope.question.comments.length; i++) {
				$scope.question.comments[i].voting = ( parseInt($scope.question.comments[i].voting) || 0 );
				$scope.question.comments[i].user_voting = ( parseInt($scope.question.comments[i].user_voting) || 0 );
			}
            
			if ($scope.question.tags) {
    			var array = $scope.question.tags.split(',');
    			$scope.question.tags = [];
    			for (var i = 0; i < array.length; i++)
    			    $scope.question.tags.push({'text': array[i]});
			}
				
			if ($scope.given_result)
				$scope.check_answer($scope.given_result);

			if ($scope.show_answer)
				$scope.mark_answer($scope.given_result);
		});
		
		$scope.updateTags = function(tag) {
    		var string = '';
    		for (var i = 0; i < $scope.question.tags.length; i++)
    		    string += $scope.question.tags[i].text + ',';
            string = string.slice(0, -1);
    		
    		var data = {'tags': string, 'question_id': $scope.question_id, 'user_id': $scope.user.user_id};
            API.post('tags', data);
		};

		// If show solution button is clicked
		$scope.show_solution = function() {
			var correct_answer = $scope.correct_answer();

			var correct = (correct_answer == $scope.given_result) ? 1 : 0;

	    	if (0 === correct_answer)
	    	    correct = -1;
	    	    
	    	if (1 == $scope.question.type)
	    	    correct = -1;

	    	var data = {'correct': correct, 'question_id': $scope.question_id, 'user_id': $scope.user.user_id, 'given_result': $scope.given_result};
	    	API.post('results', data);


			if ($scope.questionList) {
	    		if (Object.keys($scope.questionList).length) {
		    		$scope.questionList.list[$scope.index].mark_answer = 1;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
	    		}
	    	}

			$scope.mark_answer($scope.given_result);
		};

		// Saves the answer
		$scope.save_answer = function(given_answer) {
			$scope.given_result = given_answer;

			if ($scope.questionList) {
				if (Object.keys($scope.questionList).length) {
					$scope.questionList.list[$scope.index].given_result = given_answer;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
				}
			}
	    };

		// Checks the answer box
		$scope.check_answer = function(answer) {
			$scope.checked_answer = answer;
		};

		// Returns correct answer
		$scope.correct_answer = function() {
			return $scope.question.correct_answer;
		};

		// Colors the given answers and shows the correct solution
		$scope.mark_answer = function(given_answer) {
			$scope.mark_answer_free = true;
			var type = $scope.question.type;
			var correct_answer = $scope.correct_answer();
	    	if (type > 1) {
	    		$scope.check_answer(given_answer);

				if(given_answer == correct_answer) {
				    $scope.correctAnswer = given_answer;
				    $scope.answerButtonClass = 'btn-success';
				    
				} else {
				    $scope.wrongAnswer = given_answer;
				    $scope.correctAnswer = correct_answer;
				    $scope.answerButtonClass = 'btn-danger';
				}
	    	} else if (type == 1) {
		    	$scope.answerButtonClass = 'btn-info';
	    	}
		};

		$scope.add_comment = function() {
			var now = new Date() / 1000;
			var post_data = {'comment': $scope.commentText, 'question_id': $scope.question_id, 'reply_to': 0, 'username': $scope.user.username, 'date': now};
	    	API.post('comments/' + $scope.user.user_id, post_data).success(function(data) {
				post_data.voting = 0;
	    		post_data.user_voting = 0;
	    		post_data.comment_id = data.comment_id;
	    		$scope.question.comments.push(post_data);
	    		$scope.commentText = '';
			});
		};

		$scope.delete_comment = function(index) {
			var comment_id = $scope.question.comments[index].comment_id;
			API.delete('comments/' + comment_id);
			$scope.question.comments.splice(index, 1);
		};

		$scope.increase_user_voting = function(current_user_voting, comment_id) {
			var result = current_user_voting == 1 ? 1 : current_user_voting + 1;
			var data = {'user_voting': result};
			API.post('comments/' + comment_id + '/user/' + $scope.user.user_id, data);
			return result;
		};

		$scope.decrease_user_voting = function(current_user_voting, comment_id) {
			var result = current_user_voting == -1 ? -1 : current_user_voting - 1;
			var data = {'user_voting': result};
			API.post('comments/' + comment_id + '/user/' + $scope.user.user_id, data);
			return result;
		};

		$scope.open_image_model = function () {
			var modalInstance = $modal.open({
		    	templateUrl: 'imageModalContent.html',
		    	controller: 'ModalInstanceCtrl',
				resolve: {
    				image_url: function () {
    				    return $scope.question.question_image_url;
    				}
				}
			});
		};
	});