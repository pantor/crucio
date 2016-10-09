class AdminToolsController {
  API: API;

  constructor(Auth, API) {
    this.API = API;
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

angular.module('crucioApp').component('admintoolscomponent', {
  templateUrl: 'app/admin/tools/tools.html',
  controller: AdminToolsController,
});
