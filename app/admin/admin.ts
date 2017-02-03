class AdminController {
  
  constructor(Page: Page) {
    Page.setTitleAndNav('Admin | Crucio', 'Admin');
  }
}

angular.module('crucioApp').component('admincomponent', {
  templateUrl: 'app/admin/admin.html',
  controller: AdminController,
});
