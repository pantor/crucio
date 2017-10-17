import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { RegisterSuccessModalComponent } from './register-success-modal/register-success-modal.component';
import { matchingPasswords } from '../services/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  f: FormGroup;

  constructor(private api: ApiService, private modal: NgbModal, private fb: FormBuilder) {
    window.document.title = 'Registrieren | Crucio';
  }

  ngOnInit() {
    this.f = this.fb.group({
      name: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\.[a-z]{2,4}$/)]),
      semester: new FormControl('1', [Validators.required, Validators.min(1), Validators.max(50)]),
      password: new FormControl('', [Validators.required]),
      passwordC: new FormControl('', [Validators.required]),
    }, { validator: matchingPasswords('password', 'passwordC') });
  }

  registerUser() {
    const data = {
      username: this.f.value.name,
      email: this.f.value.mail,
      semester: this.f.value.semester,
      password: this.f.value.password,
      course: 1
    };
    this.api.post('users', data).subscribe(result => {
      if (result.status) {
        this.modal.open(RegisterSuccessModalComponent);
      }

      if (result.error === 'error_username_taken') {
        this.f.controls.name.setErrors({'taken': true});
      }
      if (result.error === 'error_email_taken') {
        this.f.controls.mail.setErrors({'taken': true});
      }
      if (result.error === 'error_email_forbidden') {
        this.f.controls.mail.setErrors({'forbidden': true});
      }
    });
  }
}
