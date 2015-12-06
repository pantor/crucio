class Validate {
    constructor(API) {
        this.whitelist = [];
        API.get('whitelist').success((data) => {
            this.whitelist = data.whitelist;
        });
    }

    email(email) {
        const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
        // let regex = /med\d\d\D\D\D@studserv\.uni-leipzig\.de/; // Nur Medi

        if (this.whitelist.length === 0) {
            return true;
        }

        if (regex.test(email)) {
            return true;
        }

        for (const entry of this.whitelist) {
            if (entry.mail_address === email) {
                return true;
            }
        }
        return false;
    }

    password(password) {
        if (!password) {
            return false;
        }

        if (password.length < 6) {
            return false;
        }

        return true;
    }

    nonEmpty(text) {
        if (text.length === 0) {
            return false;
        }

        return true;
    }
}

angular.module('crucioApp').service('Validate', Validate);
