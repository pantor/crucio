class ForgotPasswordController {
  API: API;
  $scope: any;
  $uibModal: any;
  confirm: any;
  deny: any;
  reset: any;
  status: any;
  email: string;
  isWorking: boolean;

  constructor(API, $location, $scope, $uibModal) {
    this.API = API;
    this.$scope = $scope;
    this.$uibModal = $uibModal;

    this.confirm = $location.search().confirm;
    this.deny = $location.search().deny;

    this.reset = (!this.confirm && !this.deny);

    if (this.confirm) {
      this.reset = false;

      const data = { token: this.confirm };
      this.API.put('users/password/confirm', data).then(result => {
        this.status = result.data.status;
        this.$uibModal.open({
          templateUrl: 'forgotConfirmModalContent.html',
          controller: 'ModalInstanceController',
          controllerAs: 'ctrl',
          resolve: {
            data: () => {
              return this.status;
            },
          },
        });
      });
    }

    if (this.deny) {
      this.reset = false;

      const data = { token: this.deny };
      API.put('users/password/deny', data).then(result => {
        this.status = result.data.status;
        this.$uibModal.open({
          templateUrl: 'forgotDenyModalContent.html',
          controller: 'ModalInstanceController',
          controllerAs: 'ctrl',
          resolve: {
            data: () => {
              return this.status;
            },
          },
        });
      });
    }
  }

  resetPassword() {
    this.$scope.form.email.$setValidity('already', true);
    this.isWorking = true;

    const data = { email: this.email };
    this.API.put('users/password/reset', data).then(r => {
      if (r.data.status) {
        this.$uibModal.open({
          templateUrl: 'forgotSucessModalContent.html',
        });
      }

      this.$scope.form.email.$setValidity('already', r.data.error !== 'error_already_requested');
      this.isWorking = true;
    });
  }
}

angular.module('crucioApp').controller('ForgotPasswordController', ForgotPasswordController);
