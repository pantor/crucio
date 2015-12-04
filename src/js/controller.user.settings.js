angular.module('userModule')
	.controller('settingsCtrl', function($scope, Auth, Page, API) {
		Page.set_title_and_nav('Einstellungen | Crucio', 'Name');

		$scope.user = Auth.getUser();

		$scope.submit_button_title = 'Speichern';

	    $scope.update_user = function() {
		    $scope.submit_button_title = 'Speichern...';

		    var data = {'highlightExams': $scope.user.highlightExams, 'showComments': $scope.user.showComments, 'repetitionValue': 50, 'useAnswers': $scope.user.useAnswers, 'useTags': $scope.user.useTags};
		    API.put('users/' + $scope.user.user_id + '/settings', data).success(function(data) {
		    	if (data.status == 'success') {
                    Auth.setUser($scope.user);
                    $scope.submit_button_title = 'Gespeichert';

                } else {
		    		$scope.user = Auth.getUser();
                    $scope.submit_button_title = 'Speichern nicht m\u00F6glich...';
                }
		    });
		};

		$scope.remove_all_results = function() {
			API.delete('results/' + $scope.user.user_id);
		};
	});