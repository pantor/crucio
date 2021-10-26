import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Crucio } from '../../main';

@Component({
  selector: 'app-author-exams',
  templateUrl: './author-exams.component.html',
  styleUrls: ['./author-exams.component.scss']
})
export class AuthorExamsComponent implements OnInit {
  exams: Crucio.Exam[];
  private readonly user: Crucio.User;
  examSearch: any;
  distinctSemesters: any;
  distinctSubjects: any;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    this.user = auth.getUser();

    this.examSearch = { };

    this.api.get('exams/distinct').subscribe(result => {
      this.distinctSemesters = result.semesters;
      this.distinctSubjects = result.subjects;
    });

    this.loadExams();
  }

  ngOnInit() { }

  loadExams(): void {
    const data = {
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      semester: this.examSearch.semester && this.examSearch.semester.semester,
      query: this.examSearch.query,
      limit: 200,
      showEmpty: true,
    };
    this.api.get('exams', data).subscribe(result => {
      this.exams = result.exams;
    });
  }

  newExam() {
    const data = {
      subject_id: 1,
      user_id_added: this.user.user_id,
      sort: 'Erstklausur',
    };

    this.api.post('exams', data).subscribe(result => {
      if (result.status) {
        this.router.navigate(['/app/edit-exam'], { queryParams: { examId: result.exam_id } });
      } else {
        alert('Error: Could not save new exam!');
      }
    });
  }
}
