import { app } from './../crucio';

import AuthService from './../services/auth.service';
import APIService from './../services/api.service';
import PageService from './../services/page.service';

class HelpController {
  private readonly user: Crucio.User;
  private isWorking: boolean;
  private text: string;
  private emailSend: boolean;

  constructor(Auth: AuthService, Page: PageService, private readonly API: APIService) {
    Page.setTitleAndNav('Hilfe | Crucio', '');

    this.user = Auth.getUser();
  }

  sendMail(): void {
    const validation = this.text;

    if (validation) {
      this.isWorking = true;

      const data = {
        text: this.text,
        name: this.user.username,
        email: this.user.email,
      };
      this.API.post('contact/send-mail', data).then(() => {
        this.isWorking = false;
        this.emailSend = true;
      });
    }
  }
}

export const HelpComponent = 'helpComponent';
app.component(HelpComponent, {
  templateUrl: 'app/help/help.html',
  controller: HelpController,
});
