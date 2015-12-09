class AccountController {
    constructor(Page, Auth, API, Validate, $scope) {
        this.API = API;
        this.Auth = Auth;
        this.Validate = Validate;

        Page.setTitleAndNav('Account | Crucio', 'Name');

        this.user = this.Auth.getUser();
        this.user.semester = Number(this.user.semester);

        this.old_password = '';
        this.wrong_password = false;

        this.submit_button_title = 'Speichern';

        $scope.$watch(() => this.user.email, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.submit_button_title = 'Speichern';
            }
        }, true);
        $scope.$watch(() => this.old_password, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.submit_button_title = 'Speichern';
                this.wrong_password = false;
            }
        }, true);
        $scope.$watch(() => this.new_password, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.submit_button_title = 'Speichern';
            }
        }, true);
        $scope.$watch(() => this.new_password_c, (newValue, oldValue) => {
            if (newValue != oldValue) {
                this.submit_button_title = 'Speichern';
            }
        }, true);
    }

    saveUser() {
        let validate = true;
        if (!this.Validate.email(this.user.email)) {
            validate = false;
        }
        if (this.user.semester < 1) {
            validate = false;
        }
        if (this.user.semester > 30) {
            validate = false;
        }

        // Assuming User Wants to Change Password
        if (this.old_password.length > 0) {
            if (this.new_password.length < 6) {
                validate = false;
            }
            if (this.new_password != this.new_password_c) {
                validate = false;
            }
        }

        if (validate) {
            this.submit_button_title = 'Speichern...';

            const data = {
                'email': this.user.email.replace('@', '(@)'),
                'course_id': this.user.course_id,
                'semester': this.user.semester,
                'current_password': this.old_password,
                'password': this.new_password,
            };

            this.API.put('users/' + this.user.user_id + '/account', data).success((result) => {
                if (result.status == 'success') {
                    this.Auth.setUser(this.user);
                    this.submit_button_title = 'Gespeichert';
                } else {
                    this.user = this.Auth.getUser();

                    if (result.status == 'error_incorrect_password') {
                        this.wrong_password = true;
                    }

                    this.submit_button_title = 'Speichern nicht möglich...';
                }
            });
        } else {
            this.submit_button_title = 'Speichern nicht möglich...';
        }
    }
}

angular.module('userModule').controller('AccountController', AccountController);
