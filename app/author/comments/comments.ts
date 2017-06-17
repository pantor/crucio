import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class AuthorCommentsController {
  private readonly user: Crucio.User;
  private comments: Crucio.Comment[];
  private distinctAuthors: any;
  private commentSearch: any;
  private questionsByComment: any;

  constructor(Auth: AuthService, private readonly API: APIService) {
    this.user = Auth.getUser();

    this.commentSearch = { author: this.user };

    this.distinctAuthors = [this.user];

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
          if (this.questionsByComment[i][0].question_id === c.question_id) {
            found = i;
            break;
          }
        }

        if (found >= 0) {
          this.questionsByComment[found].push(c);
        } else {
          this.questionsByComment.push([c]);
        }
      }
      this.questionsByComment.sort((a, b) => { return b[0].date - a[0].date; });
    });
  }
}

export const AuthorCommentsComponent = 'authorCommentsComponent';
app.component(AuthorCommentsComponent, {
  templateUrl: 'app/author/comments/comments.html',
  controller: AuthorCommentsController,
});
