import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import PageService from './../../services/page.service';

class AdminActivityController {
  private updateActivity: boolean;
  private showActivity: any;
  private activities: any;

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, $interval: angular.IIntervalService) {
    Page.setTitleAndNav('Statistik | Crucio', 'Admin');

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

    this.loadActivity();
  }

  loadActivity(): void {
    this.API.get('stats/activities', this.showActivity).then(result => {
      this.activities = result.data.activities;
    });
  }
}

export const AdminActivityComponent = 'adminActivityComponent';
app.component(AdminActivityComponent, {
  templateUrl: 'app/admin/activity/activity.html',
  controller: AdminActivityController,
});
