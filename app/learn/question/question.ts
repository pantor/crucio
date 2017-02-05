class QuestionController {
  readonly Auth: AuthService;
  readonly API: APIService;
  Collection: CollectionService;
  $uibModal: angular.ui.bootstrap.IModalService;
  $window: angular.IWindowService;
  user: Crucio.User;
  questionId: number;
  resetSession: boolean;
  question: Crucio.Question;
  comments: Crucio.Comment[];
  tags: any;
  commentsCollapsed: boolean;
  noAnswer: boolean;
  showExplanation: boolean;
  collection: Crucio.Collection;
  index: number;
  questionData: Crucio.CollectionListItem;
  length: number;
  preQuestionId: number;
  postQuestionId: number;
  checkedAnswer: number;
  correctAnswer: number;
  isAnswerGiven: boolean;
  isAnswerRight: boolean;
  isAnswerWrong: boolean;
  commentText: string;
  wrongAnswer: number;

  constructor(Auth: AuthService, Page: PageService, API: APIService, Collection: CollectionService, $stateParams, $window: angular.IWindowService, $uibModal: angular.ui.bootstrap.IModalService) {
    this.Auth = Auth;
    this.API = API;
    this.Collection = Collection;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Frage | Crucio', 'Learn');

    this.user = Auth.getUser();

    this.questionId = Number($stateParams.questionId);
    this.resetSession = Boolean($stateParams.resetSession);

    this.commentsCollapsed = Boolean(this.user.showComments);

    if (!this.questionId) {
      alert('Fehler: Konnte keine Frage finden.');
      $window.location.replace('/learn/overview');
    }

    this.noAnswer = true;
    this.showExplanation = false;

    if (this.resetSession) {
      this.index = -1;
      delete this.collection;
      Collection.remove();
      this.questionData = undefined;
    } else {
      this.collection = this.Collection.get();
      this.index = this.Collection.getIndexOfQuestion(this.questionId);
      if (this.index > -1) {
        const list = this.collection.list;
        this.questionData = this.Collection.getQuestionData(this.index);
        this.length = list.length;
        this.preQuestionId = this.index > 0 ? list[this.index - 1].question_id : this.questionId;
        this.postQuestionId = this.index < this.length - 1 ? list[this.index + 1].question_id : this.questionId;
      }
    }

    this.loadQuestion();
  }

  loadQuestion(): void {
    this.API.get(`questions/${this.questionId}/user/${this.user.user_id}`).then(result => {
      this.question = result.data.question;
      this.comments = result.data.comments;

      this.tags = [];
      if (result.data.tags) {
        this.tags = result.data.tags.split(',').map(entry => { return { text: entry }; });
      }

      this.checkedAnswer = this.questionData.givenAnswer;

      if (this.questionData.mark_answer) {
        this.markAnswer(this.questionData.givenAnswer);
      }
    });
  }

  // If tag field is changed
  updateTags($tag: any): void {
    const string: string = this.tags.map(entry => entry.text).join(',');
    const data = { tags: string, question_id: this.questionId, user_id: this.user.user_id };
    this.API.post('tags', data, true);
  }

  // If show solution button is clicked
  showSolution(): void {
    const correctAnswer = this.question.correct_answer;
    this.checkedAnswer = correctAnswer;
    let correct = (correctAnswer === this.questionData.givenAnswer) ? 1 : 0;
    if (correctAnswer === 0 || this.question.type === 1) {
      correct = -1;
    }

    const data = {
      correct,
      question_id: this.questionId,
      user_id: this.user.user_id,
      given_result: this.questionData.givenAnswer,
    };
    this.API.post('results', data, true);

    this.Collection.saveMarkAnswer(this.index);
    this.markAnswer(this.questionData.givenAnswer);
  }

  saveAnswer(givenAnswer: number): void {
    this.questionData.givenAnswer = givenAnswer;
    this.Collection.saveAnswer(this.index, this.questionData.givenAnswer);
  }

  // Colors the given answers and shows the correct solution
  markAnswer(givenAnswer: number): void {
    this.isAnswerGiven = true;
    const type = this.question.type;
    if (type > 1) {
      this.correctAnswer = this.question.correct_answer;
      this.checkedAnswer = givenAnswer > 0 ? givenAnswer : this.correctAnswer;

      this.isAnswerRight = (givenAnswer === this.correctAnswer);
      this.isAnswerWrong = (givenAnswer !== this.correctAnswer);

      if (givenAnswer !== this.correctAnswer) {
        this.wrongAnswer = givenAnswer;
      }
    }
  }

  addComment(): void {
    const now = +new Date() / 1000;
    const data: Crucio.Comment = {
      comment: this.commentText,
      question_id: this.questionId,
      reply_to: 0,
      username: this.user.username,
      date: now,
    };
    this.API.post(`comments/${this.user.user_id}`, data).then(result => {
      data['voting'] = 0;
      data['user_voting'] = 0;
      data['comment_id'] = result.data.comment_id;
      this.comments.push(data);
      this.commentText = '';
    });
  }

  deleteComment(index: number): void {
    const commentId = this.comments[index].comment_id;
    this.API.delete(`comments/${commentId}`);
    this.comments.splice(index, 1);
  }

  changeUserVoting(comment: Crucio.Comment, change: number): void {
    comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
    const data = { user_voting: comment.user_voting };
    this.API.post(`comments/${comment.comment_id}/user/${this.user.user_id}`, data, true);
  }

  openImageModal(): void {
    this.$uibModal.open({
      component: 'imageModalComponent',
      resolve: {
        data: () => this.question.question_image_url,
      },
    });
  }

  openReportModal(): void {
    this.$uibModal.open({
      component: 'reportModalComponent',
      resolve: {
        question: () => this.question,
        questionId: () => this.questionId,
      },
    });
  }
}

angular.module('crucioApp').component('questioncomponent', {
  templateUrl: 'app/learn/question/question.html',
  controller: QuestionController,
});
