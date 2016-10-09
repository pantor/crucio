class AdminStatsController {
  API: API;
  stats: any;
  resultGraph: any;

  constructor(Auth, API) {
    this.API = API;

    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });

    /* this.API.get('stats/result_graph').then(result => {
      console.log(result.data.resultGraph);
      this.resultGraph = result.data.resultGraph;
    }); */

    /* this.labels = ["January", "February", "March", "April", "May", "June", "July"];
    this.series = ['Motivation', 'Workload'];
    this.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ]; */
  }
}

angular.module('crucioApp').component('adminstatscomponent', {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});
