class AdminController {
  API: API;
  $uibModal: any;
  activeTab: string;
  user: User;
  userSearch: any;
  commentSearch: any;
  whitelist: any;
  stats: any;
  distinctGroups: any;
  distinctSemesters: any;
  users: User[];
  comments: any;
  questionsByComment: any;
  newWhitelistEmail: string;

  constructor(Page, Auth, API, $uibModal) {
    this.API = API;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');
    this.activeTab = 'users';

    this.user = Auth.getUser();

    this.userSearch = {};
    this.commentSearch = {};

    this.API.get('whitelist').then(result => {
      this.whitelist = result.data.whitelist;
    });

    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });

    this.API.get('users/distinct').then(result => {
      this.distinctGroups = result.data.groups;
      this.distinctSemesters = result.data.semesters;
    });

    this.loadUsers();
    this.loadComments();
  }

  loadUsers() {
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

  loadComments() {
    const data = { query: this.commentSearch.query, limit: 50 };
    this.API.get('comments', data).then(result => {
      this.comments = result.data.comments;

      this.questionsByComment = [];
      for (const c of this.comments) {
        // found = this.questionsByComment.findIndex(e => { e[0].question == c.question });
        let found = -1;
        for (let i = 0; i < this.questionsByComment.length; i++) {
          if (this.questionsByComment[i][0].question === c.question) {
            found = i;
            break;
          }
        }

        if (found > -1) {
          this.questionsByComment[found].push(c);
        } else {
          this.questionsByComment.push([c]);
        }
      }
    });
  }

  addMail() {
    const email = this.newWhitelistEmail;
    if (email) {
      this.whitelist.push({ mail_address: email, username: '' });

      const data = { email };
      this.API.post('whitelist', data);
    }
  }

  removeMail(index) {
    const email = this.whitelist[index].mail_address;
    if (email) {
      this.whitelist.splice(index, 1);
      this.API.delete(`whitelist/${email}`);
    }
  }

  changeGroup(index) {
    const userId: number = this.users[index].user_id;
    let groupId: number = this.users[index].group_id;
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

  isToday(dateString, hourDiff = 0): boolean {
    const today: any = new Date();
    const diff: number = today - 1000 * 60 * 60 * hourDiff;
    const compareDate = new Date(diff);

    const date = new Date(dateString * 1000);
    return (compareDate.toDateString() === date.toDateString());
  }

  changeSemester(difference: number) {
    const data = { difference };
    this.API.put('users/change-semester', data).then(result => {
      alert(result.data.status);
    });
  }

  removeTestAccount() {
    this.API.delete('users/test-account').then(result => {
      alert(result.data.status);
    });
  }
}

angular.module('crucioApp').component('admincomponent', {
  templateUrl: 'views/admin.html',
  controller: AdminController,
});
