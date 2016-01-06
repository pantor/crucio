class API {
  constructor($http) {
    this.$http = $http;

    this.base = 'api/v1/';
  }

  get(path, data = {}, ignoreLoadingBar = false) {
    return this.$http.get(this.base + path, { ignoreLoadingBar, params: data });
  }

  post(path, data, ignoreLoadingBar = false) {
    return this.$http.post(this.base + path, data, { ignoreLoadingBar });
  }

  put(path, data, ignoreLoadingBar = false) {
    return this.$http.put(this.base + path, data, { ignoreLoadingBar });
  }

  delete(path, data = {}, ignoreLoadingBar = false) {
    return this.$http.delete(this.base + path, { ignoreLoadingBar, params: data });
  }
}

angular.module('crucioApp').service('API', API);
