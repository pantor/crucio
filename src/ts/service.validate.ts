class Validate {
  public API: any;
  public whitelist: any;

  constructor(API: any) {
    this.API = API;

    API.get('whitelist', {}, true).then(result => {
      this.whitelist = result.data.whitelist;
    });
  }

  username(username: string) {
    // TODO: Check duplicate
    return (username.length > 4);
  }

  email(mail: string) {
    // Check online duplicate
    const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    if (regex.test(mail)) {
      return true;
    }

    return this.whitelist && this.whitelist.some(entry => entry.mail_address === mail);
  }

  password(password: string) {
    return (password && password.length > 4);
  }
}

angular.module('crucioApp').service('Validate', Validate);
