class DeleteOralExamModalController {
  readonly API: APIService;
  readonly $location: any;
  oralExamId: number;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: APIService, $location: angular.ILocationService) {
    this.API = API;
    this.$location = $location;
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
