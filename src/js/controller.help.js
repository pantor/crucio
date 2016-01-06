class HelpController {
  constructor(Auth, Page, API, Validation, $location) {
    this.API = API;
    this.Validation = Validation;

    Page.setTitleAndNav('Hilfe | Crucio', '');

    this.user = Auth.getUser();

    this.question_id = $location.search().question_id;
    this.subject = $location.search().s;

    if (this.question_id) {
      this.API.get('questions/' + this.question_id).success(result => {
        this.question = result.question;
      });
    }
  }

  sendMail() {
    const validation = this.Validation.nonEmpty(this.text);

    if (validation) {
      this.isWorking = true;

      if (this.question_id) {
        const data = {
          text: this.text,
          name: this.user.username,
          email: this.user.email.replace('@', '(@)'),
          question_id: this.question_id,
          author: this.question.username,
          question: this.question.question,
          exam_id: this.question.exam_id,
          subject: this.question.subject,
          date: this.question.date,
          author_email: this.question.email,
          mail_subject: this.subject,
        };
        this.API.post('contact/send-mail-question', data).success(() => {
          this.isWorking = false;
          this.emailSend = true;
        });
      } else {
        const data = {
          text: this.text,
          name: this.user.username,
          email: this.user.email.replace('@', '(@)'),
        };
        this.API.post('contact/send-mail', data).success(() => {
          this.isWorking = false;
          this.emailSend = true;
        });
      }
    }
  }
}

angular.module('crucioApp').controller('HelpController', HelpController);
