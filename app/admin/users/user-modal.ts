import { app } from './../../crucio';

import APIService from './../../services/api.service';
import { DeleteUserModalComponent } from './delete-user-modal';

class UserModalController {
  private user: Crucio.User;
  private newGroupID: number;
  private resolve: any;
  private close: any;
  private dismiss: any;
  private distinctGroups: any;
  private distinctGroupsPerId: any;

  constructor(private readonly API: APIService, private readonly $uibModal: angular.ui.bootstrap.IModalService) {
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

  save(): void {
    this.user.group_id = this.newGroupID;
    this.user.group_name = this.distinctGroupsPerId[this.newGroupID];
    const data = { group_id: this.newGroupID };
    this.API.put(`users/${this.user.user_id}/group`, data);
    this.close({$value: 'save'});
  }

  deleteUserModal(index: number): void {
    const modal = this.$uibModal.open({
      component: DeleteUserModalComponent,
      resolve: {
        user: () => this.user,
      },
    });

    modal.result.then(response => {
      this.close({$value: response})
    });
  }
}

export const UserModalComponent = 'userModalComponent';
app.component(UserModalComponent, {
  templateUrl: 'app/admin/users/user-modal.html',
  controller: UserModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
