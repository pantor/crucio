import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import PageService from './../../services/page.service';

import { DeleteExamModalComponent } from './delete-exam-modal';

class EditExamController {
  private readonly user: Crucio.User;
  private readonly examId: number;
  private readonly openQuestionId: number;
  private openQuestionIndex: number;
  private numberChanged: number;
  private uploader: any;
  private uploaderArray: any;
  private hasChanged: boolean;
  private subjectList: Crucio.Subject[];
  private exam: Crucio.Exam;
  private questions: Crucio.Question[];
  private ready: boolean;
  private isSaving: boolean;
  private examTypes: string[];
  private subjectListPerId: any;
  private categoryListPerId: any;

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, private readonly FileUploader, $scope: angular.IScope, private readonly $location: angular.ILocationService, private readonly $uibModal: angular.ui.bootstrap.IModalService, $stateParams: angular.ui.IStateParamsService, $transitions) {
    Page.setTitleAndNav('Klausur | Crucio', 'Author');

    this.user = Auth.getUser();
    this.examId = $stateParams.examId;
    this.openQuestionId = parseInt($stateParams.questionId, 0);
    this.openQuestionIndex = -1;
    this.numberChanged = -3; // Works with this number...

    this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
    this.uploader.onSuccessItem = (fileItem, response) => {
      this.exam.file_name = response.upload_name;
    };
    this.uploaderArray = [];

    this.examTypes = [
      'Erstklausur',
      'Wiederholungsklausur',
      'Leistungskontrolle',
      'Fragensammlung',
      'Testat',
      'Sonstiges',
    ];


    $scope.$watch(() => this.exam, () => {
      this.hasChanged = (this.numberChanged > 0);
      this.numberChanged += 1;
    }, true);

    $scope.$watch(() => this.questions, () => {
      this.hasChanged = (this.numberChanged > 0);
      this.numberChanged += 1;
    }, true);

    $transitions.onStart( { from: 'edit-exam' }, () => {
      if (this.hasChanged) {
        const confirmClose = confirm(
          'Die Änderungen an der Klausur bleiben dann ungespeichert. Wirklich verlassen?'
        );
        if (!confirmClose) {
          event.preventDefault();
        }
      }
    });

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
      this.subjectListPerId = {};
      this.categoryListPerId = {};

      for (const subject of this.subjectList) {
        this.subjectListPerId[subject.subject_id] = subject.subject;
        this.categoryListPerId[subject.subject_id] = subject.categories;
        this.categoryListPerId[subject.subject_id].unshift({category_id: 0, category: 'Sonstiges'});
      }
    });

    this.API.get(`exams/${this.examId}`).then(result => {
      this.exam = result.data.exam;
      this.questions = result.data.questions;

      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].question_id === this.openQuestionId) {
          this.openQuestionIndex = i;
          break;
        }
      }

      this.remakeUploaderArray();

      if (this.questions.length === 0) {
        this.addQuestion(false);
      }

      this.ready = true;
    });
  }

  remakeUploaderArray(): void {
    this.uploaderArray = [];
    for (let i = 0; i < this.questions.length; i++) {
      const uploader = new this.FileUploader({ url: '/api/v1/file/upload', formData: i });
      uploader.onSuccessItem = (fileItem, response) => {
        const index: number = fileItem.formData;
        this.questions[index].question_image_url = response.upload_name;
      };
      this.uploaderArray.push(uploader);
    }
  }

  addQuestion(show: boolean): void {
    const question = {
      category_id: 0,
      question: '',
      type: 5,
      correct_answer: 0,
      answers: ['', '', '', '', '', ''],
    };

    this.questions.push(question);
    if (show) {
      this.openQuestionIndex = this.questions.length - 1;
    }

    this.remakeUploaderArray();
  }

  deleteQuestion(index: number): void {
    const questionId = this.questions[index].question_id;

    if (questionId) {
      this.API.delete(`questions/${questionId}`);
    }

    this.questions.splice(index, 1);
    this.openQuestionIndex = Math.min(this.openQuestionIndex, this.questions.length - 1);

    this.remakeUploaderArray();

    if (!this.questions) {
      this.addQuestion(true);
    }
  }

  saveExam(): void {
    const validate = this.exam.subject_id
      && this.exam.semester > 0
      && this.exam.semester <= 50
      && this.exam.date;

    if (validate) {
      this.isSaving = true;
      const data = { exam: this.exam, questions: this.questions, user_id: this.user.user_id };
      this.API.put(`exams/${this.examId}`, data).then(result => {
        if (!result.data.status) {
          alert('Fehler beim Speichern der Klausur.');

        } else {
          for (let i = 0; i < result.data.question_id_list.length; i++) {
            this.questions[i].question_id = result.data.question_id_list[i];
          }
        }
      });

      this.hasChanged = false;
      this.numberChanged = 0;
      this.isSaving = false;
    } else {
      alert('Es fehlen noch allgemeine Infos zur Klausur.');
    }
  }

  deleteExamModal(): void {
    this.$uibModal.open({
      component: DeleteExamModalComponent,
      resolve: {
        examId: () => this.examId,
      },
    });
  }
}

export const EditExamComponent = 'editExamComponent';
app.component(EditExamComponent, {
  templateUrl: 'app/author/edit-exam/edit-exam.html',
  controller: EditExamController,
});
