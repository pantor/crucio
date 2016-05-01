class NavbarController {
  Page: Page;
  Auth: Auth;
  user: User;

  constructor(Auth, Page) {
    this.Page = Page;
    this.Auth = Auth;

    this.user = Auth.getUser();
  }

  logout(): void {
    this.Auth.logout();
  }
}

angular.module('crucioApp').component('navbar', {
  templateUrl: 'app/components/navbar.html',
  controller: NavbarController,
});
