import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) { }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.auth.getUser();
    if (user.group_id === 2) {
      return true;
    }

    this.router.navigate(['/app']);
    return false;
  }
}
