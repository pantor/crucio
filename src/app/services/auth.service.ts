import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  private user: Crucio.User;

  constructor(private readonly router: Router, private api: ApiService) { }

  getUser(): Crucio.User {
    this.tryGetUser();
    if (!this.user || !this.user.jwt) {
      window.location.replace('/');
    }
    return this.user;
  }

  tryGetUser(): Crucio.User {
    // Check if user is in already in user object and check localStorage
    if (this.user == null && localStorage.getItem('CrucioUser') != null) {
      this.setUser(JSON.parse(localStorage.getItem('CrucioUser')));
    }
    if (this.user) {
      this.api.setJwt(this.user.jwt);
    }
    return this.user;
  }

  setUser(newUser: any, saveLocal: boolean = false): void {
    this.user = newUser;

    if (saveLocal || localStorage.getItem('CrucioUser') != null) {
      localStorage.setItem('CrucioUser', JSON.stringify(this.user));
    }

    if (!this.user.remember_me) {
      localStorage.removeItem('CrucioUser');
    }
  }

  logout(): void {
    this.user = undefined;
    localStorage.removeItem('CrucioUser');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    this.tryGetUser();
    return (this.user && this.user.jwt && this.user.user_id > 0);
  }
}
