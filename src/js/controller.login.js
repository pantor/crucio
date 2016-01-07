class LoginController {
  constructor(Auth, API, $document) {
    this.Auth = Auth;
    this.API = API;
    this.$document = $document;

    this.user = this.Auth.tryGetUser();
    this.rememberMe = true;
  }

  formChanged() {
    this.loginError = false;
  }

  login() {
    if (!this.email) { // If undefined, replace will log an error
      this.email = '';
    }

    const data = {
      email: this.email.replace('@', '(@)'),
      remember_me: this.rememberMe,
      password: this.password,
    };
    this.API.get('users/login', data).success(result => {
      this.loginError = !result.status;
      if (!this.loginError) {
        this.Auth.login(result.logged_in_user, this.rememberMe);
      }
    });
  }
}

angular.module('crucioApp').controller('LoginController', LoginController);
