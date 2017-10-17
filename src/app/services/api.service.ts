import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
  readonly base: string = 'api/v1/';

  constructor(private http: Http) { }

  get(path: string, data: any = {}): Observable<any> {
    return this.http.get(this.base + path, { params: data }).map((res: Response) => res.json());
  }

  post(path: string, data: any): Observable<any> {
    return this.http.post(this.base + path, data).map((res: Response) => res.json());
  }

  put(path: string, data: any): Observable<any> {
    return this.http.put(this.base + path, data).map((res: Response) => res.json());
  }

  delete(path: string, data: any = {}): Observable<any> {
    return this.http.delete(this.base + path, { params: data }).map((res: Response) => res.json());
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(this.base + 'file/upload', formData).map((res: Response) => res.json());
  }
}
