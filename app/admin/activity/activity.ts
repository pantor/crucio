class AdminActivityController {
  readonly API: API;
  updateActivity: boolean;
  showActivity: any;
  activities: any;

  constructor(Page: Page, Auth: Auth, API: API, $interval: angular.IIntervalService) {
    this.API = API;

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

angular.module('crucioApp').component('adminactivitycomponent', {
  templateUrl: 'app/admin/activity/activity.html',
  controller: AdminActivityController,
});
