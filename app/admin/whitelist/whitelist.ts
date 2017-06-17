import { app } from './../../crucio';

import APIService from './../../services/api.service';

class AdminWhitelistController {
  private whitelist: any;
  private newWhitelistEmail: string;

  constructor(private readonly API: APIService) {
    this.API.get('whitelist').then(result => {
      this.whitelist = result.data.whitelist;
    });
  }

  addMail(): void {
    const mail_address = this.newWhitelistEmail;
    if (mail_address) {
      this.whitelist.push({ mail_address, username: '' });
      this.API.post('whitelist', { mail_address });
    }
  }

  removeMail(index: number): void {
    const mail_address = this.whitelist[index].mail_address;
    if (mail_address) {
      this.whitelist.splice(index, 1);
      this.API.delete(`whitelist/${mail_address}`);
    }
  }
}

export const AdminWhitelistComponent = 'adminWhitelistComponent';
app.component(AdminWhitelistComponent, {
  templateUrl: 'app/admin/whitelist/whitelist.html',
  controller: AdminWhitelistController,
});
