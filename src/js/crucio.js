var subject_list = {
	'Anästhesie und Intensivmedizin':[],

	'Biologie': [],

	'Biochemie': ['Chemie der Kohlenhydrate', 'Chemie der Aminosäuren, Peptide und Proteine', 'Chemie der Fettsäuren und Lipide', 'Chemie der Nukleotide und Nukleinsäuren', 'Vitamine und Koenzyme', 'Enzyme', 'Ernährung, Verdauung, Resorption', 'Abbau der Kohlenhydrate', 'Abbau der Fettsäuren, Ketonkörper', 'Aminosäurestoffwechsel', 'Zitratzyklus und Atmungskette', 'Glykogenstoffwechsel, Glukoneogenese', 'Biosynthese der Fettsäuren, Lipogenese', 'Mineral- und Elektrolythaushalt', 'Subzelluläre Strukturen', 'Nukleinsäuren, genetische Information, Molekularbiologie', 'Hormone', 'Immunchemie', 'Blut', 'Leber', 'Fettgewebe', 'Niere, Harn', 'Muskelgewebe, Bewegung', 'Binde- und Stützgewebe', 'Nervensystem'],

	'Physik': [],
	
	'Physiologie': ['Allgemeine und Zellphysiologie, Zellerregung', 'Blut und Immunsystem', 'Herz', 'Blutkreislauf', 'Atmung', 'Arbeit- und Leistungsphysiologie', 'Ernährung, Verdauungstrakt, Leber', 'Energie- und Wärmehaushalt', 'Wasser- und Elektrolythaushalt, Nierenfunktion', 'Hormonale Regulationen', 'Sexualentwicklung und Reproduktionsphysiologie', 'Funktionsprinzipien des Nervensystems', 'Muskulatur', 'Vegetatives Nervensystem', 'Motorik', 'Somatoviszerale Sensorik', 'Visuelles System', 'Auditorisches System', 'Chemische Sinne', 'Integrative Leistungen des Zentralnervensystems'],

	'Chemie': [],

	'Klinische Chemie': [],

	'Histologie': [],

	'Gynäkologie':[],

	'Chirurgie': [],

	'Pharmakologie': [],

	'Allgemeine Pathologie': [],

	'Mikrobiologie / Virologie / Immunologie / Hygiene': [],

	'Psychologie': []
};


var crucio = angular.module('crucioApp', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'rzModule', 'angular-loading-bar', 'ui.bootstrap', 'angularFileUpload', 'textAngular', 'angles', 'ipCookie',
	'userModule', 'learnModule', 'authorModule', 'adminModule']);


crucio.config(function($routeProvider, $locationProvider) {

    $routeProvider
    	.when('', { templateUrl: 'index.php', controller: 'loginCtrl' })
    	.when('/', { templateUrl: 'index.php', controller: 'loginCtrl' })
    	.when('/forgot-password', { templateUrl: 'forgot-password.php', controller: 'forgotPasswordCtrl' })
    	.when('/register', { templateUrl: 'register.php', controller: 'registerCtrl' })
    	.when('/activate-account', { templateUrl: 'activate-account.php', controller: 'activateCtrl' })
    	.when('/contact', { templateUrl: 'contact.php', controller: 'contactCtrl' })
    	.when('/about', { templateUrl: 'about.php', controller: 'aboutCtrl' })
    	.when('/stats', { templateUrl: 'stats.php', controller: 'statisticsCtrl' })

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

crucio.run(function(Auth, ipCookie, $rootScope, $location) {

	// enumerate routes that don't need authentication
	var routesThatDontRequireAuth = ['/', '/contact', '/about', '/blog', '/register', '/activate-account', '/forgot-password'];
	var routesThatLogin = ['/', '/register', '/forgot-password'];
	var routesForAuthor = ['/author', '/edit-exam'];
	var routesForAdmin = ['/admin']; // + Author Routes

    $rootScope.user = Auth.getUser();
	if (!$rootScope.user) {
    	var cookieUser = ipCookie('CrucioUser');
    	
		if (cookieUser) {
    		Auth.setUser(cookieUser);
		}
	}
	
	var routeinArray = function(array, route) {
		var route_c = route;
		if (-1 < route.indexOf('?'))
			route_c = route.substr(0, route.indexOf('?'));
		return (array.indexOf(route_c) > -1) ? 1 : 0;
	};

	var routeClean = function(route) {
		return routeinArray(routesThatDontRequireAuth, route);
	};
	var routeLogin = function(route) {
		return routeinArray(routesThatLogin, route);
	};
	var routeAuthor = function(route) {
		return routeinArray(routesForAuthor, route);
	};
	var routeAdmin = function(route) {
		return routeinArray(routesForAdmin, route);
	};
    
    var isLoggedIn = 0;
    var isAdmin = 0;
    var isAuthor = 0;
	if ($rootScope.user) {
	    isLoggedIn = ($rootScope.user.group_id) ? 1:0;
	    isAdmin = ($rootScope.user.group_id == 2) ? 1:0;
	    isAuthor = ($rootScope.user.group_id == 3) ? 1:0;
	}

	if (routeLogin($location.url()) && isLoggedIn)
		$location.path('/403');

	if (routeAuthor($location.url()) && !(isAuthor || isAdmin))
		$location.path('/403');

	if (routeAdmin($location.url()) && !isAdmin)
		$location.path('/403');

});


// Define other modules
angular.module('adminModule', []);
angular.module('authorModule', []);
angular.module('learnModule', []);
angular.module('userModule', ['ipCookie']);


// Prototype functions
Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
};

Array.prototype.getArrayByKey = function(name) {
	var array = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][name]) {
            array.push(this[i]);
        }
    }
    return array;
};