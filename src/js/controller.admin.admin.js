class AdminController {
  constructor(Page, Auth, API, $uibModal) {
    this.API = API;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');
    this.activeTab = 'users';

    this.user = Auth.getUser();

    this.user_search = {};
    this.comment_search = {};

    this.API.get('whitelist').success(result => {
      this.whitelist = result.whitelist;
    });

    this.API.get('stats/summary').success(result => {
      this.stats = result.stats;
    });

    this.API.get('users/distinct').success(result => {
      this.distinct_groups = result.groups;
      this.distinct_semesters = result.semesters;
    });

    this.loadUsers();
    this.loadComments();
  }

  loadUsers() {
    const data = {
      semester: this.user_search.semester,
      group_id: this.user_search.group,
      query: this.user_search.query,
      limit: 100,
    };
    this.API.get('users', data).success(result => {
      this.users = result.users;
    });
  }

  loadComments() {
    const data = { query: this.comment_search.query, limit: 50 };
    this.API.get('comments', data).success(result => {
      this.comments = result.comments;

      this.questions_by_comment = [];
      for (const c of this.comments) {
        // found = this.questions_by_comment.findIndex(e => { e[0].question == c.question });
        let found = -1;
        for (let i = 0; i < this.questions_by_comment.length; i++) {
          if (this.questions_by_comment[i][0].question === c.question) {
            found = i;
            break;
          }
        }

        if (found > -1) {
          this.questions_by_comment[found].push(c);
        } else {
          this.questions_by_comment.push([c]);
        }
      }
      this.questions_by_comment_display = this.questions_by_comment;
    });
  }

  addMail() {
    const mail = this.new_whitelist_mail;
    if (mail) {
      this.whitelist.push({ username: '', mail_address: mail });

      const data = { mail_address: mail.replace('@', '(@)') };
      this.API.post('whitelist', data);
    }
  }

  removeMail(index) {
    const mail = this.whitelist[index].mail_address;
    if (mail) {
      this.whitelist.splice(index, 1);
      this.API.delete('whitelist/' + mail);
    }
  }

  changeGroup(index) {
    const userId = this.users[index].user_id;
    let groupId = this.users[index].group_id;
    groupId = (groupId % this.distinct_groups.length) + 1;

    this.users[index].group_id = groupId;
    // this.users[index].group_name = this.distinct_groups.find(e => { e.group_id == groupId }).name;
    for (const e of this.distinct_groups) {
      if (e.group_id === groupId) {
        this.users[index].group_name = e.name;
        break;
      }
    }

    const data = { group_id: groupId };
    this.API.put('users/' + userId + '/group', data, true);
  }

  isToday(dateString, hourDiff = 0) {
    const today = new Date();
    const diff = today - 1000 * 60 * 60 * hourDiff;
    const compareDate = new Date(diff);

    const date = new Date(dateString * 1000);
    return (compareDate.toDateString() === date.toDateString());
  }

  changeSemester(number) {
    const data = { number };
    this.API.put('users/change-semester', data).success(result => {
      alert(result.status);
    });
  }

  removeTestAccount() {
    this.API.delete('users/test-account').success(result => {
      alert(result.status);
    });
  }
}

angular.module('crucioApp').controller('AdminController', AdminController);
