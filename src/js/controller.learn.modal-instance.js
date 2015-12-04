angular.module('learnModule')
	.controller('ModalInstanceCtrl', function ($scope, $modalInstance, image_url) {
		$scope.image_url = image_url;
	});