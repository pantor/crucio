import { app } from './../../crucio';

import APIService from './../../services/api.service';

class AuthorSubjectsController {
  private subjectList: Crucio.Subject[];

  constructor(private readonly API: APIService) {
    this.API = API;

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });
  }
}

export const AuthorSubjectsComponent = 'authorSubjectsComponent';
app.component(AuthorSubjectsComponent, {
  templateUrl: 'app/author/subjects/subjects.html',
  controller: AuthorSubjectsController,
});
