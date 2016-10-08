class AuthorSubjectsController {
  API: API;
  subjectList: any;

  constructor(API, Page) {
    this.API = API;
    Page.setTitleAndNav('Autor | Crucio', 'Author');

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });
  }
}

angular.module('crucioApp').component('authorsubjectscomponent', {
  templateUrl: 'app/author/subjects/subjects.html',
  controller: AuthorSubjectsController,
});
