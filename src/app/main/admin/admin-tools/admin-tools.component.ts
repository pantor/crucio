import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit() { }

  changeSemester(difference: number): void {
    const data = { difference };
    this.api.put('users/change-semester', data).subscribe(result => {
      alert(result.status);
    });
  }

  removeTestAccount(): void {
    this.api.delete('users/test-account').subscribe(result => {
      alert(result.status);
    });
  }
}
