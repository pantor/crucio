import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { AdminDeleteUserModalComponent } from '../admin-delete-user-modal/admin-delete-user-modal.component';

@Component({
  selector: 'app-admin-user-modal',
  templateUrl: './admin-user-modal.component.html',
  styleUrls: ['./admin-user-modal.component.scss']
})
export class AdminUserModalComponent implements OnInit {
  @Input() user: Crucio.User;
  newGroupID: number;
  distinctGroups: any;
  distinctGroupsPerId: any;

  constructor(private api: ApiService, public activeModal: NgbActiveModal, public modal: NgbModal) {
    this.api.get('users/distinct').subscribe(result => {
      this.distinctGroups = result.groups;
      this.distinctGroupsPerId = {};
      for (const e of this.distinctGroups) {
        this.distinctGroupsPerId[e.group_id] = e.name;
      }
    });
  }

  ngOnInit() {
    this.newGroupID = this.user.group_id;
  }

  save(): void {
    this.user.group_id = this.newGroupID;
    this.user.group_name = this.distinctGroupsPerId[this.newGroupID];
    const data = { group_id: this.newGroupID };
    this.api.put(`users/${this.user.user_id}/group`, data).subscribe(() => { });
    this.activeModal.close({$value: 'save'});
  }

  deleteUserModal(): void {
    const modalRef = this.modal.open(AdminDeleteUserModalComponent);
    modalRef.componentInstance.user = this.user;

    modalRef.result.then(response => {
      this.activeModal.close({ $value: response });
    });
  }
}
