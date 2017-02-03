class LearnController {

  constructor(Page) {
    Page.setTitleAndNav('Lernen | Crucio', 'Learn');
  }
}

angular.module('crucioApp').component('learncomponent', {
  templateUrl: 'app/learn/learn.html',
  controller: LearnController,
});
