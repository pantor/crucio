import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthorDeleteOralExamModalComponent } from './author-delete-oral-exam-modal/author-delete-oral-exam-modal.component';

@Component({
  selector: 'app-author-edit-oral-exam',
  templateUrl: './author-edit-oral-exam.component.html',
  styleUrls: ['./author-edit-oral-exam.component.scss'],
  providers: [ToastService]
})
export class AuthorEditOralExamComponent implements OnInit {
  oralExam: Crucio.OralExam = {
    oral_exam_id: -1,
    semester: 0,
    year: 0,
    filename: '',
    examiner_count: 0,
    examiner_1: '',
    examiner_2: '',
    examiner_3: '',
    examiner_4: '',
  };
  readonly user: Crucio.User;
  oralExamId: number;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService, private modal: NgbModal, private route: ActivatedRoute) {
    window.document.title = 'Mündliche Prüfung | Crucio';

    this.user = this.auth.getUser();

    this.route.queryParams.subscribe(params => {
      this.oralExamId = +params['oralExamId'] || -1;

      this.api.get(`oral_exams/${this.oralExamId}`).subscribe(result => {
        this.oralExam = result.oral_exam;
      });
    });
  }

  ngOnInit() { }

  saveOralExam(): void {
    this.api.put(`oral_exams/${this.oralExamId}`, this.oralExam).subscribe(result => {
      if (result.status) {
        this.toast.new('Gespeichert');
      } else {
        this.toast.new('Fehler');
      }
    });
  }

  fileChange(event): void {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.api.upload( fileList[0] ).subscribe(result => {
        this.oralExam.filename = result.filename;
        if (result.status) {
          this.toast.new('Hochgeladen, bitte noch speichern.');
        } else {
          this.toast.new('Fehler');
        }
      });
    }
  }

  deleteDocument(): void {
    this.oralExam.filename = '';
  }

  deleteOralExamModal(): void {
    const modalRef = this.modal.open(AuthorDeleteOralExamModalComponent);
    modalRef.componentInstance.oralExamId = this.oralExamId;
  }
}
