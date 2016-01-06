class StatisticController {
  constructor(Auth, Page) {
    Page.setTitleAndNav('Statistik | Crucio', 'Lernen');

    this.user = Auth.getUser();
  }
}

angular.module('crucioApp').controller('StatisticController', StatisticController);
