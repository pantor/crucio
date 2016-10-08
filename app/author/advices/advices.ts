class AuthorAdivcesController {

  constructor(Page) {
    Page.setTitleAndNav('Autor | Crucio', 'Author');
  }
}

angular.module('crucioApp').component('authoradvicescomponent', {
  templateUrl: 'app/author/advices/advices.html',
  controller: AuthorAdivcesController,
});
