import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class AdminStatsController {
  private stats: any;
  private resultGraph: any;

  constructor(Auth: AuthService, private readonly API: APIService) {
    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });
  }
}

export const AdminStatsComponent = 'adminstatsComponent';
app.component(AdminStatsComponent, {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});
