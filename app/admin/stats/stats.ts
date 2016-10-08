class AdminStatsController {
  API: API;
  stats: any;

  constructor(Page, Auth, API) {
    this.API = API;

    Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');

    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });
  }
}

angular.module('crucioApp').component('adminstatscomponent', {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});
