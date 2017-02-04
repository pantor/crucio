class DeleteUserModalController {
  readonly API: APIService;
  user: Crucio.User;
  resolve: any;
  close: any;
  dismiss: any;

  constructor(API: APIService) {
    this.API = API;
  }

  $onInit() {
    this.user = this.resolve.user;
  }

  deleteUser(): void {
    this.API.delete(`users/${this.user.user_id}`);
    this.close({$value: 'delete'});
  }
}

angular.module('crucioApp').component('deleteUserModalComponent', {
  templateUrl: 'app/admin/users/delete-user-modal.html',
  controller: DeleteUserModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
