import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Crucio } from '../../main';

@Component({
  selector: 'app-user-delete-user-modal',
  templateUrl: './user-delete-user-modal.component.html',
  styleUrls: ['./user-delete-user-modal.component.scss']
})
export class UserDeleteUserModalComponent implements OnInit {
  @Input() user: Crucio.User;

  constructor(private api: ApiService, private auth: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  deleteUser(): void {
    this.api.delete(`users/${this.user.user_id}`).subscribe(() => {
      this.activeModal.close({$value: 'ok'});
      this.auth.logout();
    });
  }
}
