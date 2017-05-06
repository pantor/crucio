import { app } from './../crucio';

import PageService from './../services/page.service';

class LearnController {

  constructor(Page: PageService) {
    Page.setTitleAndNav('Lernen | Crucio', 'Learn');
  }
}

export const LearnComponent = 'learnComponent';
app.component(LearnComponent, {
  templateUrl: 'app/learn/learn.html',
  controller: LearnController,
});
