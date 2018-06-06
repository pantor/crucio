import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Collection, CollectionService } from '../../services/collection.service';
import { Toast, ToastService } from '../../services/toast.service';
import { LearnImageModalComponent } from '../learn-image-modal/learn-image-modal.component';
import { LearnReportModalComponent } from '../learn-report-modal/learn-report-modal.component';

interface QuestionExam extends Crucio.Question, Crucio.Exam {
  professor: string;
  notes: string;
  subject: string;
}

@Component({
  selector: 'app-learn-question',
  templateUrl: './learn-question.component.html',
  styleUrls: ['./learn-question.component.scss'],
  providers: [CollectionService, ToastService]
})
export class LearnQuestionComponent implements OnInit {
  question: QuestionExam;
  questionData: Crucio.CollectionListItem;
  comments: Crucio.Comment[] = [];
  tags: any;
  readonly user: Crucio.User;
  index: number;
  questionId: number;
  preQuestionId: number;
  postQuestionId: number;
  length: number;
  noAnswer = true;
  showExplanation = false;
  commentText: string;
  commentsCollapsed: boolean;
  checkedAnswer: any;
  correctAnswer: number;
  wrongAnswer: number;
  isAnswerGiven = false;
  isAnswerRight = false;
  isAnswerWrong = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private collection: CollectionService,
    private toast: ToastService,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {

    window.document.title = 'Frage | Crucio';
    this.user = this.auth.getUser();

    // Component is not refreshed if only queryParams change...
    this.route.queryParams.subscribe(params => {
      this.questionId = +params['questionId'] || -1;
      const reset = +params['resetSession'] || 0;

      if (this.questionId === -1) {
        this.router.navigate(['/app/learn/overview']);
      }

      this.commentsCollapsed = !Boolean(this.user.showComments);

      this.api.get(`questions/${this.questionId}/user/${this.user.user_id}`).subscribe(result => {
        this.reset();

        this.question = result.question;
        this.comments = result.comments;

        this.tags = [];
        if (result.tags) {
          this.tags = result.tags.split(',').map(entry => ({ display: entry, value: entry }));
        }

        if (reset) {
          this.collection.deleteLocal();
          this.index = -1;
          this.questionData = { question_id: this.questionId, given_result: undefined, mark_answer: undefined, strike: undefined };
        } else {
          this.index = this.collection.getIndexOfQuestion(this.questionId);
          if (this.index > -1) {
            this.questionData = this.collection.getQuestionData(this.index);
            this.length = this.collection.getLength();
            this.preQuestionId = this.index > 0 ? this.collection.getQuestionData(this.index - 1).question_id : this.questionId;
            this.postQuestionId = this.index < this.length - 1 ? this.collection.getQuestionData(this.index + 1).question_id : this.questionId;
          } else {
            this.router.navigate(['/app/learn/overview']);
          }
        }

        this.checkedAnswer = this.questionData.given_result;

        if (this.questionData.mark_answer) {
          this.markAnswer(this.questionData.given_result);
        }
      });
    });
  }

  ngOnInit() { }

  reset() {
    this.noAnswer = true;
    this.showExplanation = false;
    this.checkedAnswer = undefined;
    this.correctAnswer = undefined;
    this.wrongAnswer = undefined;
    this.isAnswerGiven = false;
    this.isAnswerRight = false;
    this.isAnswerWrong = false;
  }

  goToQuestion(index: number): void {
    this.router.navigate(['/app/question'], { queryParams: { questionId: index } });
  }

  // If tag field is changed
  updateTags($tag: any): void {
    const string: string = this.tags.map(entry => entry.value).join(',');
    const data = { tags: string, question_id: this.questionId, user_id: this.user.user_id };
    this.api.post('tags', data).subscribe(() => { });
  }

  setAnswer(givenAnswer: number): void {
    this.questionData.given_result = givenAnswer;
    this.collection.setAnswer(this.index, givenAnswer);
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
    this.api.post('results', data).subscribe(() => { });

    this.collection.setMarkAnswer(this.index);
    this.markAnswer(this.questionData.given_result);
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

  setStrike(index: number): void {
    if (!this.questionData.strike) {
      this.questionData.strike = [false, false, false, false, false, false];
    }

    this.questionData.strike[index] = !this.questionData.strike[index];
    this.collection.setStrike(this.index, this.questionData.strike);
  }

  addComment(): void {
    const now = +new Date() / 1000;
    const data: Crucio.Comment = {
      comment: this.commentText,
      question_id: this.questionId,
      reply_to: 0,
      username: this.user.username,
      user_id: this.user.user_id,
      date: now,
    };
    this.api.post(`comments/${this.user.user_id}`, data).subscribe(result => {
      data['voting'] = 0;
      data['user_voting'] = 0;
      data['comment_id'] = result.comment_id;
      this.comments.push(data);
      this.commentText = '';
    });
  }

  deleteComment(index: number): void {
    const commentId = this.comments[index].comment_id;
    this.api.delete(`comments/${commentId}`).subscribe(() => { });
    this.comments.splice(index, 1);
  }

  changeUserVoting(comment: Crucio.Comment, change: number): void {
    comment.user_voting = Math.min(Math.max(comment.user_voting + change, -1), 1);
    const data = { user_voting: comment.user_voting };
    this.api.post(`comments/${comment.comment_id}/user/${this.user.user_id}`, data).subscribe(() => { });
  }

  save(): void {
    this.collection.saveRemote().subscribe(result => {
      if (result.status) {
        this.toast.new('Gespeichert');
      } else {
        this.toast.new('Fehler');
      }
    });
  }

  openImageModal(): void {
    const modalRef = this.modal.open(LearnImageModalComponent);
    modalRef.componentInstance.filename = this.question.question_image_url;
  }

  openReportModal(): void {
    const modalRef = this.modal.open(LearnReportModalComponent);
    modalRef.componentInstance.question = this.question;
    modalRef.componentInstance.user = this.user;
  }
}
