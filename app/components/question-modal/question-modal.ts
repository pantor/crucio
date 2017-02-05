class QuestionModalController {
  readonly Auth: AuthService;
  readonly API: APIService;
  readonly user: Crucio.User;
  readonly $uibModal: angular.ui.bootstrap.IModalService;
  questionId: number;
  resolve: any;
  close: any;
  dismiss: any;
  commentsCollapsed: boolean;
  noAnswer: boolean;
  showExplanation: boolean;
  question: Crucio.Question;
  comments: Crucio.Comment[];
  tags: any;
  checkedAnswer: number;
  isAnswerGiven: boolean;
  correctAnswer: number;
  isAnswerRight: boolean;
  commentText: string;
  isAnswerWrong: boolean;
  wrongAnswer: number;
  givenAnswer: number;

  constructor(API: APIService, Auth: AuthService, $uibModal: angular.ui.bootstrap.IModalService) {
    this.Auth = Auth;
    this.API = API;
    this.$uibModal = $uibModal;

    this.user = Auth.getUser();

    this.commentsCollapsed = Boolean(this.user.showComments);

    this.noAnswer = true;
    this.showExplanation = false;
  }

  $onInit() {
    this.question = this.resolve.question;
    this.questionId = this.resolve.questionId;

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

      this.checkedAnswer = this.givenAnswer;
    });
  }

  // If tag field is changed
  updateTags($tag: any): void {
    const string: string = this.tags.map(entry => entry.text).join(',');
    const data = { tags: string, question_id: this.questionId, user_id: this.user.user_id };
    this.API.post('tags', data);
  }

  // If show solution button is clicked
  showSolution(): void {
    const correctAnswer = this.question.correct_answer;
    this.checkedAnswer = correctAnswer;
    let correct = (correctAnswer === this.givenAnswer) ? 1 : 0;
    if (correctAnswer === 0 || this.question.type === 1) {
      correct = -1;
    }

    const data = {
      correct,
      question_id: this.questionId,
      user_id: this.user.user_id,
      given_result: this.givenAnswer,
    };
    this.API.post('results', data);

    this.markAnswer(this.givenAnswer);
  }

  saveAnswer(givenAnswer: number): void {
    this.givenAnswer = givenAnswer;
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
    const data = {
      comment: this.commentText,
      question_id: this.questionId,
      reply_to: 0,
      username: this.user.username,
      date: now,
    };
    this.API.post(`comments/${this.user.user_id}`, data).then(result => {
      const newComment: Crucio.Comment = {
        ...data,
        voting: 0,
        user_voting: 0,
        comment_id: result.data.comment_id,
      }
      this.comments.push(newComment);
      this.commentText = '';
    });
  }

  deleteComment(index: number): void {
    const commentId: number = this.comments[index].comment_id;
    this.API.delete(`comments/${commentId}`);
    this.comments.splice(index, 1);
  }

  changeUserVoting(comment: Crucio.Comment, change: number): void {
    comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
    const data = { user_voting: comment.user_voting };
    this.API.post(`comments/${comment.comment_id}/user/${this.user.user_id}`, data);
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
        questionId: () => this.questionId,
        question: () => this.question
      },
    });
  }
}

angular.module('crucioApp').component('questionModalComponent', {
  templateUrl: 'app/components/question-modal/question-modal.html',
  controller: QuestionModalController,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});
