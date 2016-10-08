class LearnOralExamsController {
  API: API;
  user: User;
  oralExamSearch: any;
  oralExams: any[];
  distinctOralSemesters: any;
  distinctOralYears: any;
  oralExamsHasSearched: boolean;

  constructor(Auth, Page, API, Collection, $scope, $location, $timeout) {
    this.API = API;

    Page.setTitleAndNav('Lernen | Crucio', 'Learn');

    this.user = Auth.getUser();

    this.oralExamSearch = { semester: this.user.semester };


    this.API.get('oral_exams/distinct', {visibility: 1}).then(result => {
      this.distinctOralSemesters = result.data.semesters;
      this.distinctOralYears = result.data.years;
    });
  }

  searchOralExams(): void {
    this.oralExams = []; // Reset search results on empty query
    this.oralExamsHasSearched = false;

    if (this.oralExamSearch.query) {
      const data = {
        semester: this.oralExamSearch.semester,
        year: this.oralExamSearch.year,
        query: this.oralExamSearch.query,
        limit: 200,
      };
      this.API.get('oral_exams', data, true).then(result => {
        this.oralExams = result.data.oral_exams;

        this.oralExamsHasSearched = true;
      });
    }
  }
}

angular.module('crucioApp').component('learnoralexamscomponent', {
  templateUrl: 'app/learn/oral-exams/oral-exams.html',
  controller: LearnOralExamsController,
});
