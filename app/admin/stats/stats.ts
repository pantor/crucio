import { app } from './../../crucio';

import APIService from './../../services/api.service';

class AdminStatsController {
  private stats: any;

  constructor(private readonly API: APIService) {
    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });
  }
}

export const AdminStatsComponent = 'adminStatsComponent';
app.component(AdminStatsComponent, {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});
