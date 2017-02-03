class AdminUsersController {
  readonly API: API;
  $uibModal: angular.ui.bootstrap.IModalService;
  user: Crucio.User;
  userSearch: any;
  distinctGroups: any;
  distinctSemesters: any;
  distinctGroupsPerId: any;
  users: Crucio.User[];

  constructor(Auth: Auth, API: API, $uibModal: angular.ui.bootstrap.IModalService) {
    this.API = API;
    this.$uibModal = $uibModal;

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
    this.API.put(`users/${userId}/group`, data, true);
  }

  isToday(dateString: any, hourDiff: number = 0): boolean {
    const today: any = new Date();
    const diff: number = today - 1000 * 60 * 60 * hourDiff;
    const compareDate = new Date(diff);

    const date = new Date(dateString * 1000);
    return (compareDate.toDateString() === date.toDateString());
  }

  deleteUserModal(index: number): void {
    var modal = this.$uibModal.open({
      templateUrl: 'deleteUserModalContent.html',
      controller: 'deleteUserModalController',
      controllerAs: '$ctrl',
      resolve: {
        user: () => {
          return this.users[index];
        },
      },
    });

    modal.result.then(function () {
      this.users.splice(index, 1);
    }, function () {
    });
  }
}

angular.module('crucioApp').component('adminuserscomponent', {
  templateUrl: 'app/admin/users/users.html',
  controller: AdminUsersController,
});
