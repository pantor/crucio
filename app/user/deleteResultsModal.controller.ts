class DeleteResultsModalController {
  API: API;
  userId: number;
  $uibModalInstance: any;

  constructor(API, userId, $uibModalInstance) {
    this.API = API;
    this.userId = userId;
    this.$uibModalInstance = $uibModalInstance;
  }

  deleteAllResults(): void {
    this.API.delete(`results/${this.userId}`);
    this.$uibModalInstance.close();
  }
}

angular.module('crucioApp').controller('deleteResultsModalController', DeleteResultsModalController);
