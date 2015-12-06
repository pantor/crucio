class AboutController {
    constructor(Auth) {
        this.user = Auth.tryGetUser();
    }
}

angular.module('crucioApp').controller('AboutController', AboutController);
