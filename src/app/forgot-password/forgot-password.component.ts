import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { ForgotPasswordSuccessModalComponent } from './forgot-password-success-modal/forgot-password-success-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  f = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\.[a-z]{2,4}$/)])
  });

  constructor(private api: ApiService, private modal: NgbModal) {
    window.document.title = 'Passwort Vergessen | Crucio';
  }

  ngOnInit() { }

  forgotPassword() {
    const data = { email: this.f.value.mail };
    this.api.post('users/password/reset', data).subscribe(result => {
      if (result.status) {
        this.modal.open(ForgotPasswordSuccessModalComponent);
      }

      if (result.error === 'error_email') {
        this.f.controls.mail.setErrors({'notFound': true});

      } else if (result.error === 'error_already_requested') {
        this.f.controls.mail.setErrors({'alreadyForgot': true});
      }
    });
  }
}
