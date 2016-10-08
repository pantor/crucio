class GlobalStatisticQuestionsController {
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

angular.module('crucioApp').component('globalstatisticquestionscomponent', {
  templateUrl: 'app/global-statistics/questions/questions.html',
  controller: GlobalStatisticQuestionsController,
});
