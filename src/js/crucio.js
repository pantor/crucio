angular.module('crucioApp', [
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ngMessages',
  'ngTagsInput',
  'ui.bootstrap',
  'angular-loading-bar',
  'angularFileUpload',
  'angularSpinner',
  'textAngular',
  'angles',
  'rzModule',
  'duScroll',
])
  .config(function config($routeProvider, $locationProvider) {
    function routeGenerator(fileName, controller) {
      return { controller, controllerAs: 'ctrl', templateUrl: 'views/' + fileName + '.html' };
    }

    $routeProvider
      .when('/learn', routeGenerator('learn', 'LearnController'))
      .when('/author', routeGenerator('author', 'AuthorController'))
      .when('/admin', routeGenerator('admin', 'AdminController'))
      .when('/global-statistic', routeGenerator('global-statistic', 'GlobalStatisticController'))
      .when('/account', routeGenerator('account', 'AccountController'))
      .when('/settings', routeGenerator('settings', 'SettingsController'))
      .when('/edit-exam', routeGenerator('edit-exam', 'EditExamController'))
      .when('/question', routeGenerator('question', 'QuestionController'))
      .when('/exam', routeGenerator('exam', 'ExamController'))
      .when('/statistic', routeGenerator('statistic', 'StatisticController'))
      .when('/analysis', routeGenerator('analysis', 'AnalysisController'))
      .when('/help', routeGenerator('help', 'HelpController'))
      .when('/403', routeGenerator('403', 'ErrorController'))
      .when('/404', routeGenerator('404', 'ErrorController'))
      .when('/500', routeGenerator('500', 'ErrorController'))
      .otherwise({ redirectTo: '/404' });

    $locationProvider.html5Mode(true); // use the HTML5 History API
    // $compileProvider.debugInfoEnabled(false);
  })

  .run(function run(Auth, $location, $window) {
    // Enumerate routes that don't need authentication
    const routesThatLogin = ['/', '/register', '/forgot-password'];
    const routesForAuthor = ['/author', '/edit-exam'];
    const routesForAdmin = ['/admin', '/global-statistic']; // + Author routes

    const user = Auth.tryGetUser();

    function routeInArray(array, route) {
      let routeC = route;
      if (route.includes('?')) {
        routeC = route.substr(0, route.indexOf('?'));
      }
      return array.includes(routeC);
    }

    let isLoggedIn = false;
    let isAdmin = false;
    let isAuthor = false;
    if (user) {
      isLoggedIn = Boolean(user.group_id);
      isAdmin = Boolean(user.group_id === 2);
      isAuthor = Boolean(user.group_id === 3);
    }

    const url = $location.url();
    if (routeInArray(routesThatLogin, url) && isLoggedIn && user.remember_user) {
      $window.location.replace('/learn');
    }

    if (routeInArray(routesForAuthor, url) && !(isAuthor || isAdmin)) {
      $window.location.replace('/403');
    }

    if (routeInArray(routesForAdmin, url) && !isAdmin) {
      $window.location.replace('/403');
    }
  });
