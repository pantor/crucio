class ContactController {
  constructor(Auth, API, $location, $uibModal) {
    this.API = API;
    this.$uibModal = $uibModal;

    this.user = Auth.tryGetUser();

    if (this.user) {
      this.name = this.user.username;
      this.mail = this.user.email;
    }
  }

  sendMail() {
    this.isWorking = true;

    const data = { text: this.text, name: this.name, email: this.mail.replace('@', '(@)') };
    this.API.post('contact/send-mail', data).success(result => {
      if (result.status) {
        this.$uibModal.open({ templateUrl: 'myModalContent.html' });
      }

      this.emailSend = result.status;
      this.isWorking = false;
    });
  }
}

angular.module('crucioApp').controller('ContactController', ContactController);
