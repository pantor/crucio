class RegisterController {
    constructor(Auth, API, Validate, $scope, $uibModal) {
        this.Auth = Auth;
        this.API = API;
        this.Validate = Validate;
        this.$uibModal = $uibModal;

        this.user = Auth.tryGetUser();

        this.is_working = 0;
        this.semester = 1;
        this.course = 1;

        $scope.$watch(() => this.username, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.error_no_name = !this.Validate.nonEmpty(newValue);
                this.error_duplicate_name = 0;
            }
        }, true);
        $scope.$watch(() => this.email, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.error_no_email = !this.Validate.email(newValue);
                this.error_duplicate_email = 0;
            }
        }, true);
        $scope.$watch(() => this.password, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.error_no_password = !this.Validate.password(newValue);
            }
        }, true);
    }

    register() {
        this.error_duplicate_name = 0;
        this.error_duplicate_email = 0;

        let validationPassed = 1;
        if (!this.username) {
            validationPassed = 0;
            this.error_no_name = 1;
        }
        if (!this.Validate.email(this.email)) {
            validationPassed = 0;
            this.error_no_email = 1;
        }
        if (!this.Validate.password(this.password)) {
            validationPassed = 0;
            this.error_no_password = 1;
        }
        if (this.password != this.passwordc) {
            validationPassed = 0;
        }

        if (validationPassed) {
            this.is_working = 1;

            const data = {
                'username': this.username,
                'email': this.email.replace('@', '(@)'),
                'semester': this.semester,
                'course': this.course,
                'password': this.password,
            };

            this.API.post('users', data).success((result) => {
                this.is_working = 0;

                if (result.status == 'success') {
                    this.$uibModal.open({
                        templateUrl: 'registerModalContent.html',
                    });
                } else if (result.status == 'error_username_taken') {
                    this.error_duplicate_name = 1;
                } else if (result.status == 'error_email_taken') {
                    this.error_duplicate_email = 1;
                }
            });
        }
    }
}

angular.module('userModule').controller('RegisterController', RegisterController);
