import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-author-delete-oral-exam-modal',
  templateUrl: './author-delete-oral-exam-modal.component.html',
  styleUrls: ['./author-delete-oral-exam-modal.component.scss']
})
export class AuthorDeleteOralExamModalComponent implements OnInit {
  @Input() oralExamId: number;

  constructor(private api: ApiService, public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() { }

  deleteOralExam(): void {
    this.api.delete(`oral_exams/${this.oralExamId}`).subscribe(() => {
      this.activeModal.close({$value: 'ok'});
      this.router.navigate(['/app/author/oral-exams']);
    });
  }
}
