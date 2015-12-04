angular.module('authorModule')
	.controller('authorCtrl', function($scope, Auth, API, Page, $location, Selection) {
		Page.set_title_and_nav('Autor | Crucio', 'Autor');

		$scope.user = Auth.getUser();

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

		API.get('exams').success(function(data) {
		    $scope.exams = data.exams;

		    // Find Distinct Semesters
		    $scope.distinct_semesters = [];
		    $scope.exams.forEach(function(entry) {
		    	if (-1 == $scope.distinct_semesters.indexOf(entry.semester)) {
		    		$scope.distinct_semesters.push(entry.semester);
		    	}
		    });
		    $scope.distinct_semesters.sort();

		    // Find Distinct Subjects
		    $scope.distinct_subjects = [];
		    $scope.exams.forEach(function(entry) {
		    	if (-1 == $scope.distinct_subjects.indexOf(entry.subject)) {
		    		$scope.distinct_subjects.push(entry.subject);
		    	}
		    });
		    $scope.distinct_subjects.sort();

		    // Find Distinct Authors
		    $scope.distinct_authors = [];
		    $scope.exams.forEach(function(entry) {
		    	if (-1 == $scope.distinct_authors.indexOf(entry.author)) {
		    		$scope.distinct_authors.push(entry.author);
		    	}
		    });
		    $scope.distinct_authors.sort();

		    $scope.ready = 1;
		});

		API.get('comments/author/' + $scope.user.user_id).success(function(data) {
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
		    API.post('exams', data).success(function(data) {
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
	});