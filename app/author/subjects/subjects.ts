class AuthorSubjectsController {
  readonly API: API;
  subjectList: Crucio.Subject[];

  constructor(API: API) {
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
