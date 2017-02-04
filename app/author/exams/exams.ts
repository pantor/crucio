class AuthorExamsController {
  readonly API: APIService;
  $location: angular.ILocationService;
  user: Crucio.User;
  examSearch: any;
  distinctSemesters: any;
  distinctAuthors: any;
  distinctSubjects: any;
  subjectList: Crucio.Subject[];
  exams: Crucio.Exam[];

  constructor(Auth: AuthService, API: APIService, $location: angular.ILocationService) {
    this.API = API;
    this.$location = $location;

    this.user = Auth.getUser();

    this.examSearch = { author: this.user };

    this.API.get('exams/distinct').then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctAuthors = result.data.authors;
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
      semester: this.examSearch.semester,
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
      this.$location.path('/edit-exam').search('examId', result.data.exam_id);
    });
  }
}

angular.module('crucioApp').component('authorexamscomponent', {
  templateUrl: 'app/author/exams/exams.html',
  controller: AuthorExamsController,
});
