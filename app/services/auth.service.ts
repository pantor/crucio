import { app } from './../crucio';

export default class AuthService {
  private user: Crucio.User;

  constructor(private readonly $cookies: angular.cookies.ICookiesService, private readonly $window: angular.IWindowService) {
  }

  getUser(): Crucio.User {
    this.tryGetUser();
    if (!this.user) {
      this.$window.location.replace('/');
    }
    return this.user;
  }

  tryGetUser(): Crucio.User {
    // Check if user is in already in user object and check if cookies
    if (this.user == null && this.$cookies.getObject('CrucioUser') != null) {
      this.setUser(this.$cookies.getObject('CrucioUser'));
    }
    return this.user;
  }

  /* login(newUser: User, rememberUser: boolean): void {
    newUser.remember_user = rememberUser;
    this.setUser(newUser, true);
    this.$window.location.assign('/learn/overview');
  } */

  logout(): void {
    this.$cookies.remove('CrucioUser');
    this.$window.location.assign(this.$window.location.origin);
  }

  setUser(newUser: Crucio.User, saveNewCookie: boolean = false): void {
    this.user = newUser;

    if (saveNewCookie || this.$cookies.getObject('CrucioUser') != null) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 21); // [Days]
      this.$cookies.putObject('CrucioUser', this.user, { expires });
    }

    if (!this.user.remember_me) {
      this.$cookies.remove('CrucioUser');
    }
  }
}

app.service('Auth', AuthService);
