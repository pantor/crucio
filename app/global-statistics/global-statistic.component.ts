class GlobalStatisticController {

  constructor(Page) {
    Page.setTitleAndNav('Statistik | Crucio', 'Admin');
  }
}

angular.module('crucioApp').component('globalstatisticcomponent', {
  templateUrl: 'app/global-statistics/global-statistic.html',
  controller: GlobalStatisticController,
});
