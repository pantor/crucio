import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import PageService from './../../services/page.service';

class NavbarController {
  private readonly user: Crucio.User;

  constructor(private readonly Auth: AuthService, private readonly Page: PageService) {
    this.user = Auth.getUser();
  }

  logout(): void {
    this.Auth.logout();
  }
}

export const NavbarComponent = 'navbar';
app.component(NavbarComponent, {
  templateUrl: 'app/components/navbar/navbar.html',
  controller: NavbarController,
});
