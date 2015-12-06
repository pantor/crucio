class SettingsController {
    constructor(Page, Auth, API) {
        this.API = API;
        this.Auth = Auth;

        Page.setTitleAndNav('Einstellungen | Crucio', 'Name');

        this.user = this.Auth.getUser();
    }

    updateUser() {
        this.is_working = true;

        const data = {
            'highlightExams': this.user.highlightExams,
            'showComments': this.user.showComments,
            'repetitionValue': 50,
            'useAnswers': this.user.useAnswers,
            'useTags': this.user.useTags,
        };

        this.API.put('users/' + this.user.user_id + '/settings', data).success((result) => {
            if (result.status == 'success') {
                this.Auth.setUser(this.user);
                this.is_saved = true;
                this.is_working = false;
            } else {
                this.user = this.Auth.getUser();
                this.has_error = true;
                this.is_working = false;
            }
        });
    }

    removeAllResults() {
        this.API.delete('results/' + this.user.user_id);
    }
}

angular.module('userModule').controller('SettingsController', SettingsController);
