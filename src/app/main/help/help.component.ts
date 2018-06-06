import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  providers: [ToastService]
})
export class HelpComponent implements OnInit {
  f: FormGroup;
  readonly user: Crucio.User;
  emailSend = false;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService, private fb: FormBuilder) {
    window.document.title = 'Hilfe | Crucio';

    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.f = this.fb.group({
      message: new FormControl('', [Validators.required])
    });
  }

  sendMail(): void {
    const data = {
      text: this.f.value.message,
      name: this.user.username,
      email: this.user.email,
    };
    this.api.post('contact/send-mail', data).subscribe(() => {
      this.toast.new('Gesendet');
      this.emailSend = true;
    });
  }
}
