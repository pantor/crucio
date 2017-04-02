class LearnOralExamsController {
  private readonly user: Crucio.User;
  private oralExamSearch: any;
  private oralExams: Crucio.OralExam[];
  private distinctOralSemesters: any;
  private distinctOralYears: any;
  private hasSearched: boolean;

  constructor(Auth: AuthService, private readonly API: APIService, $scope: angular.IScope, $location: angular.ILocationService, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.oralExamSearch = { semester: this.user.semester <= 4 ? 0 : 1 };

    this.API.get('oral_exams/distinct', {visibility: 1}).then(result => {
      this.distinctOralSemesters = result.data.semesters;
      this.distinctOralYears = result.data.years;
    });
  }

  searchOralExams(): void {
    this.oralExams = []; // Reset search results on empty query
    this.hasSearched = false;

    if (this.oralExamSearch.query) {
      const data = {
        semester: this.oralExamSearch.semester,
        year: this.oralExamSearch.year,
        query: this.oralExamSearch.query,
        limit: 200,
      };
      this.API.get('oral_exams', data).then(result => {
        this.oralExams = result.data.oral_exams;

        this.hasSearched = true;
      });
    }
  }
}

angular.module('crucioApp').component('learnoralexamscomponent', {
  templateUrl: 'app/learn/oral-exams/oral-exams.html',
  controller: LearnOralExamsController,
});
