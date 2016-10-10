class DeleteOralExamModalController {
  API: API;
  oralExamId: number;
  $uibModalInstance: any;
  $location: any;

  constructor(API, oralExamId, $location, $uibModalInstance) {
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
