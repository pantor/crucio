class DeleteOralExamModalController {
  private oralExamId: number;
  private resolve: any;
  private close: any;
  private dismiss: any;

  constructor(private readonly API: APIService, private readonly $location: angular.ILocationService) {

  }

  $onInit() {
    this.oralExamId = this.resolve.oralExamId;
  }

  deleteOralExam(): void {
    this.API.delete(`oral_exams/${this.oralExamId}`).then(() => {
      this.close({$value: 'ok'});
      this.$location.url('/author/oral-exams');
    });
  }
}

angular.module('crucioApp').component('deleteOralExamModalComponent', {
  templateUrl: 'app/author/edit-oral-exam/delete-oral-exam-modal.html',
  controller: DeleteOralExamModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
