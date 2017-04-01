var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$provide", function config($stateProvider, $urlRouterProvider, $locationProvider, $provide) {
    function comp(name) {
        return '<' + name + 'Component></' + name + 'Component>';
    }
    var states = [
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
    $locationProvider.html5Mode(true);
    states.forEach(function (state) {
        $stateProvider.state(state);
    });
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
            taRegisterTool('times', {
                buttontext: '&times;',
                tooltiptext: 'times',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&times;");
                }
            });
            taRegisterTool('arrow-left', {
                buttontext: '&larr;',
                tooltiptext: 'arrow-left',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&larr;");
                }
            });
            taRegisterTool('arrow-right', {
                buttontext: '&rarr;',
                tooltiptext: 'arrow-right',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&rarr;");
                }
            });
            taRegisterTool('arrow-left-right', {
                buttontext: '&harr;',
                tooltiptext: 'arrow-left-right',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&harr;");
                }
            });
            taRegisterTool('sdot', {
                buttontext: '&sdot;',
                tooltiptext: 'sdot',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&sdot;");
                }
            });
            taRegisterTool('asymp', {
                buttontext: '&asymp;',
                tooltiptext: 'asymp',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&asymp;");
                }
            });
            taRegisterTool('radic', {
                buttontext: '&radic;',
                tooltiptext: 'radic',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&radic;");
                }
            });
            taRegisterTool('prop', {
                buttontext: '&prop;',
                tooltiptext: 'prop',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&prop;");
                }
            });
            taRegisterTool('alpha', {
                buttontext: '&alpha;',
                tooltiptext: 'alpha',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&alpha;");
                }
            });
            taRegisterTool('beta', {
                buttontext: '&beta;',
                tooltiptext: 'beta',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&beta;");
                }
            });
            taRegisterTool('gamma', {
                buttontext: '&gamma;',
                tooltiptext: 'gamma',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&gamma;");
                }
            });
            taRegisterTool('delta', {
                buttontext: '&delta;',
                tooltiptext: 'delta',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&delta;");
                }
            });
            taRegisterTool('lambda', {
                buttontext: '&lambda;',
                tooltiptext: 'lambda',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&lambda;");
                }
            });
            taRegisterTool('mu', {
                buttontext: '&mu;',
                tooltiptext: 'mu',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&mu;");
                }
            });
            taRegisterTool('pi', {
                buttontext: '&pi;',
                tooltiptext: 'pi',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&pi;");
                }
            });
            taRegisterTool('rho', {
                buttontext: '&rho;',
                tooltiptext: 'rho',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&rho;");
                }
            });
            taRegisterTool('omega', {
                buttontext: '&omega;',
                tooltiptext: 'omega',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&omega;");
                }
            });
            taRegisterTool('Omega', {
                buttontext: '&Omega;',
                tooltiptext: 'Omega',
                action: function () {
                    return this.$editor().wrapSelection("inserthtml", "&Omega;");
                }
            });
            taRegisterTool('subscript', {
                iconclass: 'fa fa-subscript',
                tooltiptext: 'Subscript',
                action: function () {
                    return this.$editor().wrapSelection("subscript", null);
                },
                activeState: function () { return this.$editor().queryCommandState('subscript'); }
            });
            taRegisterTool('superscript', {
                iconclass: 'fa fa-superscript',
                tooltiptext: 'Superscript',
                action: function () {
                    return this.$editor().wrapSelection("superscript", null);
                },
                activeState: function () { return this.$editor().queryCommandState('superscript'); }
            });
            return taOptions;
        }]);
}])
    .run(["Auth", "$location", "$window", function run(Auth, $location, $window) {
    var pathsThatLogin = ['/', '/register', '/forgot-password'];
    var pathsForAuthor = ['/author', '/edit-exam', '/edit-oral-exam'];
    var pathsForAdmin = ['/admin'];
    var user = Auth.tryGetUser();
    var isLoggedIn = false;
    var isAdmin = false;
    var isAuthor = false;
    if (user) {
        isLoggedIn = Boolean(user.group_id);
        isAdmin = Boolean(user.group_id === 2);
        isAuthor = Boolean(user.group_id === 3);
    }
    var path = $location.path();
    if (pathsThatLogin.indexOf(path) > -1 && isLoggedIn && user.remember_user) {
        $window.location.replace('/learn/overview');
    }
    if (pathsForAuthor.indexOf(path) > -1 && !(isAuthor || isAdmin)) {
        $window.location.replace('/403');
    }
    if (pathsForAdmin.indexOf(path) > -1 && !isAdmin) {
        $window.location.replace('/403');
    }
}]);
var AdminController = (function () {
    AdminController.$inject = ["Page"];
    function AdminController(Page) {
        Page.setTitleAndNav('Admin | Crucio', 'Admin');
    }
    return AdminController;
}());
angular.module('crucioApp').component('admincomponent', {
    templateUrl: 'app/admin/admin.html',
    controller: AdminController
});
var AdminActivityController = (function () {
    AdminActivityController.$inject = ["Page", "Auth", "API", "$interval"];
    function AdminActivityController(Page, Auth, API, $interval) {
        var _this = this;
        this.API = API;
        Page.setTitleAndNav('Statistik | Crucio', 'Admin');
        this.updateActivity = false;
        this.showActivity = {
            result: true,
            login: true,
            register: true,
            comment: true,
            examNew: true,
            examUpdate: true
        };
        $interval(function () {
            if (_this.updateActivity) {
                _this.loadActivity();
            }
        }, 2500);
        this.loadActivity();
    }
    AdminActivityController.prototype.loadActivity = function () {
        var _this = this;
        var showActivityBoolean = {
            result: this.showActivity.result | 0,
            login: this.showActivity.login | 0,
            register: this.showActivity.register | 0,
            comment: this.showActivity.comment | 0,
            examNew: this.showActivity.examNew | 0,
            examUpdate: this.showActivity.examUpdate | 0
        };
        this.API.get('stats/activities', showActivityBoolean).then(function (result) {
            _this.activities = result.data.activities;
        });
    };
    return AdminActivityController;
}());
angular.module('crucioApp').component('adminactivitycomponent', {
    templateUrl: 'app/admin/activity/activity.html',
    controller: AdminActivityController
});
var AdminStatsController = (function () {
    AdminStatsController.$inject = ["Auth", "API"];
    function AdminStatsController(Auth, API) {
        var _this = this;
        this.API = API;
        this.API.get('stats/summary').then(function (result) {
            _this.stats = result.data.stats;
        });
    }
    return AdminStatsController;
}());
angular.module('crucioApp').component('adminstatscomponent', {
    templateUrl: 'app/admin/stats/stats.html',
    controller: AdminStatsController
});
var AdminToolsController = (function () {
    AdminToolsController.$inject = ["Auth", "API"];
    function AdminToolsController(Auth, API) {
        this.API = API;
    }
    AdminToolsController.prototype.changeSemester = function (difference) {
        var data = { difference: difference };
        this.API.put('users/change-semester', data).then(function (result) {
            alert(result.data.status);
        });
    };
    AdminToolsController.prototype.removeTestAccount = function () {
        this.API["delete"]('users/test-account').then(function (result) {
            alert(result.data.status);
        });
    };
    return AdminToolsController;
}());
angular.module('crucioApp').component('admintoolscomponent', {
    templateUrl: 'app/admin/tools/tools.html',
    controller: AdminToolsController
});
var DeleteUserModalController = (function () {
    DeleteUserModalController.$inject = ["API"];
    function DeleteUserModalController(API) {
        this.API = API;
    }
    DeleteUserModalController.prototype.$onInit = function () {
        this.user = this.resolve.user;
    };
    DeleteUserModalController.prototype.deleteUser = function () {
        this.API["delete"]("users/" + this.user.user_id);
        this.close({ $value: 'delete' });
    };
    return DeleteUserModalController;
}());
angular.module('crucioApp').component('deleteUserModalComponent', {
    templateUrl: 'app/admin/users/delete-user-modal.html',
    controller: DeleteUserModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var UserModalController = (function () {
    UserModalController.$inject = ["API"];
    function UserModalController(API) {
        var _this = this;
        this.API = API;
        this.API.get('users/distinct').then(function (result) {
            _this.distinctGroups = result.data.groups;
            _this.distinctGroupsPerId = {};
            for (var _i = 0, _a = _this.distinctGroups; _i < _a.length; _i++) {
                var e = _a[_i];
                _this.distinctGroupsPerId[e.group_id] = e.name;
            }
        });
    }
    UserModalController.prototype.$onInit = function () {
        this.user = this.resolve.user;
        this.newGroupID = this.user.group_id;
    };
    UserModalController.prototype.deleteUser = function () {
        this.API["delete"]("users/" + this.user.user_id);
        this.close({ $value: 'delete' });
    };
    UserModalController.prototype.save = function () {
        this.user.group_id = this.newGroupID;
        var data = { group_id: this.newGroupID };
        this.API.put("users/" + this.user.user_id + "/group", data);
        this.close({ $value: 'save' });
    };
    return UserModalController;
}());
angular.module('crucioApp').component('userModalComponent', {
    templateUrl: 'app/admin/users/user-modal.html',
    controller: UserModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var AdminUsersController = (function () {
    AdminUsersController.$inject = ["Auth", "API", "$uibModal"];
    function AdminUsersController(Auth, API, $uibModal) {
        var _this = this;
        this.API = API;
        this.$uibModal = $uibModal;
        this.user = Auth.getUser();
        this.userSearch = {};
        this.API.get('users/distinct').then(function (result) {
            _this.distinctGroups = result.data.groups;
            _this.distinctSemesters = result.data.semesters;
            _this.distinctGroupsPerId = {};
            for (var _i = 0, _a = _this.distinctGroups; _i < _a.length; _i++) {
                var e = _a[_i];
                _this.distinctGroupsPerId[e.group_id] = e.name;
            }
        });
        this.loadUsers();
    }
    AdminUsersController.prototype.loadUsers = function () {
        var _this = this;
        var data = {
            semester: this.userSearch.semester,
            group_id: this.userSearch.group,
            query: this.userSearch.query,
            limit: 100
        };
        this.API.get('users', data).then(function (result) {
            _this.users = result.data.users;
        });
    };
    AdminUsersController.prototype.changeGroup = function (index) {
        var userId = this.users[index].user_id;
        var groupId = this.users[index].group_id;
        groupId = (groupId % this.distinctGroups.length) + 1;
        this.users[index].group_id = groupId;
        for (var _i = 0, _a = this.distinctGroups; _i < _a.length; _i++) {
            var e = _a[_i];
            if (e.group_id === groupId) {
                this.users[index].group_name = e.name;
                break;
            }
        }
        var data = { group_id: groupId };
        this.API.put("users/" + userId + "/group", data);
    };
    AdminUsersController.prototype.isToday = function (dateString, hourDiff) {
        if (hourDiff === void 0) { hourDiff = 0; }
        var today = new Date();
        var diff = today - 1000 * 60 * 60 * hourDiff;
        var compareDate = new Date(diff);
        var date = new Date(dateString * 1000);
        return (compareDate.toDateString() === date.toDateString());
    };
    AdminUsersController.prototype.deleteUserModal = function (index) {
        var _this = this;
        var modal = this.$uibModal.open({
            component: 'deleteUserModalComponent',
            resolve: {
                user: function () { return _this.users[index]; }
            }
        });
        modal.result.then(function (response) {
            if (response == 'delete') {
                _this.users.splice(index, 1);
            }
        });
    };
    return AdminUsersController;
}());
angular.module('crucioApp').component('adminuserscomponent', {
    templateUrl: 'app/admin/users/users.html',
    controller: AdminUsersController
});
var AdminWhitelistController = (function () {
    AdminWhitelistController.$inject = ["Auth", "API"];
    function AdminWhitelistController(Auth, API) {
        var _this = this;
        this.API = API;
        this.API.get('whitelist').then(function (result) {
            _this.whitelist = result.data.whitelist;
        });
    }
    AdminWhitelistController.prototype.addMail = function () {
        var email = this.newWhitelistEmail;
        if (email) {
            this.whitelist.push({ mail_address: email, username: '' });
            var data = { email: email };
            this.API.post('whitelist', data);
        }
    };
    AdminWhitelistController.prototype.removeMail = function (index) {
        var email = this.whitelist[index].mail_address;
        if (email) {
            this.whitelist.splice(index, 1);
            this.API["delete"]("whitelist/" + email);
        }
    };
    return AdminWhitelistController;
}());
angular.module('crucioApp').component('adminwhitelistcomponent', {
    templateUrl: 'app/admin/whitelist/whitelist.html',
    controller: AdminWhitelistController
});
var AuthorController = (function () {
    AuthorController.$inject = ["Page"];
    function AuthorController(Page) {
        Page.setTitleAndNav('Autor | Crucio', 'Author');
    }
    return AuthorController;
}());
angular.module('crucioApp').component('authorcomponent', {
    templateUrl: 'app/author/author.html',
    controller: AuthorController
});
var AuthorAdivcesController = (function () {
    function AuthorAdivcesController() {
    }
    return AuthorAdivcesController;
}());
angular.module('crucioApp').component('authoradvicescomponent', {
    templateUrl: 'app/author/advices/advices.html',
    controller: AuthorAdivcesController
});
var AuthorCommentsController = (function () {
    AuthorCommentsController.$inject = ["Auth", "API"];
    function AuthorCommentsController(Auth, API) {
        var _this = this;
        this.API = API;
        this.user = Auth.getUser();
        this.commentSearch = { author: this.user };
        this.API.get('exams/distinct').then(function (result) {
            _this.distinctAuthors = result.data.authors;
        });
        this.loadComments();
    }
    AuthorCommentsController.prototype.loadComments = function () {
        var _this = this;
        var data = {
            author_id: this.commentSearch.author && this.commentSearch.author.user_id,
            query: this.commentSearch.query,
            limit: 100
        };
        this.API.get('comments/author', data).then(function (result) {
            _this.comments = result.data.comments;
            _this.questionsByComment = [];
            for (var _i = 0, _a = _this.comments; _i < _a.length; _i++) {
                var c = _a[_i];
                var found = -1;
                for (var i = 0; i < _this.questionsByComment.length; i++) {
                    if (_this.questionsByComment[i][0].question === c.question) {
                        found = i;
                        break;
                    }
                }
                if (found > 0) {
                    _this.questionsByComment[found].push(c);
                }
                else {
                    _this.questionsByComment.push([c]);
                }
            }
            _this.questionsByComment.sort(function (a, b) { return b[0].date - a[0].date; });
        });
    };
    return AuthorCommentsController;
}());
angular.module('crucioApp').component('authorcommentscomponent', {
    templateUrl: 'app/author/comments/comments.html',
    controller: AuthorCommentsController
});
var DeleteExamModalController = (function () {
    DeleteExamModalController.$inject = ["API", "$location"];
    function DeleteExamModalController(API, $location) {
        this.API = API;
        this.$location = $location;
    }
    DeleteExamModalController.prototype.$onInit = function () {
        this.examId = this.resolve.examId;
    };
    DeleteExamModalController.prototype.deleteExam = function () {
        var _this = this;
        this.API["delete"]("exams/" + this.examId).then(function () {
            _this.close({ $value: 'ok' });
            _this.$location.url('/author/exams');
        });
    };
    return DeleteExamModalController;
}());
angular.module('crucioApp').component('deleteExamModalComponent', {
    templateUrl: 'app/author/edit-exam/delete-exam-modal.html',
    controller: DeleteExamModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var EditExamController = (function () {
    EditExamController.$inject = ["Page", "Auth", "API", "Cut", "FileUploader", "$scope", "$location", "$stateParams", "$uibModal"];
    function EditExamController(Page, Auth, API, Cut, FileUploader, $scope, $location, $stateParams, $uibModal) {
        var _this = this;
        this.API = API;
        this.Cut = Cut;
        this.FileUploader = FileUploader;
        this.$location = $location;
        this.$uibModal = $uibModal;
        Page.setTitleAndNav('Klausur | Crucio', 'Author');
        this.user = Auth.getUser();
        this.examId = $stateParams.examId;
        this.openQuestionId = parseInt($stateParams.questionId, 0);
        this.openQuestionIndex = -1;
        this.numberChanged = -3;
        this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
        this.uploader.onSuccessItem = function (fileItem, response) {
            _this.exam.file_name = response.upload_name;
        };
        this.uploaderArray = [];
        this.exam_types = [
            'Erstklausur',
            'Wiederholungsklausur',
            'Leistungskontrolle',
            'Fragensammlung',
            'Testat',
            'Sonstiges',
        ];
        $scope.$watch(function () { return _this.exam; }, function () {
            _this.hasChanged = (_this.numberChanged > 0);
            _this.numberChanged += 1;
        }, true);
        $scope.$watch(function () { return _this.questions; }, function () {
            _this.hasChanged = (_this.numberChanged > 0);
            _this.numberChanged += 1;
        }, true);
        $scope.$on('$locationChangeStart', function (event) {
            if (_this.hasChanged) {
                var confirmClose = confirm('Die Änderungen an der Klausur bleiben dann ungespeichert. Wirklich verlassen?');
                if (!confirmClose) {
                    event.preventDefault();
                }
            }
        });
        this.API.get('subjects').then(function (result) {
            _this.subjectList = result.data.subjects;
            _this.subjectListPerId = {};
            _this.categoryListPerId = {};
            for (var _i = 0, _a = _this.subjectList; _i < _a.length; _i++) {
                var subject = _a[_i];
                _this.subjectListPerId[subject.subject_id] = subject.subject;
                _this.categoryListPerId[subject.subject_id] = subject.categories;
                _this.categoryListPerId[subject.subject_id].unshift({ category_id: 0, category: 'Sonstiges' });
            }
        });
        this.loadExam();
    }
    EditExamController.prototype.loadExam = function () {
        var _this = this;
        this.API.get("exams/" + this.examId).then(function (result) {
            _this.exam = result.data.exam;
            _this.questions = result.data.questions;
            for (var i = 0; i < _this.questions.length; i++) {
                if (_this.questions[i].question_id === _this.openQuestionId) {
                    _this.openQuestionIndex = i;
                    break;
                }
            }
            _this.remakeUploaderArray();
            if (_this.questions.length === 0) {
                _this.addQuestion(false);
            }
            _this.ready = true;
        });
    };
    EditExamController.prototype.remakeUploaderArray = function () {
        var _this = this;
        this.uploaderArray = [];
        for (var i = 0; i < this.questions.length; i++) {
            var uploader = new this.FileUploader({ url: '/api/v1/file/upload', formData: i });
            uploader.onSuccessItem = function (fileItem, response) {
                var index = fileItem.formData;
                _this.questions[index].question_image_url = response.upload_name;
            };
            this.uploaderArray.push(uploader);
        }
    };
    EditExamController.prototype.addQuestion = function (show) {
        var question = {
            category_id: 0,
            question: '',
            type: 5,
            correct_answer: 0,
            answers: ['', '', '', '', '', '']
        };
        this.questions.push(question);
        if (show) {
            this.openQuestionIndex = this.questions.length - 1;
        }
        this.remakeUploaderArray();
    };
    EditExamController.prototype.deleteQuestion = function (index) {
        var questionId = this.questions[index].question_id;
        if (questionId) {
            this.API["delete"]("questions/" + questionId);
        }
        this.questions.splice(index, 1);
        this.openQuestionIndex = Math.min(this.openQuestionIndex, this.questions.length - 1);
        this.remakeUploaderArray();
        if (!this.questions) {
            this.addQuestion(true);
        }
    };
    EditExamController.prototype.saveExam = function () {
        var validate = this.exam.subject_id
            && this.exam.semester > 0
            && this.exam.semester <= 50
            && this.exam.date;
        if (validate) {
            this.isSaving = true;
            this.API.put("exams/" + this.examId, this.exam).then(function (result) {
                if (!result.data.status) {
                    alert('Fehler beim Speichern der Klausur.');
                }
            });
            var _loop_1 = function (q) {
                var validateQuestion = q.question || q.question_id;
                if (validateQuestion) {
                    q.explanation = q.explanation || '';
                    q.question_image_url = q.question_image_url || '';
                    var data = {
                        exam_id: this_1.exam.exam_id,
                        user_id_added: this_1.user.user_id,
                        category_id: q.category_id,
                        question: q.question,
                        type: q.type,
                        answers: q.answers,
                        correct_answer: q.correct_answer,
                        explanation: q.explanation,
                        question_image_url: q.question_image_url
                    };
                    if (!q.question_id) {
                        this_1.API.post('questions', data).then(function (result) {
                            q.question_id = result.data.question_id;
                        });
                    }
                    else {
                        this_1.API.put("questions/" + q.question_id, data);
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
                var q = _a[_i];
                _loop_1(q);
            }
            this.hasChanged = false;
            this.numberChanged = 0;
            this.isSaving = false;
        }
        else {
            alert('Es fehlen noch allgemeine Infos zur Klausur.');
        }
    };
    EditExamController.prototype.deleteExamModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'deleteExamModalComponent',
            resolve: {
                examId: function () { return _this.examId; }
            }
        });
    };
    return EditExamController;
}());
angular.module('crucioApp').component('editexamcomponent', {
    templateUrl: 'app/author/edit-exam/edit-exam.html',
    controller: EditExamController
});
var DeleteOralExamModalController = (function () {
    DeleteOralExamModalController.$inject = ["API", "$location"];
    function DeleteOralExamModalController(API, $location) {
        this.API = API;
        this.$location = $location;
    }
    DeleteOralExamModalController.prototype.$onInit = function () {
        this.oralExamId = this.resolve.oralExamId;
    };
    DeleteOralExamModalController.prototype.deleteOralExam = function () {
        var _this = this;
        this.API["delete"]("oral_exams/" + this.oralExamId).then(function () {
            _this.close({ $value: 'ok' });
            _this.$location.url('/author/oral-exams');
        });
    };
    return DeleteOralExamModalController;
}());
angular.module('crucioApp').component('deleteOralExamModalComponent', {
    templateUrl: 'app/author/edit-oral-exam/delete-oral-exam-modal.html',
    controller: DeleteOralExamModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var EditOralExamController = (function () {
    EditOralExamController.$inject = ["Page", "Auth", "API", "FileUploader", "$scope", "$location", "$stateParams", "$uibModal"];
    function EditOralExamController(Page, Auth, API, FileUploader, $scope, $location, $stateParams, $uibModal) {
        var _this = this;
        this.API = API;
        this.FileUploader = FileUploader;
        this.$location = $location;
        this.$uibModal = $uibModal;
        Page.setTitleAndNav('Mündliche Prüfung | Crucio', 'Author');
        this.user = Auth.getUser();
        this.oralExamId = $stateParams.oralExamId;
        this.numberChanged = -1;
        this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
        this.uploader.onSuccessItem = function (fileItem, response) {
            _this.oralExam.filename = response.upload_name;
        };
        $scope.$watch(function () { return _this.oralExam; }, function () {
            _this.hasChanged = (_this.numberChanged > 0);
            _this.numberChanged += 1;
        }, true);
        $scope.$on('$locationChangeStart', function (event) {
            if (_this.hasChanged) {
                var confirmClose = confirm('Die Änderungen an der Prüfung bleiben dann ungespeichert. Wirklich verlassen?');
                if (!confirmClose) {
                    event.preventDefault();
                }
            }
        });
        this.loadOralExam();
    }
    EditOralExamController.prototype.loadOralExam = function () {
        var _this = this;
        this.API.get("oral_exams/" + this.oralExamId).then(function (result) {
            _this.oralExam = result.data.oral_exam;
            _this.ready = true;
        });
        this.ready = true;
    };
    EditOralExamController.prototype.saveOralExam = function () {
        var _this = this;
        var validate = this.oralExam.semester >= 0
            && this.oralExam.semester <= 1;
        if (validate) {
            this.isSaving = true;
            this.API.put("oral_exams/" + this.oralExamId, this.oralExam).then(function (result) {
                if (!result.data.status) {
                    alert('Fehler beim Speichern der Klausur.');
                }
                _this.hasChanged = false;
                _this.numberChanged = 0;
                _this.isSaving = false;
            });
        }
        else {
            alert('Es fehlen noch allgemeine Infos zur Klausur.');
        }
    };
    EditOralExamController.prototype.deleteOralExamModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'deleteOralExamModalComponent',
            resolve: {
                oralExamId: function () { return _this.oralExamId; }
            }
        });
    };
    return EditOralExamController;
}());
angular.module('crucioApp').component('editoralexamcomponent', {
    templateUrl: 'app/author/edit-oral-exam/edit-oral-exam.html',
    controller: EditOralExamController
});
var AuthorExamsController = (function () {
    AuthorExamsController.$inject = ["Auth", "API", "$location"];
    function AuthorExamsController(Auth, API, $location) {
        var _this = this;
        this.API = API;
        this.$location = $location;
        this.user = Auth.getUser();
        this.examSearch = { author: this.user };
        this.API.get('exams/distinct').then(function (result) {
            _this.distinctSemesters = result.data.semesters;
            _this.distinctAuthors = result.data.authors;
            _this.distinctSubjects = result.data.subjects;
        });
        this.API.get('subjects').then(function (result) {
            _this.subjectList = result.data.subjects;
        });
        this.loadExams();
    }
    AuthorExamsController.prototype.loadExams = function () {
        var _this = this;
        var data = {
            subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
            author_id: this.examSearch.author && this.examSearch.author.user_id,
            semester: this.examSearch.semester,
            query: this.examSearch.query,
            limit: 200,
            showEmpty: true
        };
        this.API.get('exams', data).then(function (result) {
            _this.exams = result.data.exams;
        });
    };
    AuthorExamsController.prototype.newExam = function () {
        var _this = this;
        var data = {
            subject_id: 1,
            user_id_added: this.user.user_id,
            sort: 'Erstklausur'
        };
        this.API.post('exams', data).then(function (result) {
            _this.$location.path('/edit-exam').search('examId', result.data.exam_id);
        });
    };
    return AuthorExamsController;
}());
angular.module('crucioApp').component('authorexamscomponent', {
    templateUrl: 'app/author/exams/exams.html',
    controller: AuthorExamsController
});
var AuthorOralExamsController = (function () {
    AuthorOralExamsController.$inject = ["Auth", "API", "$location"];
    function AuthorOralExamsController(Auth, API, $location) {
        var _this = this;
        this.API = API;
        this.$location = $location;
        this.user = Auth.getUser();
        this.oralExamSearch = {};
        this.API.get('oral_exams/distinct').then(function (result) {
            _this.distinctOralYears = result.data.years;
        });
        this.loadOralExams();
    }
    AuthorOralExamsController.prototype.loadOralExams = function () {
        var _this = this;
        var data = {
            semester: this.oralExamSearch.semester,
            year: this.oralExamSearch.year,
            query: this.oralExamSearch.query,
            limit: 200
        };
        this.API.get('oral_exams', data).then(function (result) {
            _this.oralExams = result.data.oral_exams;
        });
    };
    AuthorOralExamsController.prototype.newOralExam = function () {
        var _this = this;
        var data = {
            examiner_count: 3,
            semester: 0,
            year: 2016
        };
        this.API.post('oral_exams', data).then(function (result) {
            _this.$location.path('/edit-oral-exam').search('oralExamId', result.data.oral_exam_id);
        });
    };
    return AuthorOralExamsController;
}());
angular.module('crucioApp').component('authororalexamscomponent', {
    templateUrl: 'app/author/oral-exams/oral-exams.html',
    controller: AuthorOralExamsController
});
var AuthorSubjectsController = (function () {
    AuthorSubjectsController.$inject = ["API"];
    function AuthorSubjectsController(API) {
        var _this = this;
        this.API = API;
        this.API.get('subjects').then(function (result) {
            _this.subjectList = result.data.subjects;
        });
    }
    return AuthorSubjectsController;
}());
angular.module('crucioApp').component('authorsubjectscomponent', {
    templateUrl: 'app/author/subjects/subjects.html',
    controller: AuthorSubjectsController
});
var TimeagoController = (function () {
    function TimeagoController() {
    }
    TimeagoController.prototype.$onInit = function () {
        var strings = {
            prefixAgo: 'vor',
            prefixFromNow: 'in',
            suffixAgo: '',
            suffixFromNow: '',
            seconds: 'wenigen Sekunden',
            minute: 'etwa einer Minute',
            minutes: '%d Minuten',
            hour: 'etwa einer Stunde',
            hours: '%d Stunden',
            day: 'etwa einem Tag',
            days: '%d Tagen',
            month: 'etwa einem Monat',
            months: '%d Monaten',
            year: 'etwa einem Jahr',
            years: '%d Jahren',
            wordSeparator: ' ',
            numbers: []
        };
        var given = this.datetime;
        var current = new Date().getTime();
        var distanceMillis = Math.abs(current - given);
        var seconds = distanceMillis / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;
        var prefix = strings.prefixAgo;
        var suffix = strings.suffixAgo;
        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }
        function substitute(s, index) {
            var value = (strings.numbers && strings.numbers[index]) || index;
            return s.replace(/%d/i, value);
        }
        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }
        var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
            seconds < 90 && substitute(strings.minute, 1) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
            minutes < 90 && substitute(strings.hour, 1) ||
            hours < 24 && substitute(strings.hours, Math.round(hours)) ||
            hours < 42 && substitute(strings.day, 1) ||
            days < 30 && substitute(strings.days, Math.round(days)) ||
            days < 45 && substitute(strings.month, 1) ||
            days < 365 && substitute(strings.months, Math.round(days / 30)) ||
            years < 1.5 && substitute(strings.year, 1) ||
            substitute(strings.years, Math.round(years));
        this.result = trim([prefix, words, suffix].join(strings.wordSeparator));
    };
    return TimeagoController;
}());
angular.module('crucioApp').component('timeago', {
    template: '<span>{{ $ctrl.result }}</span>',
    controller: TimeagoController,
    bindings: {
        datetime: '<'
    }
});
var ImageModalController = (function () {
    ImageModalController.$inject = ["API"];
    function ImageModalController(API) {
        this.API = API;
    }
    ImageModalController.prototype.$onInit = function () {
        this.data = this.resolve.data;
    };
    return ImageModalController;
}());
angular.module('crucioApp').component('imageModalComponent', {
    templateUrl: 'app/components/image-modal/image-modal.html',
    controller: ImageModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var NavbarController = (function () {
    NavbarController.$inject = ["Auth", "Page"];
    function NavbarController(Auth, Page) {
        this.Page = Page;
        this.Auth = Auth;
        this.user = Auth.getUser();
    }
    NavbarController.prototype.logout = function () {
        this.Auth.logout();
    };
    return NavbarController;
}());
angular.module('crucioApp').component('navbar', {
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController
});
var QuestionModalController = (function () {
    QuestionModalController.$inject = ["API", "Auth", "$uibModal"];
    function QuestionModalController(API, Auth, $uibModal) {
        this.Auth = Auth;
        this.API = API;
        this.$uibModal = $uibModal;
        this.user = Auth.getUser();
        this.commentsCollapsed = Boolean(this.user.showComments);
        this.noAnswer = true;
        this.showExplanation = false;
    }
    QuestionModalController.prototype.$onInit = function () {
        this.question = this.resolve.question;
        this.questionId = this.resolve.questionId;
        this.loadQuestion();
    };
    QuestionModalController.prototype.loadQuestion = function () {
        var _this = this;
        this.API.get("questions/" + this.questionId + "/user/" + this.user.user_id).then(function (result) {
            _this.question = result.data.question;
            _this.comments = result.data.comments;
            _this.tags = [];
            if (result.data.tags) {
                _this.tags = result.data.tags.split(',').map(function (entry) { return { text: entry }; });
            }
            _this.checkedAnswer = _this.givenAnswer;
        });
    };
    QuestionModalController.prototype.updateTags = function ($tag) {
        var string = this.tags.map(function (entry) { return entry.text; }).join(',');
        var data = { tags: string, question_id: this.questionId, user_id: this.user.user_id };
        this.API.post('tags', data);
    };
    QuestionModalController.prototype.showSolution = function () {
        var correctAnswer = this.question.correct_answer;
        this.checkedAnswer = correctAnswer;
        var correct = (correctAnswer === this.givenAnswer) ? 1 : 0;
        if (correctAnswer === 0 || this.question.type === 1) {
            correct = -1;
        }
        var data = {
            correct: correct,
            question_id: this.questionId,
            user_id: this.user.user_id,
            given_result: this.givenAnswer
        };
        this.API.post('results', data);
        this.markAnswer(this.givenAnswer);
    };
    QuestionModalController.prototype.saveAnswer = function (givenAnswer) {
        this.givenAnswer = givenAnswer;
    };
    QuestionModalController.prototype.markAnswer = function (givenAnswer) {
        this.isAnswerGiven = true;
        var type = this.question.type;
        if (type > 1) {
            this.correctAnswer = this.question.correct_answer;
            this.checkedAnswer = givenAnswer > 0 ? givenAnswer : this.correctAnswer;
            this.isAnswerRight = (givenAnswer === this.correctAnswer);
            this.isAnswerWrong = (givenAnswer !== this.correctAnswer);
            if (givenAnswer !== this.correctAnswer) {
                this.wrongAnswer = givenAnswer;
            }
        }
    };
    QuestionModalController.prototype.addComment = function () {
        var _this = this;
        var now = +new Date() / 1000;
        var data = {
            comment: this.commentText,
            question_id: this.questionId,
            reply_to: 0,
            username: this.user.username,
            date: now
        };
        this.API.post("comments/" + this.user.user_id, data).then(function (result) {
            var newComment = __assign({}, data, { voting: 0, user_voting: 0, comment_id: result.data.comment_id });
            _this.comments.push(newComment);
            _this.commentText = '';
        });
    };
    QuestionModalController.prototype.deleteComment = function (index) {
        var commentId = this.comments[index].comment_id;
        this.API["delete"]("comments/" + commentId);
        this.comments.splice(index, 1);
    };
    QuestionModalController.prototype.changeUserVoting = function (comment, change) {
        comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
        var data = { user_voting: comment.user_voting };
        this.API.post("comments/" + comment.comment_id + "/user/" + this.user.user_id, data);
    };
    QuestionModalController.prototype.openImageModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'imageModalComponent',
            resolve: {
                data: function () { return _this.question.question_image_url; }
            }
        });
    };
    QuestionModalController.prototype.openReportModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'reportModalComponent',
            resolve: {
                questionId: function () { return _this.questionId; },
                question: function () { return _this.question; }
            }
        });
    };
    return QuestionModalController;
}());
angular.module('crucioApp').component('questionModalComponent', {
    templateUrl: 'app/components/question-modal/question-modal.html',
    controller: QuestionModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var ReportModalController = (function () {
    ReportModalController.$inject = ["API", "Auth", "$uibModal"];
    function ReportModalController(API, Auth, $uibModal) {
        this.Auth = Auth;
        this.API = API;
        this.$uibModal = $uibModal;
        this.user = Auth.getUser();
    }
    ReportModalController.prototype.$onInit = function () {
        this.questionId = this.resolve.questionId;
        this.question = this.resolve.question;
    };
    ReportModalController.prototype.reportQuestion = function () {
        var _this = this;
        var validation = this.message;
        if (validation) {
            var data = {
                text: this.message,
                name: this.user.username,
                email: this.user.email,
                question_id: this.questionId,
                author: this.question.username,
                question: this.question.question,
                exam_id: this.question.exam_id,
                subject: this.question.subject,
                date: this.question.date,
                author_email: this.question.email,
                mail_subject: 'Allgemein'
            };
            this.API.post('contact/send-mail-question', data).then(function () {
                _this.close({ $value: 'reported' });
            });
        }
    };
    return ReportModalController;
}());
angular.module('crucioApp').component('reportModalComponent', {
    templateUrl: 'app/components/report-modal/report-modal.html',
    controller: ReportModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var ErrorController = (function () {
    ErrorController.$inject = ["Page"];
    function ErrorController(Page) {
        Page.setTitleAndNav('Fehler | Crucio', '');
    }
    return ErrorController;
}());
angular.module('crucioApp').component('error403component', {
    templateUrl: 'app/error/403.html',
    controller: ErrorController
});
angular.module('crucioApp').component('error404component', {
    templateUrl: 'app/error/404.html',
    controller: ErrorController
});
angular.module('crucioApp').component('error500component', {
    templateUrl: 'app/error/500.html',
    controller: ErrorController
});
var HelpController = (function () {
    HelpController.$inject = ["Auth", "Page", "API"];
    function HelpController(Auth, Page, API) {
        this.API = API;
        Page.setTitleAndNav('Hilfe | Crucio', '');
        this.user = Auth.getUser();
    }
    HelpController.prototype.sendMail = function () {
        var _this = this;
        var validation = this.text;
        if (validation) {
            this.isWorking = true;
            var data = {
                text: this.text,
                name: this.user.username,
                email: this.user.email
            };
            this.API.post('contact/send-mail', data).then(function () {
                _this.isWorking = false;
                _this.emailSend = true;
            });
        }
    };
    return HelpController;
}());
angular.module('crucioApp').component('helpcomponent', {
    templateUrl: 'app/help/help.html',
    controller: HelpController
});
var LearnController = (function () {
    LearnController.$inject = ["Page"];
    function LearnController(Page) {
        Page.setTitleAndNav('Lernen | Crucio', 'Learn');
    }
    return LearnController;
}());
angular.module('crucioApp').component('learncomponent', {
    templateUrl: 'app/learn/learn.html',
    controller: LearnController
});
var AnalysisController = (function () {
    AnalysisController.$inject = ["Page", "Auth", "API", "Collection"];
    function AnalysisController(Page, Auth, API, Collection) {
        var _this = this;
        this.API = API;
        this.Collection = Collection;
        Page.setTitleAndNav('Analyse | Crucio', 'Learn');
        this.user = Auth.getUser();
        this.workedCollection = this.Collection.getWorked();
        this.count = this.Collection.analyseCount();
        this.Collection.getQuestions(this.Collection.getQuestionIds(this.workedCollection)).then(function (questions) {
            if (questions.length != _this.workedCollection.length) {
                alert('Analyse konnte nicht durchgeführt werden...');
            }
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                var questionData = _this.workedCollection[i];
                if (!questionData.mark_answer && question.type > 1) {
                    var correct = (question.correct_answer === questionData.given_result) ? 1 : 0;
                    if (question.correct_answer === 0) {
                        correct = -1;
                    }
                    var data = {
                        correct: correct,
                        given_result: questionData.given_result,
                        question_id: questionData.question_id,
                        user_id: _this.user.user_id
                    };
                    _this.API.post('results', data);
                }
            }
        });
        if (this.Collection.get().type == 'exam') {
            this.API.get("exams/" + Collection.get().exam_id).then(function (result) {
                _this.exam = result.data.exam;
            });
        }
    }
    AnalysisController.prototype.showCorrectAnswerClicked = function (index) {
        this.workedCollection[index].mark_answer = 1;
        var questionId = this.workedCollection[index].question_id;
        this.Collection.saveMarkAnswer(this.Collection.getIndexOfQuestion(questionId));
    };
    return AnalysisController;
}());
angular.module('crucioApp').component('analysiscomponent', {
    templateUrl: 'app/learn/analysis/analysis.html',
    controller: AnalysisController
});
var LearnCommentsController = (function () {
    LearnCommentsController.$inject = ["Auth", "API"];
    function LearnCommentsController(Auth, API) {
        this.API = API;
        this.user = Auth.getUser();
        this.commentSearch = {};
        this.loadComments();
    }
    LearnCommentsController.prototype.loadComments = function () {
        var _this = this;
        var data = {
            query: this.commentSearch.query,
            user_id: this.user.user_id
        };
        this.API.get('comments', data).then(function (result) {
            _this.comments = result.data.comments;
            _this.questionsByComment = {};
            for (var _i = 0, _a = _this.comments; _i < _a.length; _i++) {
                var c = _a[_i];
                _this.questionsByComment[c.question] = _this.questionsByComment[c.question] || [];
                _this.questionsByComment[c.question].push(c);
            }
        });
    };
    return LearnCommentsController;
}());
angular.module('crucioApp').component('learncommentscomponent', {
    templateUrl: 'app/learn/comments/comments.html',
    controller: LearnCommentsController
});
var ExamController = (function () {
    ExamController.$inject = ["Page", "Auth", "API", "Collection", "$state", "$uibModal", "$stateParams", "$timeout", "$document", "$window"];
    function ExamController(Page, Auth, API, Collection, $state, $uibModal, $stateParams, $timeout, $document, $window) {
        var _this = this;
        this.API = API;
        this.Collection = Collection;
        this.$state = $state;
        this.$document = $document;
        this.$uibModal = $uibModal;
        Page.setTitleAndNav('Klausur | Crucio', 'Learn');
        this.user = Auth.getUser();
        this.examId = $stateParams.examId;
        this.currentIndex = 0;
        $document.on('scroll', function () {
            var positionTop = $document.scrollTop();
            var isIdAbovePosition = function (i) {
                var question = angular.element($window.document.getElementById("id" + i));
                if (question.prop('offsetTop') > positionTop) {
                    $timeout(function () {
                        _this.currentIndex = Math.max(i - 1, 0);
                    }, 0);
                    return true;
                }
                return false;
            };
            for (var i = 0; i < _this.Collection.get().list.length; i++) {
                if (isIdAbovePosition(i)) {
                    break;
                }
            }
        });
        this.loadExam();
    }
    ExamController.prototype.loadExam = function () {
        var _this = this;
        this.API.get("exams/" + this.examId).then(function (result) {
            _this.exam = result.data.exam;
            _this.length = result.data.questions.length;
            _this.Collection.set({
                type: 'exam',
                exam_id: _this.examId,
                list: result.data.questions
            });
        });
    };
    ExamController.prototype.handExam = function () {
        this.$state.go('analysis');
    };
    ExamController.prototype.openImageModal = function (fileName) {
        this.$uibModal.open({
            component: 'imageModalComponent',
            resolve: {
                data: function () { return fileName; }
            }
        });
    };
    return ExamController;
}());
angular.module('crucioApp').component('examcomponent', {
    templateUrl: 'app/learn/exam/exam.html',
    controller: ExamController
});
var LearnExamsController = (function () {
    LearnExamsController.$inject = ["Auth", "API", "Collection", "$scope", "$state", "$timeout"];
    function LearnExamsController(Auth, API, Collection, $scope, $state, $timeout) {
        var _this = this;
        this.API = API;
        this.Collection = Collection;
        this.$state = $state;
        this.user = Auth.getUser();
        this.examSearch = { semester: this.user.semester };
        this.API.get('exams/distinct', { visibility: 1 }).then(function (result) {
            _this.distinctSemesters = result.data.semesters;
            _this.distinctSubjects = result.data.subjects;
        });
        this.loadExams();
    }
    LearnExamsController.prototype.loadExams = function () {
        var _this = this;
        var data = {
            user_id: this.user.user_id,
            semester: this.examSearch.semester,
            subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
            query: this.examSearch.query,
            visibility: 1
        };
        this.API.get('exams', data).then(function (result) {
            _this.exams = result.data.exams;
        });
    };
    LearnExamsController.prototype.learnExam = function (examId) {
        var _this = this;
        var data = { random: 0 };
        this.Collection.prepareExam(examId, data).then(function (result) {
            _this.$state.go('question', { questionId: result.list[0].question_id });
        });
    };
    LearnExamsController.prototype.learnExamView = function (examId) {
        this.$state.go('exam', { examId: examId });
    };
    LearnExamsController.prototype.resetExam = function (exam) {
        exam.answered_questions = 0;
        this.API["delete"]("results/" + this.user.user_id + "/" + exam.exam_id, true);
    };
    return LearnExamsController;
}());
angular.module('crucioApp').component('learnexamscomponent', {
    templateUrl: 'app/learn/exams/exams.html',
    controller: LearnExamsController
});
var LearnOralExamsController = (function () {
    LearnOralExamsController.$inject = ["Auth", "API", "$scope", "$location", "$timeout"];
    function LearnOralExamsController(Auth, API, $scope, $location, $timeout) {
        var _this = this;
        this.API = API;
        this.user = Auth.getUser();
        this.oralExamSearch = { semester: this.user.semester <= 4 ? 0 : 1 };
        this.API.get('oral_exams/distinct', { visibility: 1 }).then(function (result) {
            _this.distinctOralSemesters = result.data.semesters;
            _this.distinctOralYears = result.data.years;
        });
    }
    LearnOralExamsController.prototype.searchOralExams = function () {
        var _this = this;
        this.oralExams = [];
        this.hasSearched = false;
        if (this.oralExamSearch.query) {
            var data = {
                semester: this.oralExamSearch.semester,
                year: this.oralExamSearch.year,
                query: this.oralExamSearch.query,
                limit: 200
            };
            this.API.get('oral_exams', data).then(function (result) {
                _this.oralExams = result.data.oral_exams;
                _this.hasSearched = true;
            });
        }
    };
    return LearnOralExamsController;
}());
angular.module('crucioApp').component('learnoralexamscomponent', {
    templateUrl: 'app/learn/oral-exams/oral-exams.html',
    controller: LearnOralExamsController
});
var LearnOverviewController = (function () {
    LearnOverviewController.$inject = ["Auth", "API", "Collection", "$scope", "$state", "$timeout"];
    function LearnOverviewController(Auth, API, Collection, $scope, $state, $timeout) {
        var _this = this;
        this.API = API;
        this.Collection = Collection;
        this.$state = $state;
        this.user = Auth.getUser();
        this.API.get('exams/distinct', { visibility: 1 }).then(function (result) {
            _this.distinctSemesters = result.data.semesters;
            _this.distinctSubjects = result.data.subjects;
        });
        this.loadOverview();
    }
    LearnOverviewController.prototype.loadOverview = function () {
        var _this = this;
        var data = { limit: 12 };
        this.API.get("exams/abstract/" + this.user.user_id, data).then(function (result) {
            _this.abstractExams = result.data.exams;
            _this.ready = 1;
        });
    };
    LearnOverviewController.prototype.learnExam = function (examId) {
        var _this = this;
        var data = { random: 0 };
        this.Collection.prepareExam(examId, data).then(function (result) {
            _this.$state.go('question', { questionId: result.list[0].question_id });
        });
    };
    LearnOverviewController.prototype.learnExamView = function (examId) {
        this.$state.go('exam', { examId: examId });
    };
    LearnOverviewController.prototype.resetExam = function (exam) {
        exam.answered_questions = 0;
        this.API["delete"]("results/" + this.user.user_id + "/" + exam.exam_id, true);
    };
    return LearnOverviewController;
}());
angular.module('crucioApp').component('learnoverviewcomponent', {
    templateUrl: 'app/learn/overview/overview.html',
    controller: LearnOverviewController
});
var QuestionController = (function () {
    QuestionController.$inject = ["Auth", "Page", "API", "Collection", "$stateParams", "$window", "$uibModal"];
    function QuestionController(Auth, Page, API, Collection, $stateParams, $window, $uibModal) {
        this.Auth = Auth;
        this.API = API;
        this.Collection = Collection;
        this.$uibModal = $uibModal;
        Page.setTitleAndNav('Frage | Crucio', 'Learn');
        this.user = Auth.getUser();
        this.questionId = Number($stateParams.questionId);
        this.resetSession = Boolean($stateParams.resetSession);
        this.commentsCollapsed = Boolean(this.user.showComments);
        if (!this.questionId) {
            alert('Fehler: Konnte keine Frage finden.');
            $window.location.replace('/learn/overview');
        }
        this.noAnswer = true;
        this.showExplanation = false;
        if (this.resetSession) {
            this.Collection.remove();
        }
        else {
            this.index = this.Collection.getIndexOfQuestion(this.questionId);
            if (this.index > -1) {
                this.questionData = this.Collection.getQuestionData(this.index);
                this.length = this.Collection.get().list.length;
                this.preQuestionId = this.index > 0 ? this.Collection.getQuestionData(this.index - 1).question_id : this.questionId;
                this.postQuestionId = this.index < this.length - 1 ? this.Collection.getQuestionData(this.index + 1).question_id : this.questionId;
            }
        }
        this.loadQuestion();
    }
    QuestionController.prototype.loadQuestion = function () {
        var _this = this;
        this.API.get("questions/" + this.questionId + "/user/" + this.user.user_id).then(function (result) {
            _this.question = result.data.question;
            _this.comments = result.data.comments;
            _this.tags = [];
            if (result.data.tags) {
                _this.tags = result.data.tags.split(',').map(function (entry) { return { text: entry }; });
            }
            _this.checkedAnswer = _this.questionData.givenAnswer;
            if (_this.questionData.mark_answer) {
                _this.markAnswer(_this.questionData.givenAnswer);
            }
        });
    };
    QuestionController.prototype.updateTags = function ($tag) {
        var string = this.tags.map(function (entry) { return entry.text; }).join(',');
        var data = { tags: string, question_id: this.questionId, user_id: this.user.user_id };
        this.API.post('tags', data);
    };
    QuestionController.prototype.showSolution = function () {
        var correctAnswer = this.question.correct_answer;
        var correct = (correctAnswer === this.questionData.givenAnswer) ? 1 : 0;
        if (correctAnswer === 0 || this.question.type === 1) {
            correct = -1;
        }
        var data = {
            correct: correct,
            question_id: this.questionId,
            user_id: this.user.user_id,
            given_result: this.questionData.givenAnswer
        };
        this.API.post('results', data);
        this.Collection.saveMarkAnswer(this.index);
        this.markAnswer(this.questionData.givenAnswer);
    };
    QuestionController.prototype.saveAnswer = function (givenAnswer) {
        this.questionData.givenAnswer = givenAnswer;
        this.Collection.saveAnswer(this.index, givenAnswer);
    };
    QuestionController.prototype.markAnswer = function (givenAnswer) {
        this.isAnswerGiven = true;
        if (this.question.type > 1) {
            this.correctAnswer = this.question.correct_answer;
            this.checkedAnswer = givenAnswer > 0 ? givenAnswer : this.correctAnswer;
            this.isAnswerRight = (givenAnswer === this.correctAnswer);
            this.isAnswerWrong = (givenAnswer !== this.correctAnswer);
            if (givenAnswer !== this.correctAnswer) {
                this.wrongAnswer = givenAnswer;
            }
        }
    };
    QuestionController.prototype.saveStrike = function (strike) {
        this.Collection.saveStrike(this.index, strike);
    };
    QuestionController.prototype.addComment = function () {
        var _this = this;
        var now = +new Date() / 1000;
        var data = {
            comment: this.commentText,
            question_id: this.questionId,
            reply_to: 0,
            username: this.user.username,
            date: now
        };
        this.API.post("comments/" + this.user.user_id, data).then(function (result) {
            data['voting'] = 0;
            data['user_voting'] = 0;
            data['comment_id'] = result.data.comment_id;
            _this.comments.push(data);
            _this.commentText = '';
        });
    };
    QuestionController.prototype.deleteComment = function (index) {
        var commentId = this.comments[index].comment_id;
        this.API["delete"]("comments/" + commentId);
        this.comments.splice(index, 1);
    };
    QuestionController.prototype.changeUserVoting = function (comment, change) {
        comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
        var data = { user_voting: comment.user_voting };
        this.API.post("comments/" + comment.comment_id + "/user/" + this.user.user_id, data);
    };
    QuestionController.prototype.openImageModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'imageModalComponent',
            resolve: {
                data: function () { return _this.question.question_image_url; }
            }
        });
    };
    QuestionController.prototype.openReportModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'reportModalComponent',
            resolve: {
                question: function () { return _this.question; },
                questionId: function () { return _this.questionId; }
            }
        });
    };
    return QuestionController;
}());
angular.module('crucioApp').component('questioncomponent', {
    templateUrl: 'app/learn/question/question.html',
    controller: QuestionController
});
var LearnSearchController = (function () {
    LearnSearchController.$inject = ["Auth", "API"];
    function LearnSearchController(Auth, API) {
        var _this = this;
        this.API = API;
        this.user = Auth.getUser();
        this.questionSearch = { semester: this.user.semester };
        this.API.get('exams/distinct', { visibility: 1 }).then(function (result) {
            _this.distinctSemesters = result.data.semesters;
            _this.distinctSubjects = result.data.subjects;
        });
        this.limit = 100;
    }
    LearnSearchController.prototype.searchQuestion = function () {
        var _this = this;
        this.searchResults = [];
        this.hasSearched = false;
        if (this.questionSearch.query) {
            this.showSpinner = true;
            var data = {
                query: this.questionSearch.query,
                subject_id: this.questionSearch.subject && this.questionSearch.subject.subject_id,
                semester: this.questionSearch.semester,
                visibility: 1,
                limit: this.limit
            };
            this.API.get('questions', data).then(function (result) {
                _this.searchResults = result.data.result;
                _this.showSpinner = false;
                _this.hasSearched = true;
            });
        }
    };
    return LearnSearchController;
}());
angular.module('crucioApp').component('learnsearchcomponent', {
    templateUrl: 'app/learn/search/search.html',
    controller: LearnSearchController
});
var StatisticController = (function () {
    StatisticController.$inject = ["Auth", "Page"];
    function StatisticController(Auth, Page) {
        Page.setTitleAndNav('Statistik | Crucio', 'Learn');
        this.user = Auth.getUser();
    }
    return StatisticController;
}());
angular.module('crucioApp').component('statisticcomponent', {
    templateUrl: 'app/learn/statistic/statistic.html',
    controller: StatisticController
});
var LearnSubjectsController = (function () {
    LearnSubjectsController.$inject = ["Auth", "API", "Collection", "$scope", "$location", "$timeout"];
    function LearnSubjectsController(Auth, API, Collection, $scope, $location, $timeout) {
        var _this = this;
        this.API = API;
        this.Collection = Collection;
        this.$location = $location;
        this.user = Auth.getUser();
        this.selection = {};
        this.selectedQuestionNumber = 0;
        this.numberQuestionsInSelection = 0;
        this.sliderOptions = { floor: 0, ceil: this.numberQuestionsInSelection };
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        });
        this.API.get('exams/distinct', { visibility: 1 }).then(function (result) {
            _this.distinctSemesters = result.data.semesters;
            _this.distinctSubjects = result.data.subjects;
        });
        this.API.get('subjects', { has_questions: true }).then(function (result) {
            _this.subjectList = result.data.subjects;
        });
    }
    LearnSubjectsController.prototype.loadNumberQuestions = function () {
        var _this = this;
        var data = { selection: this.selection };
        this.API.get('questions/count', data).then(function (result) {
            _this.numberQuestionsInSelection = result.data.count;
            var sliderMax = Math.min(_this.numberQuestionsInSelection, 500);
            _this.sliderOptions = { floor: 0, ceil: sliderMax };
            if (!_this.selectedQuestionNumber) {
                _this.selectedQuestionNumber = 50;
            }
            _this.selectedQuestionNumber = Math.min(_this.selectedQuestionNumber, _this.numberQuestionsInSelection);
        });
    };
    LearnSubjectsController.prototype.learnSubjects = function () {
        var _this = this;
        var data = { selection: this.selection, limit: this.selectedQuestionNumber };
        this.Collection.prepareSubjects(data).then(function (result) {
            _this.$location.path('/question').search('questionId', result.list[0].question_id);
        });
    };
    return LearnSubjectsController;
}());
angular.module('crucioApp').component('learnsubjectscomponent', {
    templateUrl: 'app/learn/subjects/subjects.html',
    controller: LearnSubjectsController
});
var LearnTagsController = (function () {
    LearnTagsController.$inject = ["Auth", "API"];
    function LearnTagsController(Auth, API) {
        this.API = API;
        this.user = Auth.getUser();
        this.loadTags();
    }
    LearnTagsController.prototype.loadTags = function () {
        var _this = this;
        var data = { user_id: this.user.user_id };
        this.API.get('tags', data).then(function (result) {
            _this.tags = result.data.tags;
            _this.distinctTags = [];
            for (var _i = 0, _a = _this.tags; _i < _a.length; _i++) {
                var entry = _a[_i];
                for (var _b = 0, _c = entry.tags.split(','); _b < _c.length; _b++) {
                    var tagText = _c[_b];
                    if (!_this.distinctTags.includes(tagText)) {
                        _this.distinctTags.push(tagText);
                    }
                }
            }
            _this.questionsByTag = {};
            for (var _d = 0, _e = _this.distinctTags; _d < _e.length; _d++) {
                var distinctTag = _e[_d];
                _this.questionsByTag[distinctTag] = [];
                for (var _f = 0, _g = _this.tags; _f < _g.length; _f++) {
                    var entry = _g[_f];
                    for (var _h = 0, _j = entry.tags.split(','); _h < _j.length; _h++) {
                        var tagText = _j[_h];
                        if (distinctTag === tagText) {
                            _this.questionsByTag[distinctTag].push(entry);
                        }
                    }
                }
            }
        });
    };
    return LearnTagsController;
}());
angular.module('crucioApp').component('learntagscomponent', {
    templateUrl: 'app/learn/tags/tags.html',
    controller: LearnTagsController
});
var APIService = (function () {
    APIService.$inject = ["$http"];
    function APIService($http) {
        this.$http = $http;
        this.base = 'api/v1/';
    }
    APIService.prototype.sanitize = function (data) {
        data.email = data.email && data.email.replace('@', '(@)');
        return data;
    };
    APIService.prototype.get = function (path, data) {
        if (data === void 0) { data = {}; }
        return this.$http.get(this.base + path, { params: this.sanitize(data) });
    };
    APIService.prototype.post = function (path, data) {
        return this.$http.post(this.base + path, this.sanitize(data));
    };
    APIService.prototype.put = function (path, data) {
        return this.$http.put(this.base + path, this.sanitize(data));
    };
    APIService.prototype["delete"] = function (path, data) {
        if (data === void 0) { data = {}; }
        return this.$http["delete"](this.base + path, { params: this.sanitize(data) });
    };
    return APIService;
}());
angular.module('crucioApp').service('API', APIService);
var AuthService = (function () {
    AuthService.$inject = ["$cookies", "$window"];
    function AuthService($cookies, $window) {
        this.$window = $window;
        this.$cookies = $cookies;
    }
    AuthService.prototype.getUser = function () {
        this.tryGetUser();
        if (!this.user) {
            this.$window.location.replace('/');
        }
        return this.user;
    };
    AuthService.prototype.tryGetUser = function () {
        if (angular.isUndefined(this.user) && angular.isDefined(this.$cookies.getObject('CrucioUser'))) {
            this.setUser(this.$cookies.getObject('CrucioUser'));
        }
        return this.user;
    };
    AuthService.prototype.logout = function () {
        this.$cookies.remove('CrucioUser');
        this.$window.location.assign(this.$window.location.origin);
    };
    AuthService.prototype.setUser = function (newUser, saveNewCookie) {
        if (saveNewCookie === void 0) { saveNewCookie = false; }
        this.user = newUser;
        if (saveNewCookie || angular.isDefined(this.$cookies.getObject('CrucioUser'))) {
            var expires = new Date();
            expires.setDate(expires.getDate() + 21);
            this.$cookies.putObject('CrucioUser', this.user, { expires: expires });
        }
        if (!this.user.remember_me) {
            this.$cookies.remove('CrucioUser');
        }
    };
    return AuthService;
}());
angular.module('crucioApp').service('Auth', AuthService);
var CollectionService = (function () {
    CollectionService.$inject = ["API"];
    function CollectionService(API) {
        this.API = API;
    }
    CollectionService.prototype.get = function () {
        if (angular.isUndefined(this.collection)
            && angular.isDefined(sessionStorage.crucioCollection)) {
            this.set(angular.fromJson(sessionStorage.crucioCollection));
        }
        return this.collection;
    };
    CollectionService.prototype.set = function (collection) {
        this.collection = collection;
        sessionStorage.crucioCollection = angular.toJson(collection);
    };
    CollectionService.prototype.prepareExam = function (examId, data) {
        var _this = this;
        return this.API.get("exams/action/prepare/" + examId, data).then(function (result) {
            var collection = { type: 'exam', list: result.data.list, exam_id: examId };
            _this.set(collection);
            return collection;
        });
    };
    CollectionService.prototype.prepareSubjects = function (data) {
        var _this = this;
        return this.API.get('questions/prepare-subjects', data).then(function (result) {
            var collection = { type: 'subjects', list: result.data.list, selection: data.selection };
            _this.set(collection);
            return collection;
        });
    };
    CollectionService.prototype.prepareTag = function (tag) {
    };
    CollectionService.prototype.prepareQuery = function (query) {
    };
    CollectionService.prototype.remove = function () {
        delete this.collection;
        sessionStorage.removeItem('crucioCollection');
    };
    CollectionService.prototype.getWorked = function () {
        this.get();
        return this.collection.list.filter(function (e) { return e.given_result; });
    };
    CollectionService.prototype.getQuestions = function (list) {
        return this.API.get('questions/list', { list: JSON.stringify(list) }).then(function (result) {
            return result.data.list;
        });
    };
    CollectionService.prototype.analyseCount = function () {
        var workedCollection = this.getWorked();
        var result = {
            correct: 0,
            wrong: 0,
            seen: 0,
            solved: 0,
            free: 0,
            no_answer: 0,
            all: this.collection.list.length,
            worked: workedCollection.length
        };
        for (var _i = 0, workedCollection_1 = workedCollection; _i < workedCollection_1.length; _i++) {
            var q = workedCollection_1[_i];
            if (q.correct_answer === q.given_result && q.given_result > 0 && q.correct_answer > 0) {
                result.correct++;
            }
            if (q.correct_answer !== q.given_result && q.given_result > 0 && q.correct_answer > 0) {
                result.wrong++;
            }
            if (q.given_result > 0) {
                result.solved++;
            }
            if (q.given_result > -2) {
                result.seen++;
            }
            if (q.type === 1) {
                result.free++;
            }
            if (q.correct_answer === 0 && q.type !== 1) {
                result.no_answer++;
            }
        }
        return result;
    };
    CollectionService.prototype.saveAnswer = function (index, answer) {
        if (this.collection && Object.keys(this.collection).length) {
            this.collection.list[index].given_result = answer;
            this.set(this.collection);
        }
    };
    CollectionService.prototype.saveStrike = function (index, strike) {
        if (this.collection && Object.keys(this.collection).length) {
            this.collection.list[index].strike = strike;
            this.set(this.collection);
        }
    };
    CollectionService.prototype.saveMarkAnswer = function (index) {
        if (this.collection && Object.keys(this.collection).length) {
            this.collection.list[index].mark_answer = 1;
            this.set(this.collection);
        }
    };
    CollectionService.prototype.getIndexOfQuestion = function (questionId) {
        this.get();
        for (var i = 0; i < this.collection.list.length; i++) {
            if (this.collection.list[i].question_id === questionId) {
                return i;
            }
        }
        return -1;
    };
    CollectionService.prototype.getQuestionData = function (index) {
        this.get();
        return this.collection.list[index];
    };
    CollectionService.prototype.getQuestionIds = function (list) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            result.push(list[i].question_id);
        }
        return result;
    };
    CollectionService.prototype.isHalftime = function (index) {
        return (Math.abs(index + 1 - this.collection.list.length / 2) < 1) && (index > 3);
    };
    return CollectionService;
}());
angular.module('crucioApp').service('Collection', CollectionService);
var CutService = (function () {
    function CutService() {
    }
    CutService.prototype.cut = function (value, wordwise, max, tail) {
        if (!value) {
            return '';
        }
        var newMax = parseInt(max, 10);
        if (value.length <= newMax) {
            return value;
        }
        var newValue = value.substr(0, newMax);
        if (wordwise) {
            var lastspace = newValue.lastIndexOf(' ');
            if (lastspace !== -1) {
                newValue = newValue.substr(0, lastspace);
            }
        }
        return newValue + (tail || ' ?');
    };
    return CutService;
}());
angular.module('crucioApp').service('Cut', CutService);
var PageService = (function () {
    PageService.$inject = ["$window"];
    function PageService($window) {
        this.$window = $window;
    }
    PageService.prototype.setTitle = function (newTitle) {
        this.title = newTitle;
    };
    PageService.prototype.setNav = function (newNav) {
        this.nav = newNav;
    };
    PageService.prototype.setTitleAndNav = function (newTitle, newNav) {
        if (newNav === void 0) { newNav = ''; }
        this.title = newTitle;
        this.nav = newNav;
        this.$window.document.title = this.title;
    };
    return PageService;
}());
angular.module('crucioApp').service('Page', PageService);
var DeleteResultsModalController = (function () {
    DeleteResultsModalController.$inject = ["API"];
    function DeleteResultsModalController(API) {
        this.API = API;
    }
    DeleteResultsModalController.prototype.$onInit = function () {
        this.userId = this.resolve.userId;
    };
    DeleteResultsModalController.prototype.deleteAllResults = function () {
        this.API["delete"]("results/" + this.userId);
        this.close({ $value: 'ok' });
    };
    return DeleteResultsModalController;
}());
angular.module('crucioApp').component('deleteResultsModalComponent', {
    templateUrl: 'app/user/delete-results-modal.html',
    controller: DeleteResultsModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var DeleteTagsModalController = (function () {
    DeleteTagsModalController.$inject = ["API"];
    function DeleteTagsModalController(API) {
        this.API = API;
    }
    DeleteTagsModalController.prototype.$onInit = function () {
        this.userId = this.resolve.userId;
    };
    DeleteTagsModalController.prototype.deleteAllTags = function () {
        this.API["delete"]("tags/" + this.userId);
        this.close({ $value: 'ok' });
    };
    return DeleteTagsModalController;
}());
angular.module('crucioApp').component('deleteTagsModalComponent', {
    templateUrl: 'app/user/delete-tags-modal.html',
    controller: DeleteTagsModalController,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
});
var UserController = (function () {
    UserController.$inject = ["Page", "Auth", "API", "$scope", "$uibModal"];
    function UserController(Page, Auth, API, $scope, $uibModal) {
        this.API = API;
        this.Auth = Auth;
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        Page.setTitleAndNav('Account | Crucio', 'User');
        this.user = this.Auth.getUser();
    }
    UserController.prototype.formChanged = function () {
        this.isSaved = false;
        this.hasError = false;
        this.$scope.form.passwordc.$setValidity('confirm', this.newPassword === this.newPasswordC);
    };
    UserController.prototype.saveUser = function () {
        var _this = this;
        this.formChanged();
        this.isWorking = true;
        var data = {
            course_id: this.user.course_id,
            semester: this.user.semester,
            current_password: this.oldPassword,
            password: this.newPassword
        };
        this.API.put("users/" + this.user.user_id + "/account", data).then(function (result) {
            if (result.data.status) {
                _this.Auth.setUser(_this.user);
            }
            else {
                _this.user = _this.Auth.getUser();
                _this.hasError = true;
            }
            _this.isSaved = result.data.status;
            _this.wrongPassword = (result.data.error === 'error_incorrect_password');
            _this.isWorking = false;
        });
        var dataSettings = {
            highlightExams: this.user.highlightExams,
            showComments: this.user.showComments,
            repetitionValue: 50,
            useAnswers: this.user.useAnswers,
            useTags: this.user.useTags
        };
        this.API.put("users/" + this.user.user_id + "/settings", dataSettings).then(function (result) {
            if (result.data.status) {
                _this.Auth.setUser(_this.user);
            }
            else {
                _this.user = _this.Auth.getUser();
                _this.hasError = true;
            }
            _this.isSaved = result.data.status;
            _this.isWorking = false;
        });
    };
    UserController.prototype.deleteAllResultsModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'deleteResultsModalComponent',
            resolve: {
                userId: function () { return _this.user.user_id; }
            }
        });
    };
    UserController.prototype.deleteAllTagsModal = function () {
        var _this = this;
        this.$uibModal.open({
            component: 'deleteTagsModalComponent',
            resolve: {
                userId: function () { return _this.user.user_id; }
            }
        });
    };
    return UserController;
}());
angular.module('crucioApp').component('usercomponent', {
    templateUrl: 'app/user/user.html',
    controller: UserController
});
