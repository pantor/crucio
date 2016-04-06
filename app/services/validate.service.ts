class Validate {
  public API: API;
  public whitelist: any;

  constructor(API) {
    this.API = API;

    API.get('whitelist', {}, true).then(result => {
      this.whitelist = result.data.whitelist;
    });
  }

  username(username: string): boolean {
    // TODO: Check duplicate
    return (username.length > 4);
  }

  email(mail: string): boolean {
    // Check online duplicate
    const regex = /[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/;
    if (regex.test(mail)) {
      return true;
    }

    return this.whitelist && this.whitelist.some(entry => entry.mail_address === mail);
  }

  password(password: string): boolean {
    return (password && password.length > 4);
  }
}

angular.module('crucioApp').service('Validate', Validate);
