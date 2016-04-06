/// <reference path='../typings/tsd.d.ts' />

angular.module('crucioApp', [
  'ngRoute',
  'ngCookies',
  'ngMessages',
  'ngTagsInput',
  'ui.bootstrap',
  'angular-loading-bar',
  'angularFileUpload',
  'angularSpinner',
  'textAngular',
  'chart.js',
  'rzModule',
  'duScroll',
])
  .config(function config($routeProvider, $locationProvider, $provide) {
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

    // textAngular
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
      taRegisterTool('times', {
    		buttontext: '&times;',
    		tooltiptext: 'times',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&times;");
    		}
    	});
    	taRegisterTool('arrow-left', {
    		buttontext: '&larr;',
    		tooltiptext: 'arrow-left',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&larr;");
    		}
    	});
    	taRegisterTool('arrow-right', {
    		buttontext: '&rarr;',
    		tooltiptext: 'arrow-right',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&rarr;");
    		}
    	});
    	taRegisterTool('arrow-left-right', {
    		buttontext: '&harr;',
    		tooltiptext: 'arrow-left-right',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&harr;");
    		}
    	});
    	taRegisterTool('sdot', {
    		buttontext: '&sdot;',
    		tooltiptext: 'sdot',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&sdot;");
    		}
    	});
    	taRegisterTool('asymp', {
    		buttontext: '&asymp;',
    		tooltiptext: 'asymp',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&asymp;");
    		}
    	});
    	taRegisterTool('radic', {
    		buttontext: '&radic;',
    		tooltiptext: 'radic',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&radic;");
    		}
    	});
    	taRegisterTool('prop', {
    		buttontext: '&prop;',
    		tooltiptext: 'prop',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&prop;");
    		}
    	});

    	taRegisterTool('alpha', {
    		buttontext: '&alpha;',
    		tooltiptext: 'alpha',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&alpha;");
    		}
    	});
    	taRegisterTool('beta', {
    		buttontext: '&beta;',
    		tooltiptext: 'beta',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&beta;");
    		}
    	});
    	taRegisterTool('gamma', {
    		buttontext: '&gamma;',
    		tooltiptext: 'gamma',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&gamma;");
    		}
    	});
    	taRegisterTool('delta', {
    		buttontext: '&delta;',
    		tooltiptext: 'delta',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&delta;");
    		}
    	});
    	taRegisterTool('lambda', {
    		buttontext: '&lambda;',
    		tooltiptext: 'lambda',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&lambda;");
    		}
    	});
    	taRegisterTool('mu', {
    		buttontext: '&mu;',
    		tooltiptext: 'mu',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&mu;");
    		}
    	});
    	taRegisterTool('pi', {
    		buttontext: '&pi;',
    		tooltiptext: 'pi',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&pi;");
    		}
    	});
    	taRegisterTool('rho', {
    		buttontext: '&rho;',
    		tooltiptext: 'rho',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&rho;");
    		}
    	});
    	taRegisterTool('omega', {
    		buttontext: '&omega;',
    		tooltiptext: 'omega',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&omega;");
    		}
    	});
    	taRegisterTool('Omega', {
    		buttontext: '&Omega;',
    		tooltiptext: 'Omega',
    		action: function(){
    			return this.$editor().wrapSelection("inserthtml", "&Omega;");
    		}
    	});
    	taRegisterTool('subscript', {
    		iconclass: 'fa fa-subscript',
    		tooltiptext: 'Subscript',
    		action: function(){
    			return this.$editor().wrapSelection("subscript", null);
    		},
    		activeState: function(){ return this.$editor().queryCommandState('subscript'); }
    	});
    	taRegisterTool('superscript', {
    		iconclass: 'fa fa-superscript',
    		tooltiptext: 'Superscript',
    		action: function(){
    			return this.$editor().wrapSelection("superscript", null);
    		},
    		activeState: function(){ return this.$editor().queryCommandState('superscript'); }
    	});

      return taOptions;
    }]);
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
