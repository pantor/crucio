class GlobalStatisticController {
  constructor(Page, Auth, API, $interval) {
    this.API = API;

    Page.setTitleAndNav('Statistik | Crucio', 'Admin');
    this.activeTab = 'stats';

    this.user = Auth.getUser();

    this.updateActivity = false;
    this.showActivity = { result: false, login: false, register: false, comment: false, exam_new: false, exam_update: false };

    $interval(() => {
      if (this.updateActivity) {
        this.loadActivity();
      }
    }, 2500);

    this.loadData();
    this.loadActivity();
  }

  loadData() {
    this.API.get('stats/general').success(result => {
      this.stats = result.stats;

      this.chart_time_result_today = {
        labels: this.stats.result_dep_time_today_label,
        datasets: [{
          label: 'Result dep Time',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: this.stats.result_dep_time_today,
        }],
      };
    });
  }

  loadActivity() {
    this.API.get('stats/activities', this.showActivity, true).success(result => {
      this.activities = result.activities;
    });
  }
}

angular.module('crucioApp').controller('GlobalStatisticController', GlobalStatisticController);
