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
      result: true,
      login: true,
      register: true,
      comment: true,
      examNew: true,
      examUpdate: true,
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
    const showActivityBoolean = {
      result: this.showActivity.result | 0,
      login: this.showActivity.login | 0,
      register: this.showActivity.register | 0,
      comment: this.showActivity.comment | 0,
      examNew: this.showActivity.examNew | 0,
      examUpdate: this.showActivity.examUpdate | 0,
    };
    this.API.get('stats/activities', showActivityBoolean, true).then(result => {
      this.activities = result.data.activities;
    });
  }
}

angular.module('crucioApp').component('globalstatisticcomponent', {
  templateUrl: 'app/admin/global-statistic.html',
  controller: GlobalStatisticController,
});
