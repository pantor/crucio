class Auth {
    constructor($window, $cookies) {
        this.$window = $window;
        this.$cookies = $cookies;

        // this.user = undefined;
    }

    getUser() {
        this.user = this.tryGetUser();
        if (!this.user) {
            this.$window.location.replace('/');
        }

        return this.user;
    }

    tryGetUser() {
        if (angular.isDefined(this.user)) { // Check if user is in already in user object
            // Pass...
        } else if (angular.isDefined(this.$cookies.getObject('CrucioUser'))) { // Check if cookies
            this.user = this.$cookies.getObject('CrucioUser');
        }

        return this.user;
    }

    login(newUser, rememberUser) {
        this.setUser(newUser, rememberUser);
        this.$window.location.assign('/questions');
    }

    logout() {
        // delete user;
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        this.$cookies.remove('CrucioUser');
        this.$window.location.assign(this.$window.location.origin);
    }

    setUser(newUser, saveNewCookie = false) {
        this.user = newUser;

        if (saveNewCookie || angular.isDefined(this.$cookies.getObject('CrucioUser'))) {
            const now = new Date();
            const exp = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            this.$cookies.putObject('CrucioUser', this.user, { expires: exp });
        }
    }
}

angular.module('crucioApp').service('Auth', Auth);
