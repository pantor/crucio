import { Component, OnInit } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  currentToast: Toast;

  constructor(private toast: ToastService) {
    this.toast.newSubject.subscribe(value => {
      this.currentToast = value;

      setTimeout(() => this.delete(), 3000);
    });
  }

  ngOnInit() { }

  delete() {
    this.currentToast = null;
  }
}
