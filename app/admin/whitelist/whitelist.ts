class AdminWhitelistController {
  API: API;
  whitelist: any;
  newWhitelistEmail: string;

  constructor(Auth, API) {
    this.API = API;

    this.API.get('whitelist').then(result => {
      this.whitelist = result.data.whitelist;
    });
  }

  addMail(): void {
    const email = this.newWhitelistEmail;
    if (email) {
      this.whitelist.push({ mail_address: email, username: '' });

      const data = { email };
      this.API.post('whitelist', data);
    }
  }

  removeMail(index: number): void {
    const email = this.whitelist[index].mail_address;
    if (email) {
      this.whitelist.splice(index, 1);
      this.API.delete(`whitelist/${email}`);
    }
  }
}

angular.module('crucioApp').component('adminwhitelistcomponent', {
  templateUrl: 'app/admin/whitelist/whitelist.html',
  controller: AdminWhitelistController,
});
