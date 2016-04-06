class GlobalStatisticController {
  API: API;
  activeTab: string;
  user: User;
  updateActivity: boolean;
  showActivity: any;
  stats: any;
  chart_time_result_today: any;
  activities: any;

  constructor(Page, Auth, API, $interval) {
    this.API = API;

    Page.setTitleAndNav('Statistik | Crucio', 'Admin');
    this.activeTab = 'stats';

    this.user = Auth.getUser();

    this.updateActivity = false;
    this.showActivity = {
      result: false,
      login: false,
      register: false,
      comment: false,
      examNew: false,
      examUpdate: false,
    };

    $interval(() => {
      if (this.updateActivity) {
        this.loadActivity();
      }
    }, 2500);

    this.loadData();
    this.loadActivity();
  }

  loadData(): void {
    this.API.get('stats/general').then(result => {
      this.stats = result.data.stats;

      this.chart_time_result_today = {
        labels: this.stats.result_dep_time_today_label,
        data: [this.stats.result_dep_time_today],
      };
    });
  }

  loadActivity(): void {
    this.API.get('stats/activities', this.showActivity, true).then(result => {
      this.activities = result.data.activities;
    });
  }
}

angular.module('crucioApp').component('globalstatisticcomponent', {
  templateUrl: 'app/admin/global-statistic.html',
  controller: GlobalStatisticController,
});
