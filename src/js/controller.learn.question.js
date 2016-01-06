class QuestionController {
  constructor(Auth, Page, API, Collection, $routeParams, $window, $uibModal) {
    this.Auth = Auth;
    this.API = API;
    this.Collection = Collection;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Frage | Crucio', 'Lernen');

    this.user = Auth.getUser();
    this.collection = this.Collection.get();

    this.question_id = Number($routeParams.id);
    this.resetSession = Boolean($routeParams.reset_session);

    this.commentsCollapsed = Boolean(this.user.showComments);

    if (!this.question_id) {
      this.$window.location.replace('/questions');
    }

    this.noAnswer = true;
    this.showExplanation = false;

    if (this.resetSession) {
      delete this.collection;
      Collection.remove();
    }

    if (this.collection && Object.keys(this.collection).length) {
      // this.index = this.collection.list.findIndex(e => e.question_id === this.question_id);
      for (let i = 0; i < this.collection.list.length; i++) {
        if (this.collection.list[i].question_id === this.question_id) {
          this.index = i;
          break;
        }
      }

      this.length = this.collection.list.length;
      this.showAnswer = this.collection.list[this.index].mark_answer;
      this.givenResult = this.collection.list[this.index].given_result;
      this.strike = this.collection.list[this.index].strike;
    }

    this.loadQuestion();
  }

  loadQuestion() {
    this.API.get('questions/' + this.question_id + '/user/' + this.user.user_id).success(result => {
      this.question = result.question;
      this.comments = result.comments;

      this.tags = [];
      if (result.tags) {
        this.tags = result.tags.split(',').map(entry => { return { text: entry }; });
      }

      this.checkedAnswer = this.givenResult;

      if (this.showAnswer) {
        this.markAnswer(this.givenResult);
      }
    });
  }

  // If tag field is changed
  updateTags() {
    const string = this.tags.map(entry => entry.text).join(',');
    const data = { tags: string, question_id: this.question_id, user_id: this.user.user_id };
    this.API.post('tags', data, true);
  }

  saveStrike() {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[this.index].strike = this.strike;
      this.Collection.set(this.collection);
    }
  }

  // If show solution button is clicked
  showSolution() {
    const correctAnswer = this.question.correct_answer;
    this.checkedAnswer = correctAnswer;
    let correct = (correctAnswer === this.givenResult) ? 1 : 0;
    if (correctAnswer === 0 || this.question.type === 1) {
      correct = -1;
    }

    const data = {
      correct,
      question_id: this.question_id,
      user_id: this.user.user_id,
      given_result: this.givenResult,
    };
    this.API.post('results', data, true);

    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[this.index].mark_answer = 1;
      this.Collection.set(this.collection);
    }

    this.markAnswer(this.givenResult);
  }

  saveAnswer(givenAnswer) {
    this.givenResult = givenAnswer;

    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[this.index].given_result = this.givenResult;
      this.Collection.set(this.collection);
    }
  }

  // Colors the given answers and shows the correct solution
  markAnswer(givenAnswer) {
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

  addComment() {
    const now = new Date() / 1000;
    const data = { comment: this.commentText, question_id: this.question_id, reply_to: 0, username: this.user.username, date: now };
    this.API.post('comments/' + this.user.user_id, data).success(result => {
      data.voting = 0;
      data.user_voting = 0;
      data.comment_id = result.comment_id;
      this.comments.push(data);
      this.commentText = '';
    });
  }

  deleteComment(index) {
    const commentId = this.comments[index].comment_id;
    this.API.delete('comments/' + commentId);
    this.comments.splice(index, 1);
  }

  changeUserVoting(comment, change) {
    comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
    const data = { user_voting: comment.user_voting };
    this.API.post('comments/' + comment.comment_id + '/user/' + this.user.user_id, data, true);
  }

  openImageModal() {
    this.$uibModal.open({
      templateUrl: 'imageModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: 'ctrl',
      resolve: {
        data: () => {
          return this.question.question_image_url;
        },
      },
    });
  }
}

angular.module('crucioApp').controller('QuestionController', QuestionController);
