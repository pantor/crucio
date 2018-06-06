import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-author-delete-exam-modal',
  templateUrl: './author-delete-exam-modal.component.html',
  styleUrls: ['./author-delete-exam-modal.component.scss']
})
export class AuthorDeleteExamModalComponent implements OnInit {
  @Input() examId: number;

  constructor(private api: ApiService, public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() { }

  deleteExam(): void {
    this.api.delete(`exams/${this.examId}`).subscribe(() => {
      this.activeModal.close({$value: 'ok'});
      this.router.navigate(['/app/author/exams']);
    });
  }
}
