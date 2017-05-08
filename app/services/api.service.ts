import { app } from './../crucio';

export default class APIService {
  private readonly base: string = 'api/v1/';

  constructor(private readonly $http: angular.IHttpService) { }

  get(path: string, data: any = {}): angular.IHttpPromise<any> {
    return this.$http.get(this.base + path, { params: data });
  }

  post(path: string, data: any): angular.IHttpPromise<any> {
    return this.$http.post(this.base + path, data);
  }

  put(path: string, data: any): angular.IHttpPromise<any> {
    return this.$http.put(this.base + path, data);
  }

  delete(path: string, data: any = {}): angular.IHttpPromise<any> {
    return this.$http.delete(this.base + path, { params: data });
  }
}

app.service('API', APIService);
