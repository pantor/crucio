angular.module('userModule')
	.controller('logoutCtrl', function($scope, Auth, Page, ipCookie) {
		$scope.Page = Page;
		$scope.user = Auth.getUser();

		$scope.logout = function() {
    		Auth.logout();
		};
	});