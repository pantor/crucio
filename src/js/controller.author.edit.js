angular.module('authorModule')
	.controller('editCtrl', function($scope, $routeParams, Auth, Page, $location, API, FileUploader) {
		Page.set_title_and_nav('Klausur | Crucio', 'Autor');

		$scope.ready = 0;

		$scope.user = Auth.getUser();
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

		API.get('exams/' + $scope.exam_id).success(function(data) {
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
				API.delete('questions/' + question_id).success(function(data, status, headers) { });
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
				API.put('exams/' + $scope.exam_id, post_data);

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
		    				API.post('questions', data).success(function(data) {
		    					question.question_id = data.question_id;
		    					console.log(data);
							});

		    			} else {
		    				API.put('questions/' + question.question_id, post_question_data);
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
			API.delete('exams/' + $scope.exam.exam_id).success(function(data) {
				$location.url('/author');
			});
		};
	});