class AdminController {
  labels: any;
  series: any;
  data: any;
  options: any;

  constructor(Page) {
    Page.setTitleAndNav('Admin | Crucio', 'Admin');

    this.labels = ["January", "February", "March", "April", "May", "June", "July"];
    this.series = ['Motivation', 'Workload'];
    this.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    this.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
  }
}

angular.module('crucioApp').component('admincomponent', {
  templateUrl: 'app/admin/admin.html',
  controller: AdminController,
});
