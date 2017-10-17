import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-delete-tags-modal',
  templateUrl: './user-delete-tags-modal.component.html',
  styleUrls: ['./user-delete-tags-modal.component.scss']
})
export class UserDeleteTagsModalComponent implements OnInit {
  @Input() user: Crucio.User;

  constructor(private api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  deleteAllTags(): void {
    this.api.delete(`tags/${this.user.user_id}`).subscribe(() => {
      this.activeModal.close({$value: 'ok'});
    });
  }
}
