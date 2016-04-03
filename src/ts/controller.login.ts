class LoginController {
  Auth: Auth;
  API: API;
  $document: any;
  user: User;
  rememberMe: boolean;
  loginError: boolean;
  email: string;
  password: string;

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
    const data = {
      email: this.email,
      remember_me: this.rememberMe,
      password: this.password,
    };
    this.API.get('users/login', data).then(result => {
      this.loginError = !result.data.status;
      if (!this.loginError) {
        this.Auth.login(result.data.logged_in_user, this.rememberMe);
      }
    });
  }
}

angular.module('crucioApp').controller('LoginController', LoginController);
