class API {
  constructor($http) {
    this.$http = $http;

    this.base = 'api/v1/';
  }

  sanitize(data) {
    data.email = data.email && data.email.replace('@', '(@)');
    return data;
  }

  get(path, data = {}, ignoreLoadingBar = false) {
    return this.$http.get(this.base + path, { ignoreLoadingBar, params: this.sanitize(data) });
  }

  post(path, data, ignoreLoadingBar = false) {
    return this.$http.post(this.base + path, this.sanitize(data), { ignoreLoadingBar });
  }

  put(path, data, ignoreLoadingBar = false) {
    return this.$http.put(this.base + path, this.sanitize(data), { ignoreLoadingBar });
  }

  delete(path, data = {}, ignoreLoadingBar = false) {
    return this.$http.delete(this.base + path, { ignoreLoadingBar, params: this.sanitize(data) });
  }
}

angular.module('crucioApp').service('API', API);
