import { app } from './../../crucio';

class AuthorAdivcesController {
  constructor() { }
}

export const AuthorAdvicesComponent = 'authoradvicesComponent';
app.component(AuthorAdvicesComponent, {
  templateUrl: 'app/author/advices/advices.html',
  controller: AuthorAdivcesController,
});
