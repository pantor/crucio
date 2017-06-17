import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import PageService from './../../services/page.service';

class StatisticController {
  private readonly user: Crucio.User;

  constructor(Auth: AuthService, Page: PageService) {
    Page.setTitleAndNav('Statistik | Crucio', 'Learn');

    this.user = Auth.getUser();
  }
}

export const StatisticComponent = 'statisticComponent';
app.component(StatisticComponent, {
  templateUrl: 'app/learn/statistic/statistic.html',
  controller: StatisticController,
});
