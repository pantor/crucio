import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Quill from 'quill';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthorDeleteExamModalComponent } from './author-delete-exam-modal/author-delete-exam-modal.component';

@Component({
  selector: 'app-author-edit-exam',
  templateUrl: './author-edit-exam.component.html',
  styleUrls: ['./author-edit-exam.component.scss'],
  providers: [ToastService]
})
export class AuthorEditExamComponent implements OnInit {
  exam: Crucio.Exam;
  readonly user: Crucio.User;
  examId: number;
  openQuestionId: number;
  openQuestionIndex = -1;
  subjectList: Crucio.Subject[];
  questions: Crucio.Question[];
  examTypes: string[] = [
      'Erstklausur',
      'Wiederholungsklausur',
      'Leistungskontrolle',
      'Fragensammlung',
      'Testat',
      'Sonstiges',
    ];
  questionEditor: Quill.Quill;
  explanationEditor: Quill.Quill;
  answerEditor0: Quill.Quill;
  answerEditor1: Quill.Quill;
  answerEditor2: Quill.Quill;
  answerEditor3: Quill.Quill;
  answerEditor4: Quill.Quill;
  answerEditor5: Quill.Quill;
  subjectListPerId: any;
  categoryListPerId: any;
  currentSelectedAnswer = 0;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService, private modal: NgbModal, private route: ActivatedRoute) {
    window.document.title = 'Klausur | Crucio';

    this.user = this.auth.getUser();

    this.route.queryParams.subscribe(params => {
      this.examId = +params['examId'] || -1;
      this.openQuestionId = +params['openQuestionId'];

      this.api.get('subjects').subscribe(result => {
        this.subjectList = result.subjects;
        this.subjectListPerId = {};
        this.categoryListPerId = {};

        for (const subject of this.subjectList) {
          this.subjectListPerId[subject.subject_id] = subject.subject;
          this.categoryListPerId[subject.subject_id] = subject.categories;
          this.categoryListPerId[subject.subject_id].unshift({category_id: 0, category: 'Sonstiges'});
        }
      });

      this.api.get(`exams/${this.examId}`).subscribe(result => {
        this.exam = result.exam;
        this.questions = result.questions;

        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].question_id === this.openQuestionId) {
            this.openQuestionIndex = i;
            break;
          }
        }

        if (this.questions.length === 0) {
          this.addQuestion(false);
        }
      });
    });
  }

  ngOnInit() { }

  getRange(start: number, end: number) {
    const list = [];
    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }

  setAnswerEditor(instance: Quill.Quill, index: number) {
    if (index === 0) {
      this.answerEditor0 = instance;
    } else if (index === 1) {
      this.answerEditor1 = instance;
    } else if (index === 2) {
      this.answerEditor2 = instance;
    } else if (index === 3) {
      this.answerEditor3 = instance;
    } else if (index === 4) {
      this.answerEditor4 = instance;
    } else if (index === 5) {
      this.answerEditor5 = instance;
    }
  }

  getAnswerEditor(index: number) {
    if (index === 0) {
      return this.answerEditor0;
    } else if (index === 1) {
      return this.answerEditor1;
    } else if (index === 2) {
      return this.answerEditor2;
    } else if (index === 3) {
      return this.answerEditor3;
    } else if (index === 4) {
      return this.answerEditor4;
    } else if (index === 5) {
      return this.answerEditor5;
    }
  }

  addCharacter(editor: Quill.Quill, char: string): void {
    const range = editor.getSelection();
    if (range) {
      editor.insertText(range.index, char);
    }
  }

  addQuestion(show: boolean): void {
    const question: Crucio.Question = {
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
  }

  deleteQuestion(index: number): void {
    const questionId = this.questions[index].question_id;

    if (questionId) {
      this.api.delete(`questions/${questionId}`).subscribe(() => { });
    }

    this.questions.splice(index, 1);
    this.openQuestionIndex = Math.min(this.openQuestionIndex, this.questions.length - 1);

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
      const data = { exam: this.exam, questions: this.questions, user_id: this.user.user_id };
      this.api.put(`exams/${this.examId}`, data).subscribe(result => {
        if (result.status) {
          for (let i = 0; i < result.question_id_list.length; i++) {
            this.questions[i].question_id = result.question_id_list[i];
          }

          this.toast.new('Gespeichert');
        } else {
          this.toast.new('Fehler');
        }
      });
    } else {
      this.toast.new('Unvollständig');
    }
  }

  fileChangeExam(event): void {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.api.upload( fileList[0] ).subscribe(result => {
        this.exam.file_name = result.filename;
        if (result.status) {
          this.toast.new('Hochgeladen, bitte noch speichern.');
        } else {
          this.toast.new('Fehler');
        }
      });
    }
  }

  fileChangeQuestion(index: number, event): void {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.api.upload( fileList[0] ).subscribe(result => {
        this.questions[index].question_image_url = result.filename;
        if (result.status) {
          this.toast.new('Hochgeladen, bitte noch speichern.');
        } else {
          this.toast.new('Fehler');
        }
      });
    }
  }

  deleteDocumentExam(): void {
    this.exam.file_name = '';
  }

  deleteDocumentQuestion(index: number): void {
    this.questions[index].question_image_url = '';
  }

  deleteExamModal(): void {
    const modalRef = this.modal.open(AuthorDeleteExamModalComponent);
    modalRef.componentInstance.examId = this.examId;
  }
}
