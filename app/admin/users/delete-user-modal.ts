class DeleteUserModalController {
  private user: Crucio.User;
  private resolve: any;
  private close: any;
  private dismiss: any;

  constructor(private readonly API: APIService) {

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
