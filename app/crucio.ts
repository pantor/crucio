/// <reference path="crucio.d.ts"/>

import * as angular from 'angular';
import 'angular-cookies';
import 'angular-messages';
import 'ng-tags-input';
import '@uirouter/angularjs';
import 'angular-ui-bootstrap';
import 'angular-file-upload';
import 'spin.js';
import 'angular-spinner';
import 'angularjs-slider';
import 'angular-scroll';
import 'textangular/dist/textAngular-rangy.min';
import 'textangular/dist/textAngular-sanitize.min';
import 'textangular/dist/textAngular.umd';
import 'textangular/dist/textAngularSetup';


export const app = angular.module('crucioApp', [
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
]);


import './services/api.service';
import './services/auth.service';
import './services/collection.service';
import './services/page.service';

import './components/navbar/navbar';
import './components/timeago';
import './components/dropdown/dropdown';

import AuthService from './services/auth.service';

import { LearnComponent } from './learn/learn';
import { LearnOverviewComponent } from './learn/overview/overview';
import { LearnSubjectsComponent } from './learn/subjects/subjects';
import { LearnExamsComponent } from './learn/exams/exams';
import { LearnSearchComponent } from './learn/search/search';
import { LearnTagsComponent } from './learn/tags/tags';
import { LearnCommentsComponent } from './learn/comments/comments';
import { LearnOralExamsComponent } from './learn/oral-exams/oral-exams';
import { QuestionComponent } from './learn/question/question';
import { ExamComponent } from './learn/exam/exam';
import { StatisticComponent } from './learn/statistic/statistic';
import { AnalysisComponent } from './learn/analysis/analysis';

import { AuthorComponent } from './author/author';
import { AuthorExamsComponent } from './author/exams/exams';
import { AuthorCommentsComponent } from './author/comments/comments';
import { AuthorSubjectsComponent } from './author/subjects/subjects';
import { AuthorOralExamsComponent } from './author/oral-exams/oral-exams';
import { AuthorAdvicesComponent } from './author/advices/advices';
import { EditExamComponent } from './author/edit-exam/edit-exam';
import { EditOralExamComponent } from './author/edit-oral-exam/edit-oral-exam';

import { AdminComponent } from './admin/admin';
import { AdminUsersComponent } from './admin/users/users';
import { AdminWhitelistComponent } from './admin/whitelist/whitelist';
import { AdminToolsComponent } from './admin/tools/tools';
import { AdminStatsComponent } from './admin/stats/stats';
import { AdminActivityComponent } from './admin/activity/activity';

import { UserComponent } from './user/user';

import { Error403Component, Error404Component, Error500Component } from './error/error';
import { HelpComponent } from './help/help';



app.config(function config($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: angular.ILocationProvider, $provide) {

    const states: angular.ui.IState[] = [
      { name: 'learn', url: '/learn', component: LearnComponent },
      { name: 'learn.overview', url: '/overview', component: LearnOverviewComponent },
      { name: 'learn.subjects', url: '/subjects', component: LearnSubjectsComponent },
      { name: 'learn.exams', url: '/exams', component: LearnExamsComponent },
      { name: 'learn.search', url: '/search', component: LearnSearchComponent },
      { name: 'learn.tags', url: '/tags', component: LearnTagsComponent },
      { name: 'learn.comments', url: '/comments', component: LearnCommentsComponent },
      { name: 'learn.oral-exams', url: '/oral-exams', component: LearnOralExamsComponent },
      { name: 'question', url: '/question?questionId&resetSession', component: QuestionComponent },
      { name: 'exam', url: '/exam', component: ExamComponent },
      { name: 'statistic', url: '/statistic', component: StatisticComponent },
      { name: 'analysis', url: '/analysis', component: AnalysisComponent },

      { name: 'author', url: '/author', component: AuthorComponent },
      { name: 'author.exams', url: '/exams', component: AuthorExamsComponent },
      { name: 'author.comments', url: '/comments', component: AuthorCommentsComponent },
      { name: 'author.subjects', url: '/subjects', component: AuthorSubjectsComponent },
      { name: 'author.oral-exams', url: '/oral-exams', component: AuthorOralExamsComponent },
      { name: 'author.advices', url: '/advices', component: AuthorAdvicesComponent },
      { name: 'edit-exam', url: '/edit-exam?examId&questionId', component: EditExamComponent },
      { name: 'edit-oral-exam', url: '/edit-oral-exam?oralExamId', component: EditOralExamComponent },

      { name: 'admin', url: '/admin', component: AdminComponent },
      { name: 'admin.users', url: '/users', component: AdminUsersComponent },
      { name: 'admin.whitelist', url: '/whitelist', component: AdminWhitelistComponent },
      { name: 'admin.tools', url: '/tools', component: AdminToolsComponent },
      { name: 'admin.stats', url: '/stats', component: AdminStatsComponent },
      { name: 'admin.activity', url: '/activity', component: AdminActivityComponent },

      { name: 'user', url: '/user', component: UserComponent },

      { name: '403', url: '/403', component: Error403Component },
      { name: '404', url: '/404', component: Error404Component },
      { name: '500', url: '/500', component: Error500Component },
      { name: 'help', url: '/help', component: HelpComponent },
    ];

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true); // use the HTML5 History API
    // $compileProvider.debugInfoEnabled(false);

    for (const state of states) {
      $stateProvider.state(state);
    }

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
