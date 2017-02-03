class NavbarController {
  Page: Page;
  Auth: Auth;
  user: Crucio.User;

  constructor(Auth: Auth, Page: Page) {
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
