import { app } from './../crucio';

import APIService from './../services/api.service';

class DeleteResultsModalController {
  userId: number;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(private readonly API: APIService) {

  }

  $onInit() {
    this.userId = this.resolve.userId;
  }

  deleteAllResults(): void {
    this.API.delete(`results/${this.userId}`);
    this.close({$value: 'ok'});
  }
}

export const DeleteResultsModalComponent = 'deleteResultsModalComponent';
app.component(DeleteResultsModalComponent, {
  templateUrl: 'app/user/delete-results-modal.html',
  controller: DeleteResultsModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
