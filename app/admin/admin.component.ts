class AdminController {

  constructor(Page) {
    Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');
  }
}

angular.module('crucioApp').component('admincomponent', {
  templateUrl: 'app/admin/admin.html',
  controller: AdminController,
});
