const subject_list = {
    'Allgemeine Pathologie': [],
    'Anästhesie und Intensivmedizin': [],
    'Biochemie': ['Chemie der Kohlenhydrate', 'Chemie der Aminosäuren, Peptide und Proteine', 'Chemie der Fettsäuren und Lipide', 'Chemie der Nukleotide und Nukleinsäuren', 'Vitamine und Koenzyme', 'Enzyme', 'Ernährung, Verdauung, Resorption', 'Abbau der Kohlenhydrate', 'Abbau der Fettsäuren, Ketonkörper', 'Aminosäurestoffwechsel', 'Zitratzyklus und Atmungskette', 'Glykogenstoffwechsel, Glukoneogenese', 'Biosynthese der Fettsäuren, Lipogenese', 'Mineral- und Elektrolythaushalt', 'Subzelluläre Strukturen', 'Nukleinsäuren, genetische Information, Molekularbiologie', 'Hormone', 'Immunchemie', 'Blut', 'Leber', 'Fettgewebe', 'Niere, Harn', 'Muskelgewebe, Bewegung', 'Binde- und Stützgewebe', 'Nervensystem'],
    'Biologie': [],
    'Chemie': [],
    'Chirurgie': [],
    'Gynäkologie': [],
    'Histologie': [],
    'Klinische Chemie': [],
    'Mikrobiologie / Virologie / Immunologie / Hygiene': [],
    'Pharmakologie': [],
    'Physik': [],
    'Physiologie': ['Allgemeine und Zellphysiologie, Zellerregung', 'Blut und Immunsystem', 'Herz', 'Blutkreislauf', 'Atmung', 'Arbeit- und Leistungsphysiologie', 'Ernährung, Verdauungstrakt, Leber', 'Energie- und Wärmehaushalt', 'Wasser- und Elektrolythaushalt, Nierenfunktion', 'Hormonale Regulationen', 'Sexualentwicklung und Reproduktionsphysiologie', 'Funktionsprinzipien des Nervensystems', 'Muskulatur', 'Vegetatives Nervensystem', 'Motorik', 'Somatoviszerale Sensorik', 'Visuelles System', 'Auditorisches System', 'Chemische Sinne', 'Integrative Leistungen des Zentralnervensystems'],
    'Psychologie': [],
};
subject_list.Biologie = [];


angular.module('crucioApp', [
    'ngRoute',
    'ngSanitize',
    'ngCookies',
    'ngTagsInput',
    'ui.bootstrap',
    'angular-loading-bar',
    'angularFileUpload',
    'angularSpinner',
    'textAngular',
    'angles',
    'rzModule',
    'duScroll',
    'userModule',
    'learnModule',
    'authorModule',
    'adminModule',
])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/questions', { templateUrl: 'views/questions.html', controller: 'QuestionsController', controllerAs: 'ctrl' })
            .when('/author', { templateUrl: 'views/author.html', controller: 'AuthorController', controllerAs: 'ctrl' })
            .when('/admin', { templateUrl: 'views/admin.html', controller: 'AdminController', controllerAs: 'ctrl' })
            .when('/global-statistic', { templateUrl: 'views/global-statistic.html', controller: 'GlobalStatisticController', controllerAs: 'ctrl' })
            .when('/account', { templateUrl: 'views/account.html', controller: 'AccountController', controllerAs: 'ctrl' })
            .when('/settings', { templateUrl: 'views/settings.html', controller: 'SettingsController', controllerAs: 'ctrl' })
            .when('/edit-exam', { templateUrl: 'views/edit-exam.html', controller: 'EditController', controllerAs: 'ctrl' })
            .when('/question', { templateUrl: 'views/question.html', controller: 'QuestionController', controllerAs: 'ctrl' })
            .when('/exam', { templateUrl: 'views/exam.html', controller: 'ExamController', controllerAs: 'ctrl' })
            .when('/statistic', { templateUrl: 'views/statistic.html', controller: 'StatisticController', controllerAs: 'ctrl' })
            .when('/analysis', { templateUrl: 'views/analysis.html', controller: 'AnalysisController', controllerAs: 'ctrl' })
            .when('/help', { templateUrl: 'views/help.html', controller: 'HelpController', controllerAs: 'ctrl' })
            .when('/403', { templateUrl: 'views/403.html', controller: 'ErrorController', controllerAs: 'ctrl' })
            .when('/404', { templateUrl: 'views/404.html', controller: 'ErrorController', controllerAs: 'ctrl' })
            .when('/500', { templateUrl: 'views/500.html', controller: 'ErrorController', controllerAs: 'ctrl' })

            .otherwise({ redirectTo: '/404' });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);

        // $compileProvider.debugInfoEnabled(false);
    })

    .run(function (Auth, $location, $window) {
        // enumerate routes that don't need authentication
        const routesThatLogin = ['/', '/register', '/forgot-password', '/activate-account'];
        const routesForAuthor = ['/author', '/edit-exam'];
        const routesForAdmin = ['/admin', '/global-statistic']; // + Author Routes

        const user = Auth.tryGetUser();

        function routeInArray(array, route) {
            let routeC = route;
            if (route.indexOf('?') > -1) {
                routeC = route.substr(0, route.indexOf('?'));
            }
            return (array.indexOf(routeC) > -1) ? 1 : 0;
        }

        let isLoggedIn = 0;
        let isAdmin = 0;
        let isAuthor = 0;
        if (user) {
            isLoggedIn = (user.group_id) ? 1 : 0;
            isAdmin = (user.group_id == 2) ? 1 : 0;
            isAuthor = (user.group_id == 3) ? 1 : 0;
        }

        const url = $location.url();
        if (routeInArray(routesThatLogin, url) && isLoggedIn && user.remember_user) {
            $window.location.replace('/questions');
        }

        if (routeInArray(routesForAuthor, url) && !(isAuthor || isAdmin)) {
            $window.location.replace('/403');
        }

        if (routeInArray(routesForAdmin, url) && !isAdmin) {
            $window.location.replace('/403');
        }
    });


// Create other modules
angular.module('adminModule', []);
angular.module('authorModule', []);
angular.module('learnModule', []);
angular.module('userModule', []);
