class AdminController {
  
  constructor(Page: PageService) {
    Page.setTitleAndNav('Admin | Crucio', 'Admin');
  }
}

angular.module('crucioApp').component('admincomponent', {
  templateUrl: 'app/admin/admin.html',
  controller: AdminController,
});
