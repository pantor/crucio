class DeleteExamModalController {
  private examId: number;
  private resolve: any;
  private close: any;
  private dismiss: any;

  constructor(private readonly API: APIService, private readonly $location: angular.ILocationService) {
    
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
