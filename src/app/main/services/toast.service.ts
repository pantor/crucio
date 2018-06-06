import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class Toast {
  text: string;
}

@Injectable()
export class ToastService {
  newSubject: Subject<Toast> = new Subject();

  constructor() { }

  new(text: string) {
    this.newSubject.next({ text: text });
  }
}
