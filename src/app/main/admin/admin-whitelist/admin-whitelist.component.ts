import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-whitelist',
  templateUrl: './admin-whitelist.component.html',
  styleUrls: ['./admin-whitelist.component.scss']
})
export class AdminWhitelistComponent implements OnInit {
  whitelist: any;
  newWhitelistMail: string;

  constructor(private api: ApiService) {
    this.api.get('whitelist').subscribe(result => {
      this.whitelist = result.whitelist;
    });
  }

  ngOnInit() { }

  addMail(): void {
    const mail_address = this.newWhitelistMail;
    if (mail_address) {
      this.whitelist.push({ mail_address: mail_address, username: '' });
      this.api.post('whitelist', { mail_address }).subscribe(() => { });
    }
  }

  removeMail(index: number): void {
    const mail_address = this.whitelist[index].mail_address;
    if (mail_address) {
      this.whitelist.splice(index, 1);
      this.api.delete(`whitelist/${mail_address}`).subscribe(() => { });
    }
  }
}
