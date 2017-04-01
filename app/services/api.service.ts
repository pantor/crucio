class APIService {
  private readonly $http: any;
  private readonly base: string;

  constructor($http: angular.IHttpService) {
    this.$http = $http;

    this.base = 'api/v1/';
  }

  sanitize(data) {
    data.email = data.email && data.email.replace('@', '(@)');
    return data;
  }

  get(path: string, data: any = {}) {
    return this.$http.get(this.base + path, { params: this.sanitize(data) });
  }

  post(path: string, data: any) {
    return this.$http.post(this.base + path, this.sanitize(data));
  }

  put(path: string, data: any) {
    return this.$http.put(this.base + path, this.sanitize(data));
  }

  delete(path: string, data: any = {}) {
    return this.$http.delete(this.base + path, { params: this.sanitize(data) });
  }
}

angular.module('crucioApp').service('API', APIService);
