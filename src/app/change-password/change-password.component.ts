import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { ChangePasswordSuccessModalComponent } from './change-password-success-modal/change-password-success-modal.component';
import { matchingPasswords } from '../services/validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  token: string;
  f: FormGroup;
  errorNoToken = true;

  constructor(private api: ApiService, private modal: NgbModal, private route: ActivatedRoute, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        this.errorNoToken = false;
      }
    });
  }

  ngOnInit() {
    this.f = this.fb.group({
      password: new FormControl('', [Validators.required]),
      passwordC: new FormControl('', [Validators.required]),
    }, { validator: matchingPasswords('password', 'passwordC') });
  }

  changePassword() {
    const data = {
      password: this.f.value.password,
      passwordc: this.f.value.passwordC,
      token: this.token
    };
    this.api.post('users/password/token', data).subscribe(result => {
      if (result.status) {
        this.modal.open(ChangePasswordSuccessModalComponent);
      }

      if (result.error === 'error_token') {
        this.f.controls.password.setErrors({ 'token': true });
      }
    });
  }
}
