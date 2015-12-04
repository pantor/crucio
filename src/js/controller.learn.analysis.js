angular.module('learnModule')
	.controller('analysisCtrl', function($scope, Auth, Page, API) {
		Page.set_title_and_nav('Analyse | Crucio', 'Lernen');

		$scope.user = Auth.getUser();
		$scope.questionList = angular.fromJson(sessionStorage.currentQuestionList);

		// Post Results
		for (var question in $scope.questionList.list) {
			if (!question.mark_answer) { // Don't save results again, they were saved during the question page
				if (1 < question.type) { // Don't save free questions
					if (0 < question.given_result) {
						var correct = (question.correct_answer == question.given_result) ? 1 : 0;
						if (0 === question.correct_answer) { correct = -1; }

						var data = {'correct': correct, 'question_id': question.question_id, 'user_id': $scope.user.user_id, 'given_answer': question.given_result};
						API.post('results', data);
					}
				}
				question.mark_answer = 'analysis';
			}
		}

		$scope.workedQuestionList = $scope.questionList.list.getArrayByKey('given_result');
		$scope.exam_id = $scope.questionList.exam_id;

		$scope.all_question_count = $scope.questionList.list.length;
		$scope.worked_question_count = $scope.workedQuestionList.length;

		$scope.correct_q_count = 0;
		$scope.wrong_q_count = 0;
		$scope.seen_q_count = 0;
		$scope.solved_q_count = 0;
		$scope.free_q_count = 0;
		$scope.no_answer_q_count = 0;

		$scope.get_random = function(min, max) {
			if (min > max)
				return -1;

			if (min == max)
				return min;

			var r;
			do {
				r = Math.random();
			} while(1.0 == r);

			return min + parseInt(r * (max - min + 1));
		};

		$scope.random = $scope.get_random(0, 1000);

		for (var question2 in $scope.workedQuestionList) {
			if (question2.correct_answer == question2.given_result && question2.given_result > 0 && question2.correct_answer > 0)
				$scope.correct_q_count++;

			if (question2.correct_answer != question2.given_result && question2.given_result > 0 && question2.correct_answer > 0)
				$scope.wrong_q_count++;

			if (question2.given_result > 0)
				$scope.solved_q_count++;

			if (question2.given_result > -2)
				$scope.seen_q_count++;

			if (1 == question2.type)
				$scope.free_q_count++;

			if (0 === question2.correct_answer  && 1 != question2.type)
				$scope.no_answer_q_count++;
		}

		if ($scope.exam_id) {
			API.get('exams/' + $scope.exam_id).success(function(data) {
				$scope.exam = data;
			});
		}
	});