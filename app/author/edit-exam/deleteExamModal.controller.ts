class DeleteExamModalController {
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

  deleteExam(): void {
    this.API.delete(`exams/${this.examId}`).then(() => {
      this.$uibModalInstance.close();
      this.$location.url('/author');
    });

  }
}

angular.module('crucioApp').controller('deleteExamModalController', DeleteExamModalController);
