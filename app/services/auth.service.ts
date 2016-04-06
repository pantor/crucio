class Auth {
  $cookies: any;
  $window: any;
  user: User;

  constructor($cookies, $window) {
    this.$window = $window;
    this.$cookies = $cookies;
  }

  getUser(): User {
    this.tryGetUser();
    if (!this.user) {
      this.$window.location.replace('/');
    }
    return this.user;
  }

  tryGetUser(): User {
    // Check if user is in already in user object and check if cookies
    if (
      angular.isUndefined(this.user) && angular.isDefined(this.$cookies.getObject('CrucioUser'))
    ) {
      this.setUser(this.$cookies.getObject('CrucioUser'));
    }
    return this.user;
  }

  login(newUser: User, rememberUser: boolean): void {
    newUser.remember_user = rememberUser;
    this.setUser(newUser, true);
    this.$window.location.assign('/learn');
  }

  logout(): void {
    this.$cookies.remove('CrucioUser');
    this.$window.location.assign(this.$window.location.origin);
  }

  setUser(newUser: User, saveNewCookie: boolean = false): void {
    this.user = newUser;

    if (saveNewCookie || angular.isDefined(this.$cookies.getObject('CrucioUser'))) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 21); // [Days]
      this.$cookies.putObject('CrucioUser', this.user, { expires });
    }
  }
}

angular.module('crucioApp').service('Auth', Auth);
