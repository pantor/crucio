class RegisterController {
  constructor(Auth, API, $scope, $uibModal) {
    this.API = API;
    this.$scope = $scope;
    this.$uibModal = $uibModal;

    this.user = Auth.tryGetUser();
    this.semester = 1;
    this.course = 1;
  }

  formChanged() {
    const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    this.$scope.form.email.$setValidity('studserv', regex.test(this.mail));
    this.$scope.form.passwordc.$setValidity('confirm', this.password === this.passwordc);
  }

  register() {
    this.$scope.form.username.$setValidity('duplicate', true);
    this.$scope.form.email.$setValidity('duplicate', true);

    this.isWorking = true;

    const data = {
      username: this.username,
      email: this.mail.replace('@', '(@)'),
      semester: this.semester,
      course: this.course,
      password: this.password,
    };
    this.API.post('users', data, true).success(result => {
      if (result.status) {
        this.$uibModal.open({
          templateUrl: 'registerModalContent.html',
        });
      }

      this.isWorking = false;
      this.$scope.form.username.$setValidity('duplicate', result.error !== 'error_username_taken');
      this.$scope.form.email.$setValidity('duplicate', result.error !== 'error_email_taken');
    });
  }
}

angular.module('crucioApp').controller('RegisterController', RegisterController);
