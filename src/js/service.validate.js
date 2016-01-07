class Validate {
  constructor(API) {
    this.API = API;

    API.get('whitelist', {}, true).success(result => {
      this.whitelist = result.whitelist;
    });
  }

  username(username) {
    // TODO: Check duplicate
    return (username.length > 4);
  }

  email(mail) {
    // Check online duplicate
    const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    if (regex.test(mail)) {
      return true;
    }

    return this.whitelist && this.whitelist.some(entry => entry.mail_address === mail);
  }

  password(password) {
    return (password && password.length > 4);
  }
}

angular.module('crucioApp').service('Validate', Validate);
