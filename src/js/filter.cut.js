angular.module('crucioApp')
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }

            const newMax = parseInt(max, 10);
            if (!newMax) {
                return value;
            }

            if (value.length <= newMax) {
                return value;
            }

            let newValue = value.substr(0, newMax);
            if (wordwise) {
                const lastspace = newValue.lastIndexOf(' ');
                if (lastspace != -1) {
                    newValue = newValue.substr(0, lastspace);
                }
            }

            return newValue + (tail || ' ?');
        };
    });

/* class Cut {
    constructor() {

    }

    cut(value, wordwise = false, max = 10, tail = '') {
        if (!value) {
            return '';
        }

        max = parseInt(max, 10);
        if (!max) {
            return value;
        }

        if (value.length <= max) {
            return value;
        }

        value = value.substr(0, max);
        if (wordwise) {
            let lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' ?');
    }
}

angular.module('crucioApp').service('Cut', Cut); */
