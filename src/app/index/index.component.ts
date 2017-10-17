import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  mail: string;
  password: string;
  rememberMe = true;
  failedLogin = false;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    window.document.title = 'Crucio | Fachschaft Medizin Leipzig';

    const user = auth.tryGetUser();
    if (user && user.remember_me === 'true') {
      this.auth.setUser(user, true);
      this.router.navigate(['/app']);
    }
  }

  ngOnInit() { }

  login() {
    const data = { email: this.mail, password: this.password, remember_me: this.rememberMe };
    this.api.get('users/login', data).subscribe(result => {
      if (result.status) {
        this.auth.setUser(result.logged_in_user, true);
        this.router.navigate(['/app']);
      } else {
        this.failedLogin = true;
      }
    });
  }
}
