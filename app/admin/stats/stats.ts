class AdminStatsController {
  private stats: any;
  private resultGraph: any;

  constructor(Auth: AuthService, private readonly API: APIService) {
    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });
  }
}

angular.module('crucioApp').component('adminstatscomponent', {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});
