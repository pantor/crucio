import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-delete-user-modal',
  templateUrl: './admin-delete-user-modal.component.html',
  styleUrls: ['./admin-delete-user-modal.component.scss']
})
export class AdminDeleteUserModalComponent implements OnInit {
  @Input() user: Crucio.User;

  constructor(private api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  deleteUser(): void {
    this.api.delete(`users/${this.user.user_id}`).subscribe(() => { });
    this.activeModal.close({$value: 'delete'});
  }
}
