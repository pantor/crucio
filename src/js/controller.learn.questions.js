angular.module('learnModule')
    .controller('questionsCtrl', function($scope, Page, $location, API, Selection) {
		Page.set_title_and_nav('Lernen | Crucio', 'Lernen');

		$scope.user = angular.fromJson(sessionStorage.user);
		if (!$scope.user)
			window.location.replace(base_url);

		$scope.exam_search = {'subject': '', 'semester': '', 'query': '', 'query_keys': ['subject', 'semester', 'date']};
		$scope.comment_search = {'query': '', 'query_keys': ['comment', 'username', 'question_id']};
		$scope.tag_search = {'query': '', 'query_keys': ['tag']};

		$scope.subject_list = subject_list;

		$scope.question_field_message = '';

		$scope.selection_subject_list = {};
		$scope.selection_number_questions = 0;
		$scope.number_questions_in_choosen_subjects = 0;
		$scope.conditions = 1;


		var spinner = new Spinner({length: 0, radius: 18, color: '#333', shadow: false});
		$('#numberSlider').slider({ value: $scope.selection_number_questions, step: 10, min: 0, max: $scope.number_questions_in_choosen_subjects});

		$scope.$watch("selection_subject_list", function( newValue, oldValue ) {
			var post_data = {ignoreLoadingBar: true, selection_subject_list: $scope.selection_subject_list};
			API.post('learn/number-questions', post_data).success(function(data) {
				$scope.number_questions_in_choosen_subjects = data.number_questions;

				if (0 === $scope.selection_number_questions) {
					$scope.selection_number_questions = Math.min($scope.number_questions_in_choosen_subjects, 50);
				}

				if ($scope.selection_number_questions > $scope.number_questions_in_choosen_subjects) {
					$scope.selection_number_questions = $scope.number_questions_in_choosen_subjects;
				}
			});
		}, true);

		$scope.$watch("number_questions_in_choosen_subjects", function( newValue, oldValue ) {
			var max = $scope.number_questions_in_choosen_subjects;
			if (max > 200)
				max = 200;

			var step = 10;
			if (max < 100)
				step = 10;
			if (max < 40)
				step = 4;
			if (max < 20)
				step = 1;

			if (max < 200)
				if (max % step !== 0)
					max += step;
			$('#numberSlider').slider({ value: $scope.selection_number_questions, step: step, min: 0, max: max});
		}, true);

		API.get('exams/user_id/' + $scope.user.user_id).success(function(data) {
			$scope.exams = data.exam;
			$scope.distinct_semesters = Selection.find_distinct($scope.exams, 'semester');
			$scope.distinct_subjects = Selection.find_distinct($scope.exams, 'subject');

			// Find Exams for Abstract
		    $scope.abstract_exams = [];
		    $scope.exams.forEach(function(entry) {
		    	var select = true;

		    	if (entry.semester != $scope.user.semester) select = false;
		    	if (entry.date == 'unbekannt') select = false;

		    	if ($scope.exams.length > 10)
			    	if (entry.question_count < 30) select = false;

		    	if (entry.answered_questions > 0) select = true;

		    	if (select) {
		    		if (entry.answered_questions > 0)
			    		$scope.abstract_exams.unshift(entry);
		    		else
			    		$scope.abstract_exams.push(entry);
		    	}
		    });

		    $scope.ready = 1;
		});

		API.get('tags', {'user_id': $scope.user.user_id}).success(function(data) {
			$scope.tags = data.tags;

			$scope.distinct_tags = [];
		    $scope.tags.forEach(function(entry) {
		    	entry.tags.split(',').forEach(function(tagText) {
		    		if($scope.distinct_tags.indexOf(tagText) == -1) {
		    			$scope.distinct_tags.push(tagText);
					}
				});
		    });

		    function clone(obj) {
			    if (null === obj || "object" != typeof obj) return obj;
			    var copy = obj.constructor();
			    for (var attr in obj) {
			        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			    }
			    return copy;
			}

			function sortByKey(array, key) {
			    return array.sort(function(a, b) {
			        var x = a[key]; var y = b[key];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
			}

			$scope.questions_by_tag = {};
		    $scope.distinct_tags.forEach(function(distinct_tag) {
			    $scope.questions_by_tag[distinct_tag] = [];
		    });
		    $scope.distinct_tags.forEach(function(distinct_tag) {
			    $scope.tags.forEach(function(entry) {
					entry.tags.split(',').forEach(function(tagText) {
						if (distinct_tag == tagText) {
							$scope.questions_by_tag[distinct_tag].push(entry);
						}
					});
				});
		    });
		});

		API.get('comments/' + $scope.user.user_id).success(function(data) {
			$scope.comments = data.comments;

			$scope.questions_by_comment = {};
		    $scope.comments.forEach(function(c) {
			    $scope.questions_by_comment[c.question] = [];
		    });
		    $scope.comments.forEach(function(c) {
			    $scope.questions_by_comment[c.question].push(c);
		    });
		});


		$scope.learn_exam = function(exam_id) {
	    	var random = 1;
	    	API.get('exams/action/prepare/' + exam_id + '/' + random).success(function(data) {
		    	var questionList = {'list': data.list};
	    		questionList.exam_id = exam_id;
				sessionStorage.currentQuestionList = angular.toJson(questionList);
				$location.path('/question').search('id', questionList.list[0].question_id);
			});
		};

		$scope.learn_subjects = function() {
			var data = {selection_subject_list: $scope.selection_subject_list, selection_number_questions: $scope.selection_number_questions};
	    	API.post('learn/prepare', data).success(function(data) {
		    	var questionList = {'list': data.list};
	    		questionList.selection_subject_list = data.selection_subject_list;
				sessionStorage.currentQuestionList = angular.toJson(questionList);
				$location.path('/question').search('id', questionList.list[0].question_id);
			});
		};

		$scope.reset_results = function(index) {
			var exam_id = $scope.exams[index].exam_id;
			$scope.exams[index].answered_questions = 0;
			var data = {};
			API.delete('results/' + $scope.user.user_id + '/' + exam_id, data);
		};

		$scope.reset_abstract_results = function(index) {
			var exam_id = $scope.abstract_exams[index].exam_id;
			$scope.abstract_exams[index].answered_questions = 0;
			var data = {};
			API.delete('results/' + $scope.user.user_id + '/' + exam_id, data);
		};

		$scope.toggle_selection = function(subject, category, checked) {

			var selection = $scope.selection_subject_list;
			var subjects = $scope.subject_list;

			if (!checked)
				checked = false;

			if (-1 < Object.keys(selection).indexOf(subject)) { // If Subject in Selection Keys
				if (0 === selection[subject].length) { // If Subject in Selection has Empty Array
					if (category == 'all')
						delete selection[subject];

				} else if (0 < selection[subject].length) { // If Subject in Selection has Full Array
					if (category == 'all') {
						if (!checked)
							selection[subject] = subjects[subject].slice(0);
						else
							delete selection[subject];

					} else {
						var idx = selection[subject].indexOf(category);
						if (idx > -1) {
							selection[subject].splice(idx, 1);
							if (0 === selection[subject].length)
								delete selection[subject];
						} else {
							selection[subject].push(category);
						}
					}

				} else { // If Subject in Selection has No Array
					if (category == 'all')
						selection[subject] = subjects[subject].slice(0);
					else
						selection[subject] = [category];
				}

			} else {
				if (category == 'all')
					selection[subject] = subjects[subject].slice(0);
				else
					selection[subject] = [category];
			}
		};

		$scope.search_question = function() {
			$scope.search_results = [];

			var query_question = $scope.question_search_query;
			$scope.question_field_message = '';
			if (query_question.length) {
				spinner.spin(document.getElementById('spinner'));

				var data = {'query': $scope.question_search_query, 'visibility': 1, 'limit': 101};
				// , 'subject': $scope.question_search_subject, 'semester': $scope.question_search_semester};
				API.get('questions', data).success(function(data) {
				    spinner.stop();

		    	    if (0 === data.result.length) {
			    	    $scope.question_field_message = 'Nichts gefunden ;(';

		    	    } else if (100 < data.result.length) {
			    	    $scope.question_field_message = 'Zu viel gefunden, geht es ein bisschen konkreter? ;(';

		    	    } else {
		    	    	$scope.search_results = data.result;
		    	    }
				});
		    }
		};

		$scope.exam_in_selection = function(index) {
			return Selection.is_element_included($scope.exams[index], $scope.exam_search);
		};

		$scope.exam_in_selection_count = function() {
			return Selection.count($scope.exams, $scope.exam_search);
		};

		$scope.comment_in_selection = function(index) {
			return Selection.is_element_included($scope.comments[index], $scope.comment_search);
		};

		$scope.comment_in_selection_count = function() {
			return Selection.count($scope.comments, $scope.comment_search);
		};
	});