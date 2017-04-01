class NavbarController {
  readonly Page: PageService;
  readonly Auth: AuthService;
  readonly user: Crucio.User;

  constructor(Auth: AuthService, Page: PageService) {
    this.Page = Page;
    this.Auth = Auth;

    this.user = Auth.getUser();
  }

  logout(): void {
    this.Auth.logout();
  }
}

angular.module('crucioApp').component('navbar', {
  templateUrl: 'app/components/navbar/navbar.html',
  controller: NavbarController,
});
