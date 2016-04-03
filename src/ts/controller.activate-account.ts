class ActivateController {
  API: API;
  user: User;
  token: string;
  success: boolean;
  errorNoToken: boolean;
  errorUnknown: boolean;

  constructor(Auth, API, $location) {
    this.API = API;

    this.user = Auth.tryGetUser();
    this.token = $location.search().token;

    if (!this.token) {
      this.success = false;
      this.errorNoToken = true;
    } else {
      const data = { token: this.token };
      this.API.put('users/activate', data).then(result => {
        this.success = result.data.status;
        this.errorNoToken = (result.data.error === 'error_no_token');
        this.errorUnknown = (result.data.error === 'error_unknown');
      });
    }
  }
}

angular.module('crucioApp').controller('ActivateController', ActivateController);
