angular.module('crucioApp')
	.controller('aboutCtrl', function($scope, Auth) {
		$scope.user = $scope.user = Auth.getUser();
	});