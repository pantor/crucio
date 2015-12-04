angular.module('learnModule')
	.controller('statisticsCtrl', function($scope, Auth, Page, API) {
		Page.set_title_and_nav('Statistik | Crucio', 'Lernen');

		$scope.user = Auth.getUser();
	});