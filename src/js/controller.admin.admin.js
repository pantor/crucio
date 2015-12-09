class AdminController {
    constructor(Page, Auth, API, Selection, $scope, $uibModal) {
        this.API = API;
        this.Selection = Selection;
        this.$uibModal = $uibModal;

        Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');

        this.user = Auth.getUser();

        this.user_search = { 'semester': '', 'group': '', 'login': '', 'query': '', 'query_keys': ['group_name', 'username'] };
        this.comment_search = { 'question_id': '', 'username': '', 'query': '', 'query_keys': ['question', 'comment', 'username', 'question_id'] };

        this.update_activity = false;
        this.show_activity = { search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true };


        $scope.$watch(() => this.comment_search, (newValue) => {
            this.questions_by_comment_display = [];
            if (this.questions_by_comment) {
                for (const comments of this.questions_by_comment) {
                    for (const comment of comments) {
                        if (this.Selection.isElementIncluded(comment, newValue)) { // Check if comment satisfies search query
                            let foundIdx = -1;
                            for (let j = 0; j < this.questions_by_comment_display.length; j++) {
                                if (this.questions_by_comment_display[j][0].question == comment.question) {
                                    foundIdx = j;
                                    break;
                                }
                            }

                            if (foundIdx > -1) { // Add to array at found index
                                this.questions_by_comment_display[foundIdx].push(comment);
                            } else { // Create new array
                                this.questions_by_comment_display.push([comment]);
                            }
                        }
                    }
                }
            }
            this.questions_by_comment_display.sort((a, b) => { return b[0].date - a[0].date; });
        }, true);

        this.API.get('users').success((result) => {
            this.users = result.users;
            this.distinct_semesters = this.Selection.findDistinct(this.users, 'semester');
            this.distinct_semesters.sort((a, b) => { return a - b; });
            this.distinct_groups = ['Standard', 'Admin', 'Autor'];

            this.ready = 1;
        });

        this.API.get('comments').success((result) => {
            this.comments = result.comments;
            this.distinct_questions = this.Selection.findDistinct(this.comments, 'question_id');
            this.distinct_users = this.Selection.findDistinct(this.comments, 'username');

            this.questions_by_comment = [];
            for (const c of this.comments) {
                let found = -1;
                for (let i = 0; i < this.questions_by_comment.length; i++) {
                    if (this.questions_by_comment[i][0].question == c.question) {
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

        this.API.get('whitelist').success((result) => {
            this.whitelist = result.whitelist;
        });

        this.API.get('stats/general').success((result) => {
            this.stats = result.stats;
        });
    }

    addMail() {
        const email = this.new_whitelist_mail;
        if (email.length) {
            this.whitelist.push({ username: '', mail_address: email });

            const data = { 'mail_address': email.replace('@', '(@)') };
            this.API.post('whitelist', data);
        }
    }

    removeMail(index) {
        const email = this.whitelist[index].mail_address;
        if (email.length) {
            this.whitelist.splice(index, 1);
            this.API.delete('whitelist/' + email);
        }
    }

    changeGroup(index) {
        const userId = this.users[index].user_id;
        let groupId = this.users[index].group_id;

        if (userId == 1) {
            return false;
        }

        if (groupId == 2) {
            groupId = 1;
            this.users[index].group_name = 'Standard';
        } else if (groupId == 3) {
            groupId = 2;
            this.users[index].group_name = 'Admin';
        } else {
            groupId = 3;
            this.users[index].group_name = 'Autor';
        }

        const data = { 'group_id': groupId };
        this.users[index].group_id = groupId;
        this.API.put('users/' + userId + '/group', data);
    }

    isToday(dateString) {
        const today = new Date();

        const date = new Date(dateString * 1000);
        if (today.toDateString() == date.toDateString()) {
            return true;
        }
        return false;
    }

    isYesterday(dateString) {
        const today = new Date();
        const diff = today - 1000 * 60 * 60 * 24;
        const yesterday = new Date(diff);

        const date = new Date(dateString * 1000);
        if (yesterday.toDateString() == date.toDateString()) {
            return true;
        }
        return false;
    }

    userInSelection(index) {
        return this.Selection.isElementIncluded(this.users[index], this.user_search);
    }

    userInSelectionCount() {
        return this.Selection.count(this.users, this.user_search);
    }

    commentInSelectionCount() {
        return this.Selection.count(this.comments, this.comment_search);
    }

    increaseSemester() {
        const data = { 'number': '1' };
        this.API.post('admin/change-semester/dFt(45i$hBmk*I', data).success((result) => {
            alert(result.status);
        });
    }

    decreaseSemester() {
        const data = { 'number': '-1' };
        this.API.post('admin/change-semester/dFt(45i$hBmk*I', data).success((result) => {
            alert(result.status);
        });
    }

    removeTestAccount() {
        this.API.delete('users/test-account').success((result) => {
            alert(result.status);
        });
    }
}

angular.module('adminModule').controller('AdminController', AdminController);
