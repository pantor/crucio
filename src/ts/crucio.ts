/// <reference path='../../typings/tsd.d.ts' />

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
    $routeProvider
      .when('/learn', { template: '<learnComponent></learnComponent>' })
      .when('/author', { template: '<authorComponent></authorComponent>' })
      .when('/admin', { template: '<adminComponent></adminComponent>' })
      .when('/global-statistic', { template: '<globalStatisticComponent></globalStatisticComponent>' })
      .when('/account', { template: '<accountComponent></accountComponent>' })
      .when('/settings', { template: '<settingsComponent></settingsComponent>' })
      .when('/edit-exam', { template: '<editExamComponent></editExamComponent>' })
      .when('/question', { template: '<questionComponent></questionComponent>' })
      .when('/exam', { template: '<examComponent></examComponent>' })
      .when('/statistic', { template: '<statisticComponent></statisticComponent>' })
      .when('/analysis', { template: '<analysisComponent></analysisComponent>' })
      .when('/help', { template: '<helpComponent></helpComponent>' })
      .when('/403', { template: '<error403Component></error403Component>' })
      .when('/404', { template: '<error404Component></error404Component>' })
      .when('/500', { template: '<error500Component></error500Component>' })
      .otherwise({ redirectTo: '/404' });

    $locationProvider.html5Mode(true); // use the HTML5 History API
    // $compileProvider.debugInfoEnabled(false);
  })

  .run(function run(Auth, $location, $window) {
    // Enumerate paths that don't need authentication
    const pathsThatLogin = ['/', '/register', '/forgot-password'];
    const pathsForAuthor = ['/author', '/edit-exam'];
    const pathsForAdmin = ['/admin', '/global-statistic']; // + Author paths

    const user = Auth.tryGetUser();

    let isLoggedIn = false;
    let isAdmin = false;
    let isAuthor = false;
    if (user) {
      isLoggedIn = Boolean(user.group_id);
      isAdmin = Boolean(user.group_id === 2);
      isAuthor = Boolean(user.group_id === 3);
    }

    const path = $location.path();
    if (pathsThatLogin.indexOf(path) > -1 && isLoggedIn && user.remember_user) {
      $window.location.replace('/learn');
    }

    if (pathsForAuthor.indexOf(path) > -1 && !(isAuthor || isAdmin)) {
      $window.location.replace('/403');
    }

    if (pathsForAdmin.indexOf(path) > -1 && !isAdmin) {
      $window.location.replace('/403');
    }
  });
