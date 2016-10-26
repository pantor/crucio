class DeleteTagsModalController {
  API: API;
  userId: number;
  $uibModalInstance: any;

  constructor(API, userId, $uibModalInstance) {
    this.API = API;
    this.userId = userId;
    this.$uibModalInstance = $uibModalInstance;
  }

  deleteAllTags(): void {
    this.API.delete(`tags/${this.userId}`);
    this.$uibModalInstance.close();
  }
}

angular.module('crucioApp').controller('deleteTagsModalController', DeleteTagsModalController);
