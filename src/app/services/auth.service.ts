import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  private user: Crucio.User;

  constructor(private cookieService: CookieService, private readonly router: Router, private api: ApiService) { }

  getUser(): Crucio.User {
    this.tryGetUser();
    if (!this.user || !this.user.jwt) {
      window.location.replace('/');
    }
    return this.user;
  }

  tryGetUser(): Crucio.User {
    // Check if user is in already in user object and check if cookies
    if (this.user == null && this.cookieService.getObject('CrucioUser') != null) {
      this.setUser(this.cookieService.getObject('CrucioUser'));
    }
    if (this.user) {
      this.api.setJwt(this.user.jwt);
    }
    return this.user;
  }

  setUser(newUser: any, saveNewCookie: boolean = false): void {
    this.user = newUser;

    if (saveNewCookie || this.cookieService.getObject('CrucioUser') != null) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 21); // [Days]
      this.cookieService.putObject('CrucioUser', this.user, { expires });
    }

    if (!this.user.remember_me) {
      this.cookieService.remove('CrucioUser');
    }
  }

  logout(): void {
    this.user = undefined;
    this.cookieService.remove('CrucioUser');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    this.tryGetUser();
    return (this.user && this.user.jwt && this.user.user_id > 0);
  }
}
