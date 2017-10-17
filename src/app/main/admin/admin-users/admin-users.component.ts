import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { AdminUserModalComponent } from './admin-user-modal/admin-user-modal.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: Crucio.User[];
  readonly user: Crucio.User;
  distinctGroups: any;
  distinctSemesters: any;
  userSearch: any;

  constructor(private api: ApiService, private auth: AuthService, private modal: NgbModal) {
    this.user = this.auth.getUser();

    this.userSearch = {};

    this.api.get('users/distinct').subscribe(result => {
      this.distinctGroups = result.groups;
      this.distinctSemesters = result.semesters;
    });

    this.loadUsers();
  }

  ngOnInit() { }

  loadUsers(): void {
    const data = {
      semester: this.userSearch.semester && this.userSearch.semester.semester,
      group_id: this.userSearch.group && this.userSearch.group.group_id,
      query: this.userSearch.query,
      limit: 100,
    };
    this.api.get('users', data).subscribe(result => {
      this.users = result.users;
    });
  }

  userModal(index: number): void {
    const modalRef = this.modal.open(AdminUserModalComponent, { size: 'lg' });
    modalRef.componentInstance.user = this.users[index];

    modalRef.result.then(response => {
      if (response === 'delete') {
        this.users.splice(index, 1);
      }
    });
  }
}
