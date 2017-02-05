class UserModalController {
  readonly API: APIService;
  user: Crucio.User;
  newGroupID: number;
  resolve: any;
  close: any;
  dismiss: any;
  distinctGroups: any;
  distinctGroupsPerId: any;

  constructor(API: APIService) {
    this.API = API;

    this.API.get('users/distinct').then(result => {
      this.distinctGroups = result.data.groups;
      this.distinctGroupsPerId = {};
      for (let e of this.distinctGroups) {
        this.distinctGroupsPerId[e.group_id] = e.name;
      }
    });
  }

  $onInit() {
    this.user = this.resolve.user;
    this.newGroupID = this.user.group_id;
  }

  deleteUser(): void {
    this.API.delete(`users/${this.user.user_id}`);
    this.close({$value: 'delete'});
  }

  save(): void {
    this.user.group_id = this.newGroupID;
    const data = { group_id: this.newGroupID };
    this.API.put(`users/${this.user.user_id}/group`, data);
    this.close({$value: 'save'});
  }
}

angular.module('crucioApp').component('userModalComponent', {
  templateUrl: 'app/admin/users/user-modal.html',
  controller: UserModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
