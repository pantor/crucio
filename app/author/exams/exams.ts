import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class AuthorExamsController {
  private readonly user: Crucio.User;
  private examSearch: any;
  private distinctSemesters: any;
  private distinctAuthors: any;
  private distinctSubjects: any;
  private subjectList: Crucio.Subject[];
  private exams: Crucio.Exam[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly $state: angular.ui.IStateService) {
    this.user = Auth.getUser();

    this.examSearch = { author: this.user };

    this.API.get('exams/distinct').then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctAuthors = [this.user];
      this.distinctSubjects = result.data.subjects;
    });

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });

    this.loadExams();
  }

  loadExams(): void {
    const data = {
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      author_id: this.examSearch.author && this.examSearch.author.user_id,
      semester: this.examSearch.semester && this.examSearch.semester.semester,
      query: this.examSearch.query,
      limit: 200,
      showEmpty: true,
    };
    this.API.get('exams', data).then(result => {
      this.exams = result.data.exams;
    });
  }

  newExam(): void {
    const data = {
      subject_id: 1,
      user_id_added: this.user.user_id,
      sort: 'Erstklausur',
    };

    this.API.post('exams', data).then(result => {
      this.$state.go('edit-exam', {examId: result.data.exam_id});
    });
  }
}

export const AuthorExamsComponent = 'authorexamsComponent';
app.component(AuthorExamsComponent, {
  templateUrl: 'app/author/exams/exams.html',
  controller: AuthorExamsController,
});
