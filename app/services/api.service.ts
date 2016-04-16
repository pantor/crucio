class API {
  $http: any;
  base: string;

  constructor($http) {
    this.$http = $http;

    this.base = 'api/v1/';
  }

  sanitize(data) {
    data.email = data.email && data.email.replace('@', '(@)');
    return data;
  }

  get(path: string, data: any = {}, ignoreLoadingBar: boolean = false) {
    return this.$http.get(this.base + path, { ignoreLoadingBar, params: this.sanitize(data) });
  }

  post(path: string, data: any, ignoreLoadingBar: boolean = false) {
    return this.$http.post(this.base + path, this.sanitize(data), { ignoreLoadingBar });
  }

  put(path: string, data: any, ignoreLoadingBar: boolean = false) {
    return this.$http.put(this.base + path, this.sanitize(data), { ignoreLoadingBar });
  }

  delete(path: string, data: any = {}, ignoreLoadingBar: boolean = false) {
    return this.$http.delete(this.base + path, { ignoreLoadingBar, params: this.sanitize(data) });
  }
}

angular.module('crucioApp').service('API', API);
