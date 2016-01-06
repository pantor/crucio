class ForgotPasswordController {
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
      this.API.put('users/password/confirm', data).success(result => {
        this.status = result.status;
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
      API.put('users/password/deny', data).success(result => {
        this.status = result.status;
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

    const data = { email: this.email.replace('@', '(@)') };
    this.API.put('users/password/reset', data).success(result => {
      if (result.status) {
        this.$uibModal.open({
          templateUrl: 'forgotSucessModalContent.html',
        });
      }

      this.$scope.form.email.$setValidity('already', result.error !== 'error_already_requested');
      this.isWorking = true;
    });
  }
}

angular.module('crucioApp').controller('ForgotPasswordController', ForgotPasswordController);
