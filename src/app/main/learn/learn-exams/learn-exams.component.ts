import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Collection, CollectionService } from './../../services/collection.service';

@Component({
  selector: 'app-learn-exams',
  templateUrl: './learn-exams.component.html',
  styleUrls: ['./learn-exams.component.scss'],
  providers: [CollectionService]
})
export class LearnExamsComponent implements OnInit {
  exams: Crucio.Exam[];
  private readonly user: Crucio.User;
  distinctSemesters: any;
  distinctSubjects: any;
  examSearch: any;

  constructor(private api: ApiService, private auth: AuthService, private collection: CollectionService) {
    this.user = this.auth.getUser();

    this.examSearch = { semester: { semester: this.user.semester } };

    this.api.get('exams/distinct', { visibility: 1 }).subscribe(result => {
      this.distinctSemesters = result.semesters;
      this.distinctSubjects = result.subjects;
    });

    this.loadExams();
  }

  ngOnInit() { }

  loadExams() {
    const data = {
      user_id: this.user.user_id,
      semester: this.examSearch.semester && this.examSearch.semester.semester,
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      query: this.examSearch.query,
      visibility: 1,
    };
    this.api.get('exams', data).subscribe(result => {
      this.exams = result.exams;
    });
  }

  learnExam(method: any, examId: number): void {
    const data = { examId: examId, random: 0 };
    this.collection.learn('exam', method, data);
  }

  resetExam(exam: any): void {
    exam.answered_questions = 0;
    this.api.delete(`results/${this.user.user_id}/${exam.exam_id}`, true);
  }
}
