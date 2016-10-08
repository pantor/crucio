class AdminCommentsController {
  API: API;
  commentSearch: any;
  comments: Comment[];
  questionsByComment: any;

  constructor(Page, Auth, API) {
    this.API = API;

    Page.setTitleAndNav('Verwaltung | Crucio', 'Admin');

    this.commentSearch = {};

    this.loadComments();
  }

  loadComments(): void {
    const data = { query: this.commentSearch.query, limit: 50 };
    this.API.get('comments', data).then(result => {
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

        if (found > -1) {
          this.questionsByComment[found].push(c);
        } else {
          this.questionsByComment.push([c]);
        }
      }
    });
  }
}

angular.module('crucioApp').component('admincommentscomponent', {
  templateUrl: 'app/admin/comments/comments.html',
  controller: AdminCommentsController,
});
