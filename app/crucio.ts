angular.module('crucioApp', [
  'ngCookies',
  'ngMessages',
  'ngTagsInput',
  'ui.router',
  'ui.bootstrap',
  'angularFileUpload',
  'angularSpinner',
  'textAngular',
  'rzModule',
  'duScroll',
])
  .config(function config($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider, $provide) {

    const states: angular.ui.IState[] = [
      { name: 'learn', url: '/learn', component: 'learncomponent' },
      { name: 'learn.overview', url: '/overview', component: 'learnoverviewcomponent' },
      { name: 'learn.subjects', url: '/subjects', component: 'learnsubjectscomponent' },
      { name: 'learn.exams', url: '/exams', component: 'learnexamscomponent' },
      { name: 'learn.search', url: '/search', component: 'learnsearchcomponent' },
      { name: 'learn.tags', url: '/tags', component: 'learntagscomponent' },
      { name: 'learn.comments', url: '/comments', component: 'learncommentscomponent' },
      { name: 'learn.oral-exams', url: '/oral-exams', component: 'learnoralexamscomponent' },
      { name: 'question', url: '/question?questionId&resetSession', component: 'questioncomponent' },
      { name: 'exam', url: '/exam', component: 'examcomponent' },
      { name: 'statistic', url: '/statistic', component: 'statisticcomponent' },
      { name: 'analysis', url: '/analysis', component: 'analysiscomponent' },

      { name: 'author', url: '/author', component: 'authorcomponent' },
      { name: 'author.exams', url: '/exams', component: 'authorexamscomponent' },
      { name: 'author.comments', url: '/comments', component: 'authorcommentscomponent' },
      { name: 'author.subjects', url: '/subjects', component: 'authorsubjectscomponent' },
      { name: 'author.oral-exams', url: '/oral-exams', component: 'authororalexamscomponent' },
      { name: 'author.advices', url: '/advices', component: 'authoradvicescomponent' },
      { name: 'edit-exam', url: '/edit-exam?examId&questionId', component: 'editexamcomponent' },
      { name: 'edit-oral-exam', url: '/edit-oral-exam?oralExamId', component: 'editoralexamcomponent' },

      { name: 'admin', url: '/admin', component: 'admincomponent' },
      { name: 'admin.users', url: '/users', component: 'adminuserscomponent' },
      { name: 'admin.whitelist', url: '/whitelist', component: 'adminwhitelistcomponent' },
      { name: 'admin.tools', url: '/tools', component: 'admintoolscomponent' },
      { name: 'admin.stats', url: '/stats', component: 'adminstatscomponent' },
      { name: 'admin.activity', url: '/activity', component: 'adminactivitycomponent' },

      { name: 'user', url: '/user', component: 'usercomponent' },

      { name: '403', url: '/403', component: 'error403component' },
      { name: '404', url: '/404', component: 'error404component' },
      { name: '500', url: '/500', component: 'error500component' },
      { name: 'help', url: '/help', component: 'helpcomponent' },
    ];

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true); // use the HTML5 History API
    // $compileProvider.debugInfoEnabled(false);

    states.forEach(function(state) {
      $stateProvider.state(state);
    });

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

  .run(function run(Auth: AuthService, $location: angular.ILocationService, $window: angular.IWindowService) {
    // Enumerate paths that don't need authentication
    const pathsThatLogin = ['/', '/register', '/forgot-password'];
    const pathsForAuthor = ['/author', '/edit-exam', '/edit-oral-exam'];
    const pathsForAdmin = ['/admin']; // + Author paths

    const user = Auth.tryGetUser();

    let isLoggedIn = false;
    let isAdmin = false;
    let isAuthor = false;
    if (user) {
      isLoggedIn = Boolean(user.group_id);
      isAdmin = Boolean(user.group_id === 2);
      isAuthor = Boolean(user.group_id === 3);
    }

    const path: string = $location.path();
    if (pathsThatLogin.indexOf(path) > -1 && isLoggedIn && user.remember_user) {
      $window.location.replace('/learn/overview');
    }

    if (pathsForAuthor.indexOf(path) > -1 && !(isAuthor || isAdmin)) {
      $window.location.replace('/403');
    }

    if (pathsForAdmin.indexOf(path) > -1 && !isAdmin) {
      $window.location.replace('/403');
    }
  });
