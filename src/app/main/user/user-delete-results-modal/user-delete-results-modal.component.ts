import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-delete-results-modal',
  templateUrl: './user-delete-results-modal.component.html',
  styleUrls: ['./user-delete-results-modal.component.scss']
})
export class UserDeleteResultsModalComponent implements OnInit {
  @Input() user: Crucio.User;

  constructor(private api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  deleteAllResults(): void {
    this.api.delete(`results/${this.user.user_id}`).subscribe(() => {
      this.activeModal.close({$value: 'ok'});
    });
  }
}
