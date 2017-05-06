import { app } from './../../crucio';

import APIService from './../../services/api.service';

class AdminToolsController {

  constructor(private readonly API: APIService) {

  }

  changeSemester(difference: number): void {
    const data = { difference };
    this.API.put('users/change-semester', data).then(result => {
      alert(result.data.status);
    });
  }

  removeTestAccount(): void {
    this.API.delete('users/test-account').then(result => {
      alert(result.data.status);
    });
  }
}

export const AdminToolsComponent = 'adminToolsComponent';
app.component(AdminToolsComponent, {
  templateUrl: 'app/admin/tools/tools.html',
  controller: AdminToolsController,
});
