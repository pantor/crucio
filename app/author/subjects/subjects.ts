class AuthorSubjectsController {
  readonly API: APIService;
  subjectList: Crucio.Subject[];

  constructor(API: APIService) {
    this.API = API;

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });
  }
}

angular.module('crucioApp').component('authorsubjectscomponent', {
  templateUrl: 'app/author/subjects/subjects.html',
  controller: AuthorSubjectsController,
});
