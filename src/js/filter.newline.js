angular.module('crucioApp')
	.filter('newline_to_br', function($sce) {
	    return function (text) {
	        if (text !== undefined)
	            return text.replace(/\n/g, '<br>');
        };
	});