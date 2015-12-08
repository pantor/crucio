class StatisticController {
    constructor(Auth, Page) {
        Page.setTitleAndNav('Statistik | Crucio', 'Lernen');

        this.user = Auth.getUser();
    }
}

angular.module('learnModule').controller('StatisticController', StatisticController);
