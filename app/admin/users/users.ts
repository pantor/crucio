import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

import { DeleteUserModalComponent } from './delete-user-modal';
import { UserModalComponent } from './user-modal';

class AdminUsersController {
  private readonly user: Crucio.User;
  private userSearch: any;
  private distinctGroups: any;
  private distinctSemesters: any;
  private distinctGroupsPerId: any;
  private users: Crucio.User[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly $uibModal: angular.ui.bootstrap.IModalService) {
    this.user = Auth.getUser();

    this.userSearch = {};

    this.API.get('users/distinct').then(result => {
      this.distinctGroups = result.data.groups;
      this.distinctSemesters = result.data.semesters;
      this.distinctGroupsPerId = {};
      for (let e of this.distinctGroups) {
        this.distinctGroupsPerId[e.group_id] = e.name;
      }
    });

    this.loadUsers();
  }

  loadUsers(): void {
    const data = {
      semester: this.userSearch.semester,
      group_id: this.userSearch.group,
      query: this.userSearch.query,
      limit: 100,
    };
    this.API.get('users', data).then(result => {
      this.users = result.data.users;
    });
  }

  changeGroup(index: number): void {
    const userId = this.users[index].user_id;
    let groupId = this.users[index].group_id;
    groupId = (groupId % this.distinctGroups.length) + 1;

    this.users[index].group_id = groupId;
    // this.users[index].group_name = this.dg.find(e => { e.group_id == groupId }).name;
    for (const e of this.distinctGroups) {
      if (e.group_id === groupId) {
        this.users[index].group_name = e.name;
        break;
      }
    }

    const data = { group_id: groupId };
    this.API.put(`users/${userId}/group`, data);
  }

  isToday(dateString: any, hourDiff: number = 0): boolean {
    const today: any = new Date();
    const diff: number = today - 1000 * 60 * 60 * hourDiff;
    const compareDate = new Date(diff);

    const date = new Date(dateString * 1000);
    return (compareDate.toDateString() === date.toDateString());
  }

  userModal(index: number): void {
    this.$uibModal.open({
      component: UserModalComponent,
      resolve: {
        user: () => this.users[index],
      },
    });
  }

  deleteUserModal(index: number): void {
    const modal = this.$uibModal.open({
      component: DeleteUserModalComponent,
      resolve: {
        user: () => this.users[index],
      },
    });

    modal.result.then(response => {
      console.log(response);
      if (response == 'delete') {
        this.users.splice(index, 1);
      }
    });
  }
}

export const AdminUsersComponent = 'adminusersComponent';
app.component(AdminUsersComponent, {
  templateUrl: 'app/admin/users/users.html',
  controller: AdminUsersController,
});
