// -------- Global Variables ----------

var base_url = window.location.origin;
var is_dev = (base_url.indexOf("dev") == 7) ? 1 : 0;

// Unicode
// ä \u00E4 Ä \u00C4
// ö \u00F6 Ö \u00D6
// ü \u00FC Ü \u00DC
// ß \u00DF

var subject_list = {
	'An\u00E4sthesie und Intensivmedizin':[],

	'Biologie': [],

	'Biochemie': ['Chemie der Kohlenhydrate', 'Chemie der Aminos\u00E4uren, Peptide und Proteine', 'Chemie der Fetts\u00E4uren und Lipide', 'Chemie der Nukleotide und Nukleins\u00E4uren', 'Vitamine und Koenzyme', 'Enzyme', 'Ern\u00E4hrung, Verdauung, Resorption', 'Abbau der Kohlenhydrate', 'Abbau der Fetts\u00E4uren, Ketonk\u00F6rper', 'Aminos\u00E4urestoffwechsel', 'Zitratzyklus und Atmungskette', 'Glykogenstoffwechsel, Glukoneogenese', 'Biosynthese der Fetts\u00E4uren, Lipogenese', 'Mineral- und Elektrolythaushalt', 'Subzellul\u00E4re Strukturen', 'Nukleins\u00E4uren, genetische Information, Molekularbiologie', 'Hormone', 'Immunchemie', 'Blut', 'Leber', 'Fettgewebe', 'Niere, Harn', 'Muskelgewebe, Bewegung', 'Binde- und St\u00FCtzgewebe', 'Nervensystem'],

	'Physik': [],
	
	'Physiologie': ['Allgemeine und Zellphysiologie, Zellerregung', 'Blut und Immunsystem', 'Herz', 'Blutkreislauf', 'Atmung', 'Arbeit- und Leistungsphysiologie', 'Ern\u00E4hrung, Verdauungstrakt, Leber', 'Energie- und W\u00E4rmehaushalt', 'Wasser- und Elektrolythaushalt, Nierenfunktion', 'Hormonale Regulationen', 'Sexualentwicklung und Reproduktionsphysiologie', 'Funktionsprinzipien des Nervensystems', 'Muskulatur', 'Vegetatives Nervensystem', 'Motorik', 'Somatoviszerale Sensorik', 'Visuelles System', 'Auditorisches System', 'Chemische Sinne', 'Integrative Leistungen des Zentralnervensystems'],

	'Chemie': [],

	'Klinische Chemie': [],

	'Histologie': [],

	'Gyn\u00E4kologie':[],

	'Innere Medizin':[],

	'Chirurgie': [],

	'Pharmakologie': [],

	'Klinische Pharmakologie': [],

	'Neuroanatomie': [],

	'Allgemeine Pathologie': [],

	'Mikrobiologie / Virologie / Immunologie / Hygiene': [],

	'Psychologie': [],

	'Anatomie': [],

	'Allgemeinmedizin': [],

	'Urologie': [],

	'Dermatologie': [],

	'Humangenetik': [],

	'Neurologie': [],

	'Orthop\u00E4die': [],

	'Psychiatrie': [],
};


var crucioApp = angular.module('crucioApp', ['ngRoute', 'ngSanitize', 'angular-loading-bar', 'ui.bootstrap', 'angularFileUpload', 'textAngular', 'angles', 'ipCookie',
	'crucioModule', 'userModule', 'learnModule', 'authorModule', 'adminModule']);



crucioApp.config(function($routeProvider, $locationProvider) {

    $routeProvider
    	.when('', { templateUrl: 'index.php', controller: 'loginCtrl' })

    	.when('/', { templateUrl: 'index.php', controller: 'loginCtrl' })

    	.when('/forgot-password', { templateUrl: 'forgot-password.php', controller: 'forgotPasswordCtrl' })

    	.when('/register', { templateUrl: 'register.php', controller: 'registerCtrl' })

    	.when('/activate-account', { templateUrl: 'activate-account.php', controller: 'activateCtrl' })

    	.when('/contact', { templateUrl: 'contact.php', controller: 'contactCtrl' })

    	.when('/about', { templateUrl: 'about.php', controller: 'aboutCtrl' })

    	.when('/blog', { templateUrl: 'blog.php', controller: 'blogCtrl' })

    	.when('/stats', { templateUrl: 'stats.php', controller: 'blogCtrl' })


		.when('/questions', { templateUrl : 'views/questions.html', controller: 'questionsCtrl' })

    	.when('/author', { templateUrl : 'views/author.html', controller: 'authorCtrl' })

    	.when('/admin', { templateUrl : 'views/admin.html', controller: 'adminCtrl' })

    	.when('/account', { templateUrl : 'views/account.html', controller: 'accountCtrl' })

    	.when('/settings', { templateUrl : 'views/settings.html', controller: 'settingsCtrl' })

    	.when('/edit-exam', { templateUrl : 'views/edit-exam.html', controller: 'editCtrl' })

    	.when('/question', { templateUrl : 'views/question.html', controller: 'questionCtrl' })

    	.when('/exam', { templateUrl : 'views/exam.html', controller: 'examCtrl' })

    	.when('/statistics', { templateUrl : 'views/statistics.html', controller: 'statisticsCtrl' })

    	.when('/exam-pdf', { templateUrl : 'exam-pdf.php', controller: 'examCtrl' })

    	.when('/exam-solution-pdf', { templateUrl : 'exam-solution-pdf.php', controller: 'examCtrl' })

    	.when('/analysis', { templateUrl : 'views/analysis.html', controller: 'analysisCtrl' })

		.when('/403', { templateUrl : 'views/403.html', controller: 'errorCtrl' })

    	.when('/404', { templateUrl : 'views/404.html', controller: 'errorCtrl' })

    	.when('/500', { templateUrl : 'views/500.html', controller: 'errorCtrl' })

    	.otherwise({ redirectTo: '/404' });

    // use the HTML5 History API
	$locationProvider.html5Mode(true);
});

