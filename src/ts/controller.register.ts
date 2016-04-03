class RegisterController {
  API: API;
  $scope: any;
  $uibModal: any;
  user: User;
  semester: number;
  course: number;
  isWorking: boolean;
  username: string;
  email: string;
  password: string;
  passwordc: string;

  constructor(Auth: Auth, API: API, $scope, $uibModal) {
    this.API = API;
    this.$scope = $scope;
    this.$uibModal = $uibModal;

    this.user = Auth.tryGetUser();
    this.semester = 1;
    this.course = 1;
  }

  formChanged() {
    const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    this.$scope.form.email.$setValidity('studserv', regex.test(this.email));
    this.$scope.form.passwordc.$setValidity('confirm', this.password === this.passwordc);
  }

  register() {
    this.$scope.form.username.$setValidity('duplicate', true);
    this.$scope.form.email.$setValidity('duplicate', true);

    this.isWorking = true;

    const data = {
      username: this.username,
      email: this.email,
      semester: this.semester,
      course: this.course,
      password: this.password,
    };
    this.API.post('users', data, true).then(r => {
      if (r.data.status) {
        this.$uibModal.open({
          templateUrl: 'registerModalContent.html',
        });
      }

      this.isWorking = false;
      this.$scope.form.username.$setValidity('duplicate', r.data.error !== 'error_username_taken');
      this.$scope.form.email.$setValidity('duplicate', r.data.error !== 'error_email_taken');
    });
  }
}

angular.module('crucioApp').controller('RegisterController', RegisterController);
