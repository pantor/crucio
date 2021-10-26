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
  isLoading = false;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    window.document.title = 'Crucio | Fachschaft Medizin Leipzig';

    const user = auth.tryGetUser();
    if (user && user.jwt && user.remember_me === 'true') {
      this.auth.setUser(user, true);
      this.router.navigate(['/app']);
    }
  }

  ngOnInit() { }

  login() {
    this.isLoading = true;
    const data = {
      email: this.mail,
      password: this.password,
      password_encoded: encodeURIComponent(this.password),
      remember_me: this.rememberMe,
    };
    this.api.get('users/login', data).subscribe(result => {
      if (result.status) {
        this.auth.setUser(result.logged_in_user, true);
        this.api.setJwt(result.logged_in_user.jwt);
        this.router.navigate(['/app']);
      } else {
        this.failedLogin = true;
        this.isLoading = false;
      }
    }, error => {
      this.failedLogin = true;
      this.isLoading = false;
    });
  }
}