crucioApp.run(function (ipCookie, $rootScope, $location) {

	// enumerate routes that don't need authentication
	var routesThatDontRequireAuth = ['/', '/contact', '/about', '/blog', '/register', '/activate-account', '/forgot-password'];
	var routesThatLogin = ['/', '/register', '/forgot-password'];
	var routesForAuthor = ['/author', '/edit-exam'];
	var routesForAdmin = ['/admin']; // + Author Routes

	$rootScope.user = angular.fromJson(sessionStorage.user);
	
	$rootScope.is_dev = is_dev;
	// console.log('Is Dev Version?', is_dev);
	
	var cookieUser = ipCookie('CrucioUserDev');

	if(!$rootScope.user) {
		if(cookieUser) {
			$rootScope.user = cookieUser;
			sessionStorage.user = angular.toJson(cookieUser);
		}
	}


	var routeClean = function (route) {
		var route_c = route;
		if(route.indexOf('?') > -1)
			route_c = route.substr(0, route.indexOf('?'));
		return ( routesThatDontRequireAuth.indexOf(route_c) > -1) ? 1:0;
	};

	var routeLogin = function (route) {
		var route_c = route;
		if(route.indexOf('?') > -1)
			route_c = route.substr(0, route.indexOf('?'));
		return ( routesThatLogin.indexOf(route_c) > -1) ? 1:0;
	};

	var routeAuthor = function (route) {
		var route_c = route;
		if(route.indexOf('?') > -1)
			route_c = route.substr(0, route.indexOf('?'));
		return ( routesForAuthor.indexOf(route_c) > -1) ? 1:0;
	};

	var routeAdmin = function (route) {
		var route_c = route;
		if(route.indexOf('?') > -1)
			route_c = route.substr(0, route.indexOf('?'));
		return ( routesForAdmin.indexOf(route_c) > -1) ? 1:0;
	};

	if($rootScope.user) {
	    var isLoggedIn = ($rootScope.user.group_id) ? 1:0;
	    var isAuthor = ($rootScope.user.group_id == 3) ? 1:0;
	    var isAdmin = ($rootScope.user.group_id == 2) ? 1:0;

	} else {
	    var isLoggedIn = 0;
	    var isAuthor = 0;
	    var isAdmin = 0;
	}

	if (!routeClean($location.url()) && !isLoggedIn) {
		// window.location.replace('');
	}
	if (routeLogin($location.url()) && isLoggedIn) {
		$location.path('/403');
	}
	if (routeAuthor($location.url()) && !(isAuthor || isAdmin)) {
		$location.path('/403');
	}
	if (routeAdmin($location.url()) && !isAdmin) {
		$location.path('/403');
	}
});


crucioApp.factory('Page', function() {
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

crucioApp.service('Selection', function() {
	this.is_element_included = function(element, search_dictionary) {
		for (var key in search_dictionary) {
			if (key == 'query') {
				var query_string = '';
				search_dictionary.query_keys.forEach(function(query_key) {
				    query_string += element[query_key] + ' ';
				});

				var substring_array = search_dictionary.query.toLowerCase().split(' ');
				for (var i = 0, len = substring_array.length; i < len; ++i) {
					var substring = substring_array[i];
					if (query_string.toLowerCase().indexOf(substring) < 0 && substring) return false;
				}

			} else if (key == 'group') {
				if (search_dictionary.group != element.group_name && search_dictionary.group) return false;
			} else if (key != 'query_keys') {
				if (search_dictionary[key] != element[key] && search_dictionary[key]) return false;
			}
		}
		return true;
	}

	this.count = function(list, search_dictionary) {
		if(!list) { return 0; }

		var counter = 0;
		for (var i = 0; i < list.length; i++)
			if (this.is_element_included(list[i], search_dictionary)) counter++;

		return counter;
	}

	this.find_distinct = function(list, search_key) {
		var result = [];
		list.forEach(function(entry) {
			if (result.indexOf(entry[search_key]) == -1)
				result.push(entry[search_key]);
		});
		result.sort();
		return result;
	}
});

crucioApp.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' ?');
    };
});



Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
}

Array.prototype.getArrayByKey = function(name) {
	var array = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][name]) {
            array.push(this[i]);
        }
    }
    return array;
}