class StatisticController {
  user: any;
  
  constructor(Auth, Page) {
    Page.setTitleAndNav('Statistik | Crucio', 'Lernen');

    this.user = Auth.getUser();
  }
}

angular.module('crucioApp').component('statisticcomponent', {
  templateUrl: 'views/statistic.html',
  controller: StatisticController,
});
