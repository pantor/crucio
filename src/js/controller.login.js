class LoginController {
    constructor(Auth, API, $scope, $document) {
        this.Auth = Auth;
        this.API = API;
        this.$document = $document;

        this.user = this.Auth.tryGetUser();

        this.email = '';
        this.remember_me = true;
        this.password = '';

        this.login_error = false;

        $scope.$watch(() => this.email, () => {
            this.login_error = false;
        }, true);
        $scope.$watch(() => this.password, () => {
            this.login_error = false;
        }, true);
    }

    login() {
        if (!this.email) {
            this.email = '';
        }

        const data = {
            email: this.email.replace('@', '(@)'),
            remember_me: this.remember_me,
            password: this.password,
        };

        this.API.post('users/action/login', data).success((result) => {
            console.log(result);
            if (result.login == 'success') {
                this.Auth.login(result.logged_in_user, this.remember_me);
            } else {
                this.login_error = true;
            }
        });
    }

    scrollToFeatures() {
        this.$document.scrollTopAnimated(1050, 600);
    }
}

angular.module('userModule').controller('LoginController', LoginController);
