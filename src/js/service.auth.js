class Auth {
    constructor($cookies, $window) {
        this.$window = $window;
        this.$cookies = $cookies;
    }

    getUser() {
        this.tryGetUser();
        if (!this.user) {
            this.$window.location.replace('/');
        }

        return this.user;
    }

    tryGetUser() {
        if (angular.isUndefined(this.user)) { // Check if user is in already in user object
            if (angular.isDefined(this.$cookies.getObject('CrucioUser'))) { // Check if cookies
                this.setUser(this.$cookies.getObject('CrucioUser'));
            }
        }

        return this.user;
    }

    login(newUser, rememberUser) {
        newUser.remember_user = rememberUser;
        this.setUser(newUser, true);

        this.$window.location.assign('/questions');
    }

    logout() {
        this.$cookies.remove('CrucioUser');
        this.$window.location.assign(this.$window.location.origin);
    }

    setUser(newUser, saveNewCookie = false) {
        this.user = newUser;

        if (saveNewCookie || angular.isDefined(this.$cookies.getObject('CrucioUser'))) {
            const exp = new Date();
            exp.setDate(exp.getDate() + 21);
            this.$cookies.putObject('CrucioUser', this.user, { expires: exp });
        }
    }
}

angular.module('crucioApp').service('Auth', Auth);
