class NavbarController {
  private readonly user: Crucio.User;

  constructor(private readonly Auth: AuthService, private readonly Page: PageService) {
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
