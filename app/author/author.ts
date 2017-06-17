import { app } from './../crucio';

import PageService from './../services/page.service';

class AuthorController {

  constructor(Page: PageService) {
    Page.setTitleAndNav('Autor | Crucio', 'Author');
  }
}

export const AuthorComponent = 'authorComponent';
app.component(AuthorComponent, {
  templateUrl: 'app/author/author.html',
  controller: AuthorController,
});
