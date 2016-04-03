class ContactController {
  API: any;
  $uibModal: any;
  user: any;
  name: string;
  email: string;
  isWorking: boolean;
  emailSend: any;
  text: string;

  constructor(Auth, API, $location, $uibModal) {
    this.API = API;
    this.$uibModal = $uibModal;

    this.user = Auth.tryGetUser();

    if (this.user) {
      this.name = this.user.username;
      this.email = this.user.email;
    }
  }

  sendMail() {
    this.isWorking = true;

    const data = { text: this.text, name: this.name, email: this.email };
    this.API.post('contact/send-mail', data).then(result => {
      if (result.data.status) {
        this.$uibModal.open({ templateUrl: 'myModalContent.html' });
      }

      this.emailSend = result.data.status;
      this.isWorking = false;
    });
  }
}

angular.module('crucioApp').controller('ContactController', ContactController);
