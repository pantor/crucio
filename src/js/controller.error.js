angular.module('crucioApp')
	.controller('errorCtrl', function($scope, Auth, Page) {
		Page.set_title_and_nav('Fehler | Crucio', '');
		$scope.user = $scope.user = Auth.getUser();
	});