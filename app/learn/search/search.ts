class LearnSearchController {
  readonly API: APIService;
  readonly Collection: CollectionService;
  readonly user: Crucio.User;
  questionSearch: any;
  distinctSemesters: any;
  distinctSubjects: any;
  searchResults: any;
  hasSearched: boolean;
  showSpinner: boolean;
  limit: number;

  constructor(Auth: AuthService, API: APIService, Collection: CollectionService) {
    this.API = API;
    this.Collection = Collection;

    this.user = Auth.getUser();

    this.questionSearch = { semester: this.user.semester };

    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.limit = 100;
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
        limit: this.limit,
      };
      this.API.get('questions', data).then(result => {
        this.searchResults = result.data.result;

        this.showSpinner = false;
        this.hasSearched = true;
      });
    }
  }

  learnQuery(): void {
    this.Collection.learn('query', 'question', {
      questionSearch: this.questionSearch,
      user_id: this.user.user_id
    });
  }
}

angular.module('crucioApp').component('learnsearchcomponent', {
  templateUrl: 'app/learn/search/search.html',
  controller: LearnSearchController,
});
