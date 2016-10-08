class GlobalStatisticResultsController {
  API: API;
  stats: any;

  constructor(Page, Auth, API) {
    this.API = API;

    Page.setTitleAndNav('Statistik | Crucio', 'Admin');

    this.loadData();
  }

  loadData(): void {
    this.API.get('stats/general').then(result => {
      this.stats = result.data.stats;
    });
  }
}

angular.module('crucioApp').component('globalstatisticresultscomponent', {
  templateUrl: 'app/global-statistics/results/results.html',
  controller: GlobalStatisticResultsController,
});
