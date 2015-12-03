angular.module('adminModule', [])

	.controller('adminCtrl', function($scope, Page, $http, Selection, $interval) {
		Page.set_title_and_nav('Verwaltung | Crucio', 'Admin');

		$scope.user = angular.fromJson(sessionStorage.user);

		$scope.user_search = {'semester': '', 'group': '', 'login': '', 'query': '', 'query_keys': ['group_name', 'username']};
		$scope.comment_search = {'question_id': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id']};

		$scope.update_activity = false;
		$scope.show_activity = {search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true};


		$scope.$watch("comment_search", function( newValue, oldValue ) {
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

		$http.get('api/v1/users').success(function(data) {
			$scope.users = data.users;
			$scope.distinct_semesters = Selection.find_distinct($scope.users, 'semester');
			$scope.distinct_semesters.sort(function(a, b) { return a-b; });
			$scope.distinct_groups = ['Standard', 'Admin', 'Autor'];

			$scope.ready = 1;
		});

		/* $http.get('api/v1/tags').success(function(data) {
			$scope.tags = data.tags;

			$scope.distinct_tags = [];
		    $scope.tags.forEach(function(entry) {
		    	entry.tags.split(',').forEach(function(tagText) {
		    		if ($scope.distinct_tags.indexOf(tagText) == -1) {
		    			$scope.distinct_tags.push(tagText);
					}
				});
		    });

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
		}); */

		$http.get('api/v1/comments').success(function(data) {
			$scope.comments = data.comments;
			$scope.distinct_questions = Selection.find_distinct($scope.comments, 'question_id');
			$scope.distinct_users = Selection.find_distinct($scope.comments, 'username');

			$scope.questions_by_comment = [];
			$scope.comments.forEach(function(c) {
				var found = -1;
				for (var i = 0; i < $scope.questions_by_comment.length; i++) {
				    if ($scope.questions_by_comment[i][0].question == c.question) {
				        found = i;
				        break;
				    }
				}

			    if (found > -1)
			    	$scope.questions_by_comment[found].push(c);
			    else
			    	$scope.questions_by_comment.push([c]);
		    });
		    $scope.questions_by_comment_display = $scope.questions_by_comment;
		});

		$http.get('api/v1/whitelist').success(function(data) {
			$scope.whitelist = data.whitelist;
		});

		$http.get('api/v1/stats/general').success(function(data) {
			$scope.stats = data.stats;
		});


		$scope.add_mail = function() {
			var email = $scope.new_whitelist_mail;
			if (email.length) {
				$scope.whitelist.push({username: '', mail_address: email});

				var post_data = {'mail_address': email.replace('@','(@)')};
				$http.post('api/v1/whitelist', post_data).success(function(data) { });
			}
		};

		$scope.remove_mail = function(index) {
			var email = $scope.whitelist[index].mail_address;
			if (email.length) {
				$scope.whitelist.splice(index, 1);
				$http.delete('api/v1/whitelist/' + email).success(function(data) { });
			}
		};

		$scope.send_mail = function() {
			var mailAddresses = '';

	    	$('#user-table tbody tr:visible').children('td').children('a').each(function(i, obj) {
	    		mailAddresses += $(obj).attr('data-original-title') + ',';
	    	});

	    	mailAddresses = mailAddresses.slice(0,-1);
	    	window.location.href = 'mailto:' + mailAddresses;
		};

		$scope.change_group = function(index) {
			var user_id = $scope.users[index].user_id;
			var group_id = $scope.users[index].group_id;

			if (user_id == 1) return false;

			if (group_id == 2) {
				group_id = 1;
				$scope.users[index].group_name = "Standard";
			} else if (group_id == 3) {
				group_id = 2;
				$scope.users[index].group_name = "Admin";
			} else {
				group_id = 3;
				$scope.users[index].group_name = "Autor";
			}

			var post_data = {'group_id': group_id};
			$scope.users[index].group_id = group_id;
			$http.put('api/v1/users/' + user_id + '/group', post_data).success(function(data) { });
		};

		$scope.is_today = function(date) {
			var today = new Date();

			var date_c = new Date(date * 1000);
			if(today.toDateString() == date_c.toDateString())
				return true;
			else
				return false;
		};

		$scope.is_yesterday = function(date) {
			var today = new Date();
			var diff = today - 1000 * 60 * 60 * 24;
			var yesterday = new Date(diff);

			var date_c = new Date(date * 1000);
			if(yesterday.toDateString() == date_c.toDateString())
				return true;
			else
				return false;
		};

		$scope.user_in_selection = function(index) {
			return Selection.is_element_included($scope.users[index], $scope.user_search);

			/* if($scope.user_search_semester!=$scope.users[index].semester && $scope.user_search_semester) { return false; }
			if($scope.user_search_group!=$scope.distinct_groups[$scope.users[index].group_id - 1] && $scope.user_search_group) { return false; }
			// if($scope.user.last_sign_in > 0 && $scope.isToday($scope.user.last_sign_in) && $scope.user_search_login=='Heute') { return false; }
			var query_string = $scope.users[index].username;
			if(query_string.toLowerCase().indexOf($scope.user_search_query.toLowerCase()) < 0 && $scope.user_search_query) { return false; }
			return true; */
		};

		$scope.user_in_selection_count = function() {
			return Selection.count($scope.users, $scope.user_search);
		};

		$scope.comment_in_selection_count = function() {
			return Selection.count($scope.comments, $scope.comment_search);
		};

		$scope.increase_semester = function() {
			var post_data = {'number': '1'};
	    	$http.post('api/v1/admin/change-semester/dFt(45i$hBmk*I', post_data).success(function(data) {
	    		alert(data.status);
			});
		};

		$scope.decrease_semester = function() {
			var post_data = {'number': '-1'};
	    	$http.post('api/v1/admin/change-semester/dFt(45i$hBmk*I', post_data).success(function(data) {
	    		alert(data.status);
			});
		};

		$scope.remove_test_account = function(index) {
			$http.delete('api/v1/users/test-account').success(function(data) {
				alert(data.status);
			});
		};
	});