angular.module('authorModule', [])

	.controller('authorCtrl', function($scope, Page, $location, $http, Selection) {
		Page.set_title_and_nav('Autor | Crucio', 'Autor');

		$scope.user = angular.fromJson(sessionStorage.user);

		$scope.subject_list = subject_list;

		$scope.exam_search = {'subject': '', 'semester': '', 'author': $scope.user.username, 'query': '', 'query_keys': ['subject', 'author', 'date']};
		$scope.comment_search = {'username_added': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id']};


		$scope.$watch("comment_search", function( newValue ) {
			$scope.questions_by_comment_display = [];
			$scope.questions_by_comment.forEach(function(comments) {
				for (var i = 0; i < comments.length; i++) {
					var comment = comments[i];
					
					// Check if Comment satisfies search query
					if (Selection.is_element_included(comment, newValue)) {
						var found_idx = -1;
						for (var j = 0; j < $scope.questions_by_comment_display.length; j++) {
						    if ($scope.questions_by_comment_display[j][0].question == comment.question) {
						        found_idx = j;
						        break;
						    }
						}
						
						// Add to Array at Found Index
						if (found_idx > -1) {
							$scope.questions_by_comment_display[found_idx].push(comment);
							
						// Create New Array
						} else {
							$scope.questions_by_comment_display.push([comment]);
						}
					}
				}
		    });
		    $scope.questions_by_comment_display.sort(function(a, b) { return b[0].date - a[0].date; });
		}, true);

		$http.get('api/v1/exams/all-visibility').success(function(data) {
		    $scope.exams = data.exams;

		    // Find Distinct Semesters
		    $scope.distinct_semesters = [];
		    $scope.exams.forEach(function(entry) {
		    	if ($scope.distinct_semesters.indexOf(entry.semester) == -1) {
		    		$scope.distinct_semesters.push(entry.semester);
		    	}
		    });
		    $scope.distinct_semesters.sort();

		    // Find Distinct Subjects
		    $scope.distinct_subjects = [];
		    $scope.exams.forEach(function(entry) {
		    	if ($scope.distinct_subjects.indexOf(entry.subject) == -1) {
		    		$scope.distinct_subjects.push(entry.subject);
		    	}
		    });
		    $scope.distinct_subjects.sort();

		    // Find Distinct Authors
		    $scope.distinct_authors = [];
		    $scope.exams.forEach(function(entry) {
		    	if ($scope.distinct_authors.indexOf(entry.author) == -1) {
		    		$scope.distinct_authors.push(entry.author);
		    	}
		    });
		    $scope.distinct_authors.sort();

		    $scope.ready = 1;
		});

		$http.get('api/v1/comments/author/' + $scope.user.user_id).success(function(data) {
		    $scope.comments = data.comments;

		    // Find Distinct Comments
		    $scope.distinct_users = [];
		    $scope.distinct_users_added = [];

		    $scope.distinct_users = Selection.find_distinct($scope.comments, 'username');
		    $scope.distinct_users_added = Selection.find_distinct($scope.comments, 'username_added');

		    $scope.questions_by_comment = [];
			$scope.comments.forEach(function(c) {
				var found = -1;
				for (var i = 0; i < $scope.questions_by_comment.length; i++) {
				    if ($scope.questions_by_comment[i][0].question == c.question) {
				        found = i;
				        break;
				    }
				}

			    if (found > 0)
			    	$scope.questions_by_comment[found].push(c);
			    else
			    	$scope.questions_by_comment.push([c]);
		    });
		    $scope.questions_by_comment.sort(function(a, b) { return b[0].date - a[0].date; });
		    $scope.questions_by_comment_display = $scope.questions_by_comment;
		    
		    $scope.comment_search.username_added = $scope.user.username;
		});


		$scope.new_exam = function() {
			var data = {'subject': '', 'professor': '', 'semester': '', 'date': '', 'type': '', 'user_id_added': $scope.user.user_id, 'duration': '', 'notes': ''};
		    $http.post('api/v1/exams', data).success(function(data) {
		    	$location.path('/edit-exam').search('id', data.exam_id);
		    });
		};

		$scope.comment_in_selection = function(index) {
			return Selection.is_element_included($scope.comments[index], $scope.comment_search);
		};

		$scope.comment_in_selection_count = function() {
			return Selection.count($scope.comments, $scope.comment_search);
		};

		$scope.exam_in_selection = function(index) {
			return Selection.is_element_included($scope.exams[index], $scope.exam_search);
		};

		$scope.exam_in_selection_count = function() {
			return Selection.count($scope.exams, $scope.exam_search);
		};
	})


	.controller('editCtrl', function($scope, $routeParams, Page, $location, $http, FileUploader) {
		Page.set_title_and_nav('Klausur | Crucio', 'Autor');

		$scope.ready = 0;

		$scope.user = angular.fromJson(sessionStorage.user);
		$scope.exam_id = $routeParams.id;
		$scope.open_question_id = $routeParams.question_id;

		$scope.subject_list = subject_list;

		$scope.has_changed = 0;
		$scope.number_changed = 0;
		$scope.is_saving = 0;

		$scope.uploader = new FileUploader({url: '/public/php/upload-file.php'});
		$scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
			$scope.exam.file_name = response.upload_name;
		};
		$scope.uploader_array = [];


		var $footer = $('#footer');
    	var $sidebar = $('.edit-exam-wrapper');
    	var $content_2 = $('.edit-exam-wrapper .exam-edit-list-group');

		function remake_uploader_array() {
			$scope.uploader_array = [];
			for (var i = 0; i < $scope.exam.questions.length; i++) {
				var uploader = new FileUploader({url: '/public/php/upload-file.php', formData: i});
				var question = $scope.exam.questions[i];
				uploader.onSuccessItem = function(fileItem, response) {
					var j = fileItem.formData;
					$scope.exam.questions[j].question_image_url = response.upload_name;
				};
				$scope.uploader_array.push(uploader);
			}
		}

		function resize_overscroll() {
			var sidebar_height = $(this).height() - 300 + $footer.height();
	    	if (sidebar_height > $content_2.height())
				sidebar_height = $content_2.height();
			$sidebar.height(sidebar_height);
		}


		var exam_watch = $scope.$watch("exam", function( newValue, oldValue ) {
			if (1 < $scope.number_changed)
				$scope.has_changed = 1;
			$scope.number_changed += 1;
		}, true);

		$('body').on( 'shown.bs.tab', 'a[data-toggle="tab"]', function(e){
		    var previous = $(this).closest(".list-group").children(".active");
		    previous.removeClass('active');
		    $(e.target).addClass('active');
		});

		$scope.$on('$locationChangeStart', function (event, next, current) {
			if (1 == $scope.has_changed) {
				var confirmClose = confirm('Die \u00C4nderungen an deiner Klausur bleiben dann ungespeichert. Wirklich verlassen?');
				if (!confirmClose)
					event.preventDefault();
			}
		});

		$(window).on('resize', function(){
	    	resize_overscroll();
    	});

		$http.get('api/v1/exams/' + $scope.exam_id).success(function(data) {
			$scope.exam = data;

			$scope.exam.semester = parseInt(data.semester);
			$scope.exam.duration = parseInt(data.duration);

			for (var i = 0; i < $scope.exam.questions.length; i++) {
				if (0 === $scope.exam.questions[i].topic.length)
					$scope.exam.questions[i].topic = 'Sonstiges';
			}

			remake_uploader_array();

			if (0 === $scope.exam.questions.length) {
				$scope.add_question(0, false);
			}

			if (!$scope.exam.subject) {
				$scope.exam.subject = 'Allgemeine Pathologie';
				$scope.exam.sort = 'Erstklausur';
			}

			if ($scope.open_question_id) {
				// Scroll
			}

			$scope.ready = 1;

			setTimeout(function(){ resize_overscroll(); }, 10);
		});


		$scope.add_question = function(show, scroll_to_question) {
			if (typeof(scroll_to_question)==='undefined') scroll_to_question = true;

			var question = {};
			question.question = "";
			question.type = 5;
			question.correct_answer = 0;
			question.answers = ['', '', '', '', '', ''];
			question.topic = 'Sonstiges';

			$scope.exam.questions.push(question);
			$scope.open_question_id = 0;

			remake_uploader_array();
			setTimeout(function(){ resize_overscroll(); }, 10);

			if (scroll_to_question) {
				var new_show = $scope.exam.questions.length + 1;
				setTimeout(function(){ $('.edit-exam-wrapper a:nth-child(' + new_show + ')').tab('show'); }, 10);
			}
		};

		$scope.delete_question = function(index) {
			var question_id = $scope.exam.questions[index].question_id;

			if (question_id)
				$http.delete('api/v1/questions/' + question_id).success(function(data, status, headers) { });
			$scope.exam.questions.splice(index, 1);

			remake_uploader_array();

			var new_show = index + 1;
			setTimeout(function(){ $('.edit-exam-wrapper a:nth-child(' + new_show + ')').tab('show'); }, 10);

			if (0 === $scope.exam.questions.length) {
				$scope.add_question(1);
			}

			setTimeout(function(){ resize_overscroll(); }, 10);
		};

	    $scope.leave_edit = function() {
			$scope.$apply( $location.path( $scope.next_route ) );
		};

		$scope.save_exam = function() {
			var validate = true;
			if (!$scope.exam.subject) { validate = false; }
			if ($scope.exam.semester < 1) { validate = false; }
			if (!$scope.exam.date) { validate = false; }

			if (validate) {
				$scope.is_saving = 1;

				var post_data = $scope.exam;
				$http.put('api/v1/exams/' + $scope.exam_id, post_data).success(function(data) { });

				$scope.exam.questions.forEach(function(question) {
					var validate_question = true;
					if (!question.question.length) { validate_question = false; }
					if (question.question_id) { validate_question = true; }

		    		if (validate_question) {
			    		if (!question.explanation) {}
			    			question.explanation = '';
			    		if (!question.question_image_url)
			    			question.question_image_url = '';

		    			var data = {'question': question.question, 'topic': question.topic, 'type': question.type, 'answers': question.answers, 'correct_answer': question.correct_answer, 'exam_id': $scope.exam.exam_id, 'user_id_added': $scope.user.user_id, 'explanation': question.explanation, 'question_image_url': question.question_image_url};

		    			// New Question
		    			if (!question.question_id) {
		    				$http.post('api/v1/questions', data).success(function(data) {
		    					question.question_id = data.question_id;
		    					console.log(data);
							});

		    			} else {
		    				$http.put('api/v1/questions/' + question.question_id, post_question_data).success(function(data) { });
		    			}
		    		}
				});
				$scope.has_changed = 0;
				$scope.is_saving = 0;
				
			} else {
				alert('Es fehlen noch allgemeine Infos zur Klausur.');
			}
		};

		$scope.delete_exam = function() {
			$http.delete('api/v1/exams/' + $scope.exam.exam_id).success(function(data) {
				$location.url('/author');
			});
		};
	});