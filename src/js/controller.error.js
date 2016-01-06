class ErrorController {
  constructor(Page) {
    Page.setTitleAndNav('Fehler | Crucio', '');
  }
}

angular.module('crucioApp').controller('ErrorController', ErrorController);
