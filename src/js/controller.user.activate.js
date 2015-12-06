class ActivateController {
    constructor(Auth, API, $location) {
        this.API = API;

        this.user = Auth.tryGetUser();
        this.token = $location.search().token;

        if (!this.token) {
            this.success = 0;
            this.error_no_token = 1;
        } else {
            const data = { 'token': this.token };
            this.API.post('users/action/activate', data).success((result) => {
                console.log(result);
                if (result.status == 'error_unknown') {
                    this.success = 0;
                    this.error_no_token = 0;
                    this.error_unknown = 1;
                } else if (result.status == 'error_no_token') {
                    this.success = 0;
                    this.error_no_token = 1;
                    this.error_unknown = 0;
                } else if (result.status == 'success') {
                    this.success = 1;
                    this.error_no_token = 0;
                    this.error_unknown = 0;
                }
            });
        }
    }
}

angular.module('userModule').controller('ActivateController', ActivateController);
