class DeleteUserModalController {
  API: API;
  user: User;
  $uibModalInstance: any;

  constructor(API, user, $uibModalInstance) {
    this.API = API;
    this.user = user;
    this.$uibModalInstance = $uibModalInstance;
  }

  deleteUser(): void {
    this.API.delete(`users/${this.user.user_id}`);
    this.$uibModalInstance.close();
  }
}

angular.module('crucioApp').controller('deleteUserModalController', DeleteUserModalController);
