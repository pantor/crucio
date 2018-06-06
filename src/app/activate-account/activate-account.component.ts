import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  token: string;
  errorNoToken = true;
  errorUnknown = false;
  success = false;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    window.document.title = 'Account Aktivieren | Crucio';

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        this.errorNoToken = false;
        const data = { token: this.token };
        this.api.put('users/activate', data).subscribe(result => {
          if (result.error === 'error_unknown') {
            this.errorUnknown = true;
          } else {
            this.success = true;
          }
        });
      }
    });
  }

  ngOnInit() { }
}
