import { app } from './../crucio';

import PageService from './../services/page.service';

class ErrorController {

  constructor(Page: PageService) {
    Page.setTitleAndNav('Fehler | Crucio', '');
  }
}

export const Error403Component = 'error403Component';
app.component(Error403Component, {
  templateUrl: 'app/error/403.html',
  controller: ErrorController,
});

export const Error404Component = 'error404Component';
app.component(Error404Component, {
  templateUrl: 'app/error/404.html',
  controller: ErrorController,
});

export const Error500Component = 'error500Component';
app.component(Error500Component, {
  templateUrl: 'app/error/500.html',
  controller: ErrorController,
});
