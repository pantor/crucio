class DeleteOralExamModalController {
  API: API;
  oralExamId: number;
  $uibModalInstance: any;
  $location: angular.ILocationService;

  constructor(API: API, oralExamId: number, $location: angular.ILocationService, $uibModalInstance) {
    this.API = API;
    this.oralExamId = oralExamId;
    this.$location = $location;
    this.$uibModalInstance = $uibModalInstance;
  }

  deleteOralExam(): void {
    this.API.delete(`oral_exams/${this.oralExamId}`).then(() => {
      this.$uibModalInstance.close();
      this.$location.url('/author/oral-exams');
    });

  }
}

angular.module('crucioApp').controller('deleteOralExamModalController', DeleteOralExamModalController);
