class AuthorController {

  constructor(Page) {
    Page.setTitleAndNav('Autor | Crucio', 'Author');
  }
}

angular.module('crucioApp').component('authorcomponent', {
  templateUrl: 'app/author/author.html',
  controller: AuthorController,
});
