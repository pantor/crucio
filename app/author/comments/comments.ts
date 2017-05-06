import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class AuthorCommentsController {
  private readonly user: Crucio.User;
  private distinctAuthors: any;
  private commentSearch: any;
  private comments: Crucio.Comment[];
  private questionsByComment: any;

  constructor(Auth: AuthService, private readonly API: APIService) {
    this.user = Auth.getUser();

    this.commentSearch = { author: this.user };

    this.API.get('exams/distinct').then(result => {
      this.distinctAuthors = result.data.authors;
    });

    this.loadComments();
  }

  loadComments(): void {
    const data = {
      author_id: this.commentSearch.author && this.commentSearch.author.user_id,
      query: this.commentSearch.query,
      limit: 100,
    };
    this.API.get('comments/author', data).then(result => {
      this.comments = result.data.comments;

      this.questionsByComment = [];
      for (const c of this.comments) {
        // found = this.questionsByComment.findIndex(e => { e[0].question == c.question });
        let found = -1;
        for (let i = 0; i < this.questionsByComment.length; i++) {
          if (this.questionsByComment[i][0].question === c.question) {
            found = i;
            break;
          }
        }

        if (found > 0) {
          this.questionsByComment[found].push(c);
        } else {
          this.questionsByComment.push([c]);
        }
      }
      this.questionsByComment.sort((a, b) => { return b[0].date - a[0].date; });
    });
  }
}

export const AuthorCommentsComponent = 'authorcommentsComponent';
app.component(AuthorCommentsComponent, {
  templateUrl: 'app/author/comments/comments.html',
  controller: AuthorCommentsController,
});
