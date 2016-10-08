class GlobalStatisticUsersController {
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

angular.module('crucioApp').component('globalstatisticuserscomponent', {
  templateUrl: 'app/global-statistics/users/users.html',
  controller: GlobalStatisticUsersController,
});
