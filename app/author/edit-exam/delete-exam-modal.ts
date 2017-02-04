class DeleteExamModalController {
  readonly API: APIService;
  $location: any;
  examId: number;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: APIService, $location: angular.ILocationService) {
    this.API = API;
    this.$location = $location;
  }

  $onInit() {
      this.examId = this.resolve.examId;
  }

  deleteExam(): void {
    this.API.delete(`exams/${this.examId}`).then(() => {
      this.close({$value: 'ok'});
      this.$location.url('/author/exams');
    });
  }
}

angular.module('crucioApp').component('deleteExamModalComponent', {
  templateUrl: 'app/author/edit-exam/delete-exam-modal.html',
  controller: DeleteExamModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
