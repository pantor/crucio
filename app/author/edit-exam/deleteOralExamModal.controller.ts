class DeleteOralExamModalController {
  API: API;
  examId: number;
  $uibModalInstance: any;
  $location: any;

  constructor(API, examId, $location, $uibModalInstance) {
    this.API = API;
    this.examId = examId;
    this.$location = $location;
    this.$uibModalInstance = $uibModalInstance;
  }

  deleteOralExam(): void {
    this.API.delete(`oral_exams/${this.examId}`).then(() => {
      this.$uibModalInstance.close();
      this.$location.url('/author');
    });

  }
}

angular.module('crucioApp').controller('deleteOralExamModalController', DeleteOralExamModalController);
