class ErrorController {
  constructor(Page) {
    Page.setTitleAndNav('Fehler | Crucio', '');
  }
}

angular.module('crucioApp').component('error403component', {
  templateUrl: 'views/403.html',
  controller: ErrorController,
});

angular.module('crucioApp').component('error404component', {
  templateUrl: 'views/404.html',
  controller: ErrorController,
});

angular.module('crucioApp').component('error500component', {
  templateUrl: 'views/500.html',
  controller: ErrorController,
});
