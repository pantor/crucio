class LearnCommentsController {
  API: API;
  user: User;
  commentSearch: any;
  comments: Comment[];
  questionsByComment: any;

  constructor(Auth, API) {
    this.API = API;

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

angular.module('crucioApp').component('learncommentscomponent', {
  templateUrl: 'app/learn/comments/comments.html',
  controller: LearnCommentsController,
});
