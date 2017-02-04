class StatisticController {
  readonly user: Crucio.User;

  constructor(Auth: AuthService, Page: PageService) {
    Page.setTitleAndNav('Statistik | Crucio', 'Learn');

    this.user = Auth.getUser();
  }
}

angular.module('crucioApp').component('statisticcomponent', {
  templateUrl: 'app/learn/statistic/statistic.html',
  controller: StatisticController,
});
