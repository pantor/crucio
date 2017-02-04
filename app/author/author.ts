class AuthorController {

  constructor(Page: PageService) {
    Page.setTitleAndNav('Autor | Crucio', 'Author');
  }
}

angular.module('crucioApp').component('authorcomponent', {
  templateUrl: 'app/author/author.html',
  controller: AuthorController,
});
