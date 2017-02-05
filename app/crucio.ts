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

    function comp(name: string): string {
      return '<' + name + 'Component></' + name + 'Component>';
    }

    // Use components directly in ui-router@1.0
    const states: angular.ui.IState[] = [
      { name: 'learn', url: '/learn', template: comp('learn') },
      { name: 'learn.overview', url: '/overview', template: comp('learnoverview') },
      { name: 'learn.subjects', url: '/subjects', template: comp('learnsubjects') },
      { name: 'learn.exams', url: '/exams', template: comp('learnexams') },
      { name: 'learn.search', url: '/search', template: comp('learnsearch') },
      { name: 'learn.tags', url: '/tags', template: comp('learntags') },
      { name: 'learn.comments', url: '/comments', template: comp('learncomments') },
      { name: 'learn.oral-exams', url: '/oral-exams', template: comp('learnoralexams') },
      { name: 'question', url: '/question?questionId&resetSession', template: comp('question') },
      { name: 'exam', url: '/exam?examId', template: comp('exam') },
      { name: 'statistic', url: '/statistic', template: comp('statistic') },
      { name: 'analysis', url: '/analysis', template: comp('analysis') },

      { name: 'author', url: '/author', template: comp('author') },
      { name: 'author.exams', url: '/exams', template: comp('authorexams') },
      { name: 'author.comments', url: '/comments', template: comp('authorcomments') },
      { name: 'author.subjects', url: '/subjects', template: comp('authorsubjects') },
      { name: 'author.oral-exams', url: '/oral-exams', template: comp('authororalexams') },
      { name: 'author.advices', url: '/advices', template: comp('authoradvices') },
      { name: 'edit-exam', url: '/edit-exam?examId&questionId', template: comp('editExam') },
      { name: 'edit-oral-exam', url: '/edit-oral-exam?oralExamId', template: comp('editOralExam') },

      { name: 'admin', url: '/admin', template: comp('admin') },
      { name: 'admin.users', url: '/users', template: comp('adminusers') },
      { name: 'admin.whitelist', url: '/whitelist', template: comp('adminwhitelist') },
      { name: 'admin.tools', url: '/tools', template: comp('admintools') },
      { name: 'admin.stats', url: '/stats', template: comp('adminstats') },
      { name: 'admin.activity', url: '/activity', template: comp('adminactivity') },

      { name: 'user', url: '/user', template: comp('user') },

      { name: '403', url: '/403', template: comp('error403') },
      { name: '404', url: '/404', template: comp('error404') },
      { name: '500', url: '/500', template: comp('error500') },
      { name: 'help', url: '/help', template: comp('help') },
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
    const pathsThatLogin: string[] = ['/', '/register', '/forgot-password'];
    const pathsForAuthor: string[] = ['/author', '/edit-exam', '/edit-oral-exam'];
    const pathsForAdmin: string[] = ['/admin']; // + Author paths

    const user: Crucio.User = Auth.tryGetUser();

    let isLoggedIn: boolean = false;
    let isAdmin: boolean = false;
    let isAuthor: boolean = false;
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
