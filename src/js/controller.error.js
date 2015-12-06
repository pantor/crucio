class ErrorController {
    constructor(Auth, Page) {
        Page.setTitleAndNav('Fehler | Crucio', '');

        this.user = Auth.tryGetUser();
    }
}

angular.module('crucioApp').controller('ErrorController', ErrorController);
