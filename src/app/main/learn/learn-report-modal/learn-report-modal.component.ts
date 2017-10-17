import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-learn-report-modal',
  templateUrl: './learn-report-modal.component.html',
  styleUrls: ['./learn-report-modal.component.scss']
})
export class LearnReportModalComponent implements OnInit {
  @Input() user: any;
  @Input() question: any;
  message: string;

  constructor(private api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  reportQuestion(): void {
    const validation = this.message;

    if (validation) {
      const data: any = {
        text: this.message,
        name: this.user.username,
        email: this.user.email,
        question_id: this.question.question_id,
        author: this.question.username,
        question: this.question.question,
        exam_id: this.question.exam_id,
        subject: this.question.subject,
        date: this.question.date,
        author_email: this.question.email,
        mail_subject: 'Allgemein',
      };
      this.api.post('contact/send-mail-question', data).subscribe(() => {
        this.activeModal.close({$value: 'reported'});
      });
    }
  }
}
