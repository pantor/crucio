class LearnSearchController {
  API: API;
  user: User;
  questionSearch: any;
  distinctSemesters: any;
  distinctSubjects: any;
  searchResults: any;
  hasSearched: boolean;
  showSpinner: boolean;

  constructor(Auth, Page, API) {
    this.API = API;

    Page.setTitleAndNav('Lernen | Crucio', 'Learn');

    this.user = Auth.getUser();

    this.questionSearch = { semester: this.user.semester };

    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });
  }

  searchQuestion(): void {
    this.searchResults = []; // Reset search results on empty query
    this.hasSearched = false;

    if (this.questionSearch.query) {
      this.showSpinner = true;

      const data = {
        query: this.questionSearch.query,
        subject_id: this.questionSearch.subject && this.questionSearch.subject.subject_id,
        semester: this.questionSearch.semester,
        visibility: 1,
        limit: 100,
      };
      this.API.get('questions', data, true).then(result => {
        this.searchResults = result.data.result;

        this.showSpinner = false;
        this.hasSearched = true;
      });
    }
  }
}

angular.module('crucioApp').component('learnsearchcomponent', {
  templateUrl: 'app/learn/search/search.html',
  controller: LearnSearchController,
});
