import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';
import PageService from './../../services/page.service';

import { ImageModalComponent } from './../../components/image-modal/image-modal';
import { ReportModalComponent } from './../../components/report-modal/report-modal';

class QuestionController {
  private readonly user: Crucio.User;
  private readonly questionId: number;
  private readonly resetSession: boolean;
  private question: Crucio.Question;
  private comments: Crucio.Comment[];
  private tags: any;
  private commentsCollapsed: boolean;
  private noAnswer: boolean;
  private showExplanation: boolean;
  private index: number;
  private questionData: Crucio.CollectionListItem;
  private length: number;
  private preQuestionId: number;
  private postQuestionId: number;
  private checkedAnswer: number;
  private correctAnswer: number;
  private isAnswerGiven: boolean;
  private isAnswerRight: boolean;
  private isAnswerWrong: boolean;
  private commentText: string;
  private wrongAnswer: number;

  constructor(private readonly Auth: AuthService, Page: PageService, private readonly API: APIService, private readonly Collection: CollectionService, $stateParams, $window: angular.IWindowService, private readonly $uibModal: angular.ui.bootstrap.IModalService) {
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
      this.Collection.deleteLocal();
      this.index = -1;
      this.questionData = { question_id: this.questionId, given_result: undefined, mark_answer: undefined, strike: undefined };
    } else {
      this.index = this.Collection.getIndexOfQuestion(this.questionId);
      if (this.index > -1) {
        this.questionData = this.Collection.getQuestionData(this.index);
        this.length = this.Collection.getLength();
        this.preQuestionId = this.index > 0 ? this.Collection.getQuestionData(this.index - 1).question_id : this.questionId;
        this.postQuestionId = this.index < this.length - 1 ? this.Collection.getQuestionData(this.index + 1).question_id : this.questionId;
      } else {
        alert('Fehler: Konnte die Frage nicht finden.');
        $window.location.replace('/learn/overview');
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

      this.checkedAnswer = this.questionData.given_result;

      if (this.questionData.mark_answer) {
        this.markAnswer(this.questionData.given_result);
      }
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
    let correct = (correctAnswer === this.questionData.given_result) ? 1 : 0;
    if (correctAnswer === 0 || this.question.type === 1) {
      correct = -1;
    }

    const data = {
      correct,
      question_id: this.questionId,
      user_id: this.user.user_id,
      given_result: this.questionData.given_result,
    };
    this.API.post('results', data);

    this.Collection.setMarkAnswer(this.index);
    this.markAnswer(this.questionData.given_result);
  }

  setAnswer(givenAnswer: number): void {
    this.questionData.given_result = givenAnswer;
    this.Collection.setAnswer(this.index, givenAnswer);
  }

  // Colors the given answers and shows the correct solution
  markAnswer(givenAnswer: number): void {
    this.isAnswerGiven = true;
    if (this.question.type > 1) {
      this.correctAnswer = this.question.correct_answer;
      this.checkedAnswer = givenAnswer > 0 ? givenAnswer : this.correctAnswer;

      this.isAnswerRight = (givenAnswer === this.correctAnswer);
      this.isAnswerWrong = (givenAnswer !== this.correctAnswer);

      if (givenAnswer !== this.correctAnswer) {
        this.wrongAnswer = givenAnswer;
      }
    }
  }

  setStrike(strike: boolean[]): void {
    this.Collection.setStrike(this.index, strike);
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
    this.API.post(`comments/${comment.comment_id}/user/${this.user.user_id}`, data);
  }

  openImageModal(): void {
    this.$uibModal.open({
      component: ImageModalComponent,
      resolve: {
        data: () => this.question.question_image_url,
      },
    });
  }

  openReportModal(): void {
    this.$uibModal.open({
      component: ReportModalComponent,
      resolve: {
        question: () => this.question,
        questionId: () => this.questionId,
      },
    });
  }
}

export const QuestionComponent = 'questionComponent';
app.component(QuestionComponent, {
  templateUrl: 'app/learn/question/question.html',
  controller: QuestionController,
});
