import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Crucio } from '../main';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: Crucio.User;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  logout(): void {
    this.auth.logout();
  }
}
