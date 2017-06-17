import { app } from './../crucio';

import PageService from './../services/page.service';

class AdminController {

  constructor(Page: PageService) {
    Page.setTitleAndNav('Admin | Crucio', 'Admin');
  }
}

export const AdminComponent = 'adminComponent';
app.component(AdminComponent, {
  templateUrl: 'app/admin/admin.html',
  controller: AdminController,
});
