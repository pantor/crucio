import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  readonly base: string = 'api/v1/';
  jwt: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  setJwt(jwt: string): void {
    this.jwt = jwt;
    this.headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
  }

  makeParams(data: any): HttpParams {
    const res = Object.keys(data) // Filter undefined values
      .filter( key => data[key] !== undefined )
      .reduce((res, key) => {
        if (typeof data[key] === 'object') {
          return (res[key] = JSON.stringify(data[key]), res);
        }
        return (res[key] = data[key], res);
      }, {});

    return new HttpParams({ fromObject: res });
  }

  get(path: string, data: any = {}): Observable<any> {
    return this.http.get(this.base + path, { headers: this.headers, params: this.makeParams(data) });
  }

  post(path: string, data: any): Observable<any> {
    return this.http.post(this.base + path, data, { headers: this.headers });
  }

  put(path: string, data: any): Observable<any> {
    return this.http.put(this.base + path, data, { headers: this.headers });
  }

  delete(path: string, data: any = {}): Observable<any> {
    return this.http.delete(this.base + path, { headers: this.headers, params: this.makeParams(data) });
  }

  upload(file: File): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file, file.name);

    return this.http.post(this.base + 'file/upload', data, { headers: this.headers });
  }
}
