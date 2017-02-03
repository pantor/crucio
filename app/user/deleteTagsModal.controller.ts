class DeleteTagsModalController {
  readonly API: API;
  userId: number;
  $uibModalInstance: any;

  constructor(API: API, userId: number, $uibModalInstance) {
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
