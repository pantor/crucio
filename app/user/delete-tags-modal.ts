import { app } from './../crucio';

import APIService from './../services/api.service';

class DeleteTagsModalController {
  userId: number;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(private readonly API: APIService) {

  }

  $onInit() {
    this.userId = this.resolve.userId;
  }

  deleteAllTags(): void {
    this.API.delete(`tags/${this.userId}`);
    this.close({$value: 'ok'});
  }
}

export const DeleteTagsModalComponent = 'deleteTagsModalComponent';
app.component(DeleteTagsModalComponent, {
  templateUrl: 'app/user/delete-tags-modal.html',
  controller: DeleteTagsModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
