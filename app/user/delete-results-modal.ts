class DeleteResultsModalController {
  API: API;
  userId: number;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: API) {
    this.API = API;
  }

  $onInit() {
    this.userId = this.resolve.userId;
  }

  deleteAllResults(): void {
    this.API.delete(`results/${this.userId}`);
    this.close({$value: 'ok'});
  }
}

angular.module('crucioApp').component('deleteResultsModalComponent', {
  templateUrl: 'app/user/delete-results-modal.html',
  controller: DeleteResultsModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});