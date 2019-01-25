import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  readonly base: string = 'api/v1/';
  jwt: string;
  private headers: Headers;

  constructor(private http: Http) { }

  setJwt(jwt: string): void {
    this.jwt = jwt;
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer ' + jwt);
  }

  get(path: string, data: any = {}): Observable<any> {
    return this.http.get(this.base + path, { headers: this.headers, params: data }).pipe(map((res: Response) => res.json()));
  }

  post(path: string, data: any): Observable<any> {
    return this.http.post(this.base + path, data, { headers: this.headers }).pipe(map((res: Response) => res.json()));
  }

  put(path: string, data: any): Observable<any> {
    return this.http.put(this.base + path, data, { headers: this.headers }).pipe(map((res: Response) => res.json()));
  }

  delete(path: string, data: any = {}): Observable<any> {
    return this.http.delete(this.base + path, { headers: this.headers, params: data }).pipe(map((res: Response) => res.json()));
  }

  upload(file: File): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file, file.name);

    return this.http.post(this.base + 'file/upload', data, { headers: this.headers }).pipe(map((res: Response) => res.json()));
  }
}
