class ForgotPasswordController {
    constructor(Auth, API, $location, $scope) {
        this.API = API;

        this.user = Auth.tryGetUser();

        if (angular.isUndefined(this.user)) {
            this.user = { 'email': '' };
        }

        this.confirm = $location.search().confirm;
        this.deny = $location.search().deny;

        this.is_working = 0;

        this.error_email = 0;
        this.error_already_requested = 0;

        if (!this.confirm && !this.deny) {
            this.reset = 1;
        }

        if (this.confirm) {
            this.reset = 0;

            const data = { 'token': this.confirm };
            this.API.post('users/password/confirm', data).success((result) => {
                this.status = result.status;
                $('#forgotConfirmModal').modal('show');
            });
        }

        if (this.deny) {
            this.reset = 0;

            const data = { 'token': this.deny };
            API.post('users/password/deny', data).success((result) => {
                this.status = result.status;
                $('#forgotDenyModal').modal('show');
            });
        }

        $scope.$watch(() => this.user.email, () => {
            this.error_email = 0;
            this.error_already_requested = 0;
        }, true);
    }

    reset_password() {
        let validate = true;
        if (!this.user) {
            validate = false;
            this.error_email = 1;
        } else if (!this.user.email) {
            validate = false;
            this.error_email = 1;
        }

        if (validate) {
            this.is_working = 1;

            const data = { 'email': this.user.email.replace('@', '(@)') };
            this.API.post('users/password/reset', data).success((result) => {
                this.is_working = 0;

                if (!result) {
                    this.error_email = 1;
                } else {
                    if (result.status == 'success') {
                        this.error_email = 0;
                        this.error_already_requested = 0;
                        $('#forgotSucessModal').modal('show');
                    } else if (result.status == 'error_email') {
                        this.error_email = 1;
                    } else if (result.status == 'error_already_requested') {
                        this.error_already_requested = 1;
                    }
                }
            });
        }
    }
}

angular.module('userModule').controller('ForgotPasswordController', ForgotPasswordController);
