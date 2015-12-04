angular.module('learnModule', [])

	.controller('questionsCtrl', function($scope, Page, $location, $http, Selection) {
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
			$http.post('api/v1/learn/number-questions', post_data).success(function(data) {
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

		$http.get('api/v1/exams/user_id/' + $scope.user.user_id).success(function(data) {
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

		$http.get('api/v1/tags', {'params': {'user_id': $scope.user.user_id}}).success(function(data) {
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

		$http.get('api/v1/comments/' + $scope.user.user_id).success(function(data) {
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
	    	$http.get('api/v1/exams/action/prepare/' + exam_id + '/' + random).success(function(data) {
		    	var questionList = {'list': data.list};
	    		questionList.exam_id = exam_id;
				sessionStorage.currentQuestionList = angular.toJson(questionList);
				$location.path('/question').search('id', questionList.list[0].question_id);
			});
		};

		$scope.learn_subjects = function() {
			var data = {selection_subject_list: $scope.selection_subject_list, selection_number_questions: $scope.selection_number_questions};
	    	$http.post('api/v1/learn/prepare', data).success(function(data) {
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
			$http.delete('api/v1/results/' + $scope.user.user_id + '/' + exam_id, data);
		};

		$scope.reset_abstract_results = function(index) {
			var exam_id = $scope.abstract_exams[index].exam_id;
			$scope.abstract_exams[index].answered_questions = 0;
			var data = {};
			$http.delete('api/v1/results/' + $scope.user.user_id + '/' + exam_id, data);
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
				$http.get('api/v1/questions', {'params': data}).success(function(data) {
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
	})


	.controller('examCtrl', function($scope, $rootScope, $routeParams, Page, $http, $location, $modal) {
		Page.set_title_and_nav('Klausur | Crucio', 'Lernen');

		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.exam_id = $routeParams.id;
		$scope.questionList = {'exam_id': $scope.exam_id, 'list': []};

		$scope.Math = window.Math;

		$scope.current_index = 0;

		$http.get('api/v1/exams/' + $scope.exam_id).success(function(data) {
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
	})


	.controller('questionCtrl', function($scope, Page, $routeParams, $http, $location, $modal) {
		Page.set_title_and_nav('Frage | Crucio', 'Lernen');

		$scope.answerButtonClass = 'btn-primary';

		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.questionList = angular.fromJson(sessionStorage.currentQuestionList);

		$scope.question_id = $routeParams.id;
		$scope.reset_session = $routeParams.reset_session;

		if (!$scope.question_id)
			window.location.replace('/questions');

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

		$scope.$watch("strike", function( newValue, oldValue ) {
			if ($scope.questionList) {
				if(Object.keys($scope.questionList).length) {
					$scope.questionList.list[$scope.index].strike = newValue;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
				}
			}
		}, true);

		$http.get('api/v1/questions/' + $scope.question_id + '/user/' + $scope.user.user_id).success(function(data) {
			$scope.question = data;

			if ($scope.question.question_image_url) {
				if (false) {
					$scope.question.question_image_url = 'public' + $scope.question.question_image_url.slice(2);
					if (!image_exist($scope.question.question_image_url))
						$scope.question.question_image_url = '';
				} else {
					$scope.question.question_image_url = '/public/files/' + $scope.question.question_image_url;
				}
			}

			for (var i = 0; i < $scope.question.comments.length; i++) {
				$scope.question.comments[i].voting = ( parseInt($scope.question.comments[i].voting) || 0 );
				$scope.question.comments[i].user_voting = ( parseInt($scope.question.comments[i].user_voting) || 0 );
			}

			function image_exist(url) {
			   var img = new Image();
			   img.src = url;
			   return img.height !== 0;
			}

			// Tag Functions
			var tags = [];
			if ($scope.question.tags)
				tags = $scope.question.tags.split(',');
			
			$('#tagInput').tagsManager({
			    prefilled: tags,
			    maxTags: 5,
			    replace: true,
			    output: null,
			    tagsContainer: null,
			    tagCloseIcon: '&times;',
			    tagClass: 'tm-tag-error',
			    onlyTagList: false,
			    createHandler: function(tagManager, tags) {
			    	var data = {'tags': tags, 'question_id': $scope.question_id, 'user_id': $scope.user.user_id};
					$http.post('api/v1/tags', data);
			    },
			    removeHandler: function(tagManager, tags) {
			    	var data = {'tags': tags, 'question_id': $scope.question_id, 'user_id': $scope.user.user_id};
					$http.post('api/v1/tags', data);
			    }
			});

			if ($scope.given_result) {
				console.log('question get given_result', $scope.given_result);
				$scope.check_answer($scope.given_result);
			}

			if ($scope.show_answer)
				$scope.mark_answer($scope.given_result);
		});

		// If show solution button is clicked
		$scope.show_solution = function() {
			var correct_answer = $scope.correct_answer();

			var correct = (correct_answer == $scope.given_result) ? 1 : 0;

	    	if (0 === correct_answer) { correct = -1; }
	    	if (1 == $scope.question.type) { correct = -1; }

	    	var data = {'correct': correct, 'question_id': $scope.question_id, 'user_id': $scope.user.user_id, 'given_result': $scope.given_result};
	    	$http.post('api/v1/results', data);


			if ($scope.questionList) {
	    		if (Object.keys($scope.questionList).length) {
		    		$scope.questionList.list[$scope.index].mark_answer = 1;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
	    		}
	    	}

			$scope.mark_answer($scope.given_result);
		};

		// -- Saves the answer
		$scope.save_answer = function(given_answer) {
			$scope.given_result = given_answer;

			if ($scope.questionList) {
				if (Object.keys($scope.questionList).length) {
					$scope.questionList.list[$scope.index].given_result = given_answer;
					sessionStorage.currentQuestionList = angular.toJson($scope.questionList);
				}
			}
	    };

		// -- Checks the answer box
		$scope.check_answer = function(answer) {
			$scope.checked_answer = answer;
		};

		// -- Returns correct answer
		$scope.correct_answer = function() {
			return $scope.question.correct_answer;
		};

		// -- Colors the given answers and shows the correct solution
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
	    	$http.post('api/v1/comments/' + $scope.user.user_id, post_data).success(function(data) {
				post_data.voting = 0;
	    		post_data.user_voting = 0;
	    		post_data.comment_id = data.comment_id;
	    		$scope.question.comments.push(post_data);
	    		$scope.commentText = '';
			});
		};

		$scope.delete_comment = function(index) {
			var comment_id = $scope.question.comments[index].comment_id;
			$http.delete('api/v1/comments/' + comment_id);
			$scope.question.comments.splice(index, 1);
		};

		$scope.increase_user_voting = function(current_user_voting, comment_id) {
			var result = current_user_voting == 1 ? 1 : current_user_voting + 1;
			var post_data = {'user_voting': result};
			$http.post('api/v1/comments/' + comment_id + '/user/' + $scope.user.user_id, post_data);
			return result;
		};

		$scope.decrease_user_voting = function(current_user_voting, comment_id) {
			var result = current_user_voting == -1 ? -1 : current_user_voting - 1;
			var post_data = {'user_voting': result};
			$http.post('api/v1/comments/' + comment_id + '/user/' + $scope.user.user_id, post_data);
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
	})


	.controller('ModalInstanceCtrl', function ($scope, $modalInstance, image_url) {
		$scope.image_url = image_url;
	})


	.controller('analysisCtrl', function($scope, Page, $http) {
		Page.set_title_and_nav('Analyse | Crucio', 'Lernen');

		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.questionList = angular.fromJson(sessionStorage.currentQuestionList);

		// Post Results
		for (var question in $scope.questionList.list) {
			if (!question.mark_answer) { // Don't save results again, they were saved during the question page
				if (1 < question.type) { // Don't save free questions
					if (0 < question.given_result) {
						var correct = (question.correct_answer == question.given_result) ? 1 : 0;
						if (0 === question.correct_answer) { correct = -1; }

						var data = {'correct': correct, 'question_id': question.question_id, 'user_id': $scope.user.user_id, 'given_answer': question.given_result};
						$http.post('api/v1/results', data);
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
			$http.get('api/v1/exams/' + $scope.exam_id).success(function(data) {
				$scope.exam = data;
			});
		}
	})


	.controller('statisticsCtrl', function($scope, Page, $http) {
		Page.set_title_and_nav('Statistik | Crucio', 'Lernen');

		$scope.user = angular.fromJson(sessionStorage.user);
	})


	.filter('newline_to_br', function($sce) {
	    return function (text) {
	        if (text !== undefined) return text.replace(/\n/g, '<br>');
        };
	})

	.directive('timeago', function() {
		var strings = {
			prefixAgo: "vor",
			prefixFromNow: "in",
			suffixAgo: "",
			suffixFromNow: "",
			seconds: "wenigen Sekunden",
			minute: "etwa einer Minute",
			minutes: "%d Minuten",
			hour: "etwa einer Stunde",
			hours: "%d Stunden",
			day: "etwa einem Tag",
			days: "%d Tagen",
			month: "etwa einem Monat",
			months: "%d Monaten",
			year: "etwa einem Jahr",
			years: "%d Jahren",
			wordSeparator: " ",
			numbers: []
		};

		return {
	    	restrict:'A',
			link: function(scope, element, attrs){
				attrs.$observe("timeago", function(){
					var given = parseInt(attrs.timeago);
					var current = new Date().getTime();

					var distance_millis = Math.abs(current - given);
					var seconds = distance_millis / 1000;
					var minutes = seconds / 60;
					var hours = minutes / 60;
					var days = hours / 24;
					var years = days / 365;

					var prefix = strings.prefixAgo;
					var suffix = strings.suffixAgo;

					function is_function(functionToCheck) {
						var getType = {};
						return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
					}

					function substitute(stringOrFunction, number) {
						var string = is_function(stringOrFunction) ? stringOrFunction(number, distance_millis) : stringOrFunction;
						var value = (strings.numbers && strings.numbers[number]) || number;
						return string.replace(/%d/i, value);
					}

					var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
					  seconds < 90 && substitute(strings.minute, 1) ||
					  minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
					  minutes < 90 && substitute(strings.hour, 1) ||
					  hours < 24 && substitute(strings.hours, Math.round(hours)) ||
					  hours < 42 && substitute(strings.day, 1) ||
					  days < 30 && substitute(strings.days, Math.round(days)) ||
					  days < 45 && substitute(strings.month, 1) ||
					  days < 365 && substitute(strings.months, Math.round(days / 30)) ||
					  years < 1.5 && substitute(strings.year, 1) ||
					  substitute(strings.years, Math.round(years));

					var separator = strings.wordSeparator;

					String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
					var result = [prefix, words, suffix].join(separator).trim();
					element.text(result);
				});
			}
		};
	});