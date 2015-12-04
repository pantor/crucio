angular.module('crucioApp')
    .factory('Page', function() {
    	var title = 'Crucio';
    	var nav = '';
    
    	return {
        	title: function() { return title; },
    		setTitle: function(arg) { title = arg; },
    		nav: function() { return nav; },
    		setNav: function(arg) { nav = arg; },
    		set_title_and_nav: function(new_title, new_nav) { title = new_title; nav = new_nav; }
    	};
    });
