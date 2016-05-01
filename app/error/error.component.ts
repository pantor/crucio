class ErrorController {
  constructor(Page) {
    Page.setTitleAndNav('Fehler | Crucio', '');
  }
}

angular.module('crucioApp').component('error403component', {
  templateUrl: 'app/error/403.html',
  controller: ErrorController,
});

angular.module('crucioApp').component('error404component', {
  templateUrl: 'app/error/404.html',
  controller: ErrorController,
});

angular.module('crucioApp').component('error500component', {
  templateUrl: 'app/error/500.html',
  controller: ErrorController,
});
