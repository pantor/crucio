angular.module('crucioApp')
    .filter('newlineToBr', function () {
        return function (text) {
            if (angular.isDefined(text)) {
                return text.replace(/\n/g, '<br>');
            }
        };
    });

/* class NewlineToBr {
    constructor() {}

    newlineToBr(text) {
        if (angular.isDefined(text))
            return text.replace(/\n/g, '<br>');
    }
}

angular.module('crucioApp').service('NewlineToBr', NewlineToBr); */
