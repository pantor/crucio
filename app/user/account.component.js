var AccountController = (function () {
    function AccountController(Page, Auth, API, $scope) {
        this.API = API;
        this.Auth = Auth;
        this.$scope = $scope;
        Page.setTitleAndNav('Account | Crucio', 'Name');
        this.user = this.Auth.getUser();
    }
    AccountController.prototype.formChanged = function () {
        this.$scope.form.passwordc.$setValidity('confirm', this.newPassword === this.newPasswordC);
    };
    AccountController.prototype.saveUser = function () {
        var _this = this;
        this.isSaved = false;
        this.hasError = false;
        this.isWorking = true;
        var data = {
            email: this.user.email,
            course_id: this.user.course_id,
            semester: this.user.semester,
            current_password: this.oldPassword,
            password: this.newPassword,
        };
        this.API.put("users/" + this.user.user_id + "/account", data, true).then(function (result) {
            console.log(result);
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
    };
    return AccountController;
}());
angular.module('crucioApp').component('accountcomponent', {
    templateUrl: 'app/user/account.html',
    controller: AccountController,
});
