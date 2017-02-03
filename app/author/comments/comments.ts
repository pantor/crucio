class AuthorCommentsController {
  readonly API: API;
  user: Crucio.User;
  distinctAuthors: any;
  commentSearch: any;
  comments: Crucio.Comment[];
  questionsByComment: any;

  constructor(Auth: Auth, API: API) {
    this.API = API;

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

angular.module('crucioApp').component('authorcommentscomponent', {
  templateUrl: 'app/author/comments/comments.html',
  controller: AuthorCommentsController,
});
