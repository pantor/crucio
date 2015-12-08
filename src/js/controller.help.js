class HelpController {
    constructor(Auth, Page, API, $location, $scope, $modal) {
        this.API = API;
        this.$modal = $modal;

        Page.setTitleAndNav('Hilfe | Crucio', '');

        this.user = Auth.getUser();

        const routeParams = $location.search();
        this.question_id = routeParams.question_id;
        this.subject = routeParams.s;
        if (this.subject == 'Antwort') {
            this.subject = 'Falsche Antwort';
        }
        this.text = '';

        if (this.question_id) {
            this.API.get('questions/' + this.question_id).success((result) => {
                this.question = result.question;
            });
        }

        this.is_working = false;
    }

    sendMail() {
        const text = this.text;

        let validation_passed = 1;
        if (this.text.length === 0) {
            validation_passed = 0;
        }

        if (validation_passed) {
            this.is_working = true;

            if (this.question_id) {
                const data = {
                    'name': this.user.username,
                    'email': this.user.email.replace('@', '(@)'),
                    'text': text,
                    'question_id': this.question_id,
                    'author': this.question.username,
                    'question': this.question.question,
                    'exam_id': this.question.exam_id,
                    'subject': this.question.subject,
                    'date': this.question.date,
                    'author_email': this.question.email,
                    'mail_subject': this.subject,
                };

                this.API.post('contact/send-mail-question', data).success(() => {
                    this.is_working = false;
                    this.email_send = true;
                    this.open();
                });
            } else {
                const data = { 'name': this.user.username, 'email': this.user.email.replace('@', '(@)'), 'text': text };
                this.API.post('contact/send-mail', data).success(() => {
                    this.is_working = false;
                    this.email_send = true;
                    this.open();
                });
            }
        }
    }
}

angular.module('crucioApp').controller('HelpController', HelpController);
