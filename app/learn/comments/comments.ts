import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class LearnCommentsController {
  private readonly user: Crucio.User;
  private commentSearch: any;
  private comments: Crucio.Comment[];
  private questionsByComment: any;

  constructor(Auth: AuthService, private readonly API: APIService) {
    this.user = Auth.getUser();

    this.commentSearch = {};

    this.loadComments();
  }

  loadComments(): void {
    const data = {
      query: this.commentSearch.query,
      user_id: this.user.user_id,
    };
    this.API.get('comments', data).then(result => {
      this.comments = result.data.comments;

      this.questionsByComment = {};
      for (const c of this.comments) {
        this.questionsByComment[c.question] = this.questionsByComment[c.question] || [];
        this.questionsByComment[c.question].push(c);
      }
    });
  }
}

export const LearnCommentsComponent = 'learnCommentsComponent';
app.component(LearnCommentsComponent, {
  templateUrl: 'app/learn/comments/comments.html',
  controller: LearnCommentsController,
});
