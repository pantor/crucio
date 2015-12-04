angular.module('userModule')
	.controller('loginCtrl', function($scope, Auth, Page, $route, API, ipCookie) {
		$scope.user = Auth.getUser();

		$scope.email = '';
		$scope.remember_me = 1;
		$scope.password = '';

		$scope.login_error = false;

		$scope.$watch("email", function( newValue, oldValue ) {
			$scope.login_error = false;
		}, true);
		$scope.$watch("password", function( newValue, oldValue ) {
			$scope.login_error = false;
		}, true);

		$scope.login = function() {
			if ($scope.email.indexOf("@") == -1)
				$scope.email += '@studserv.uni-leipzig.de';

			var data = {email: $scope.email.replace('@','(@)'), remember_me: $scope.remember_me, password: $scope.password};
			API.post('users/action/login', data).success(function(data) {
				if (data.login == 'success') {
				    if ($scope.remember_me == 1)
				    	ipCookie('CrucioUser', data.logged_in_user, { expires: 21 });

			    	Auth.setUser(data.logged_in_user);
			    	window.location.replace('/questions');

			    } else {
			    	$scope.login_error = true;
			    }
			});
		};
	});