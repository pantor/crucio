class AuthorOralExamsController {
  private readonly user: Crucio.User;
  private oralExamSearch: any;
  private distinctOralSemesters: any;
  private distinctOralYears: any;
  private oralExams: Crucio.OralExam[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly $state: angular.ui.IStateService) {
    this.user = Auth.getUser();

    this.oralExamSearch = {};

    this.API.get('oral_exams/distinct').then(result => {
      this.distinctOralYears = result.data.years;
    });

    this.loadOralExams();
  }

  loadOralExams(): void {
    const data = {
      semester: this.oralExamSearch.semester,
      year: this.oralExamSearch.year,
      query: this.oralExamSearch.query,
      limit: 200,
    };
    this.API.get('oral_exams', data).then(result => {
      this.oralExams = result.data.oral_exams;
    });
  }

  newOralExam(): void {
    const data = {
      examiner_count: 3,
      semester: 0,
      year: 2016,
    };

    this.API.post('oral_exams', data).then(result => {
      this.$state.go('edit-oral-exam', {oralExamId: result.data.oral_exam_id});
    });
  }
}

angular.module('crucioApp').component('authororalexamscomponent', {
  templateUrl: 'app/author/oral-exams/oral-exams.html',
  controller: AuthorOralExamsController,
});
