class EditExamController {
  constructor(Page, Auth, API, FileUploader, $scope, $location, $routeParams) {
    this.API = API;
    this.FileUploader = FileUploader;
    this.$location = $location;

    Page.setTitleAndNav('Klausur | Crucio', 'Autor');

    this.user = Auth.getUser();
    this.examId = $routeParams.id;
    this.openQuestionId = $routeParams.question_id;
    this.openQuestionIndex = -1;
    this.numberChanged = 0;

    this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
    this.uploader.onSuccessItem = (fileItem, response) => {
      this.exam.file_name = response.upload_name;
    };
    this.uploaderArray = [];


    $scope.$watch(() => this.exam, () => {
      this.hasChanged = (this.numberChanged > 1);
      this.numberChanged += 1;
    }, true);

    $scope.$on('$locationChangeStart', event => {
      if (this.hasChanged) {
        const confirmClose = confirm(
          'Die Änderungen an der Klausur bleiben dann ungespeichert. Wirklich verlassen?'
        );
        if (!confirmClose) {
          event.preventDefault();
        }
      }
    });

    this.API.get('subjects').success(result => {
      this.subject_list = result.subjects;
    });

    this.loadExam();
  }

  loadExam() {
    this.API.get('exams/' + this.examId).success(result => {
      this.exam = result.exam;
      this.questions = result.questions;

      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].question_id === this.openQuestionId) {
          this.openQuestionIndex = i;
        }
      }

      this.remakeUploaderArray();

      if (this.questions.length === 0) {
        this.addQuestion(false);
      }

      this.ready = true;
    });
  }

  getCategories(subjectId) {
    for (const e of this.subject_list) {
      if (e.subject_id === subjectId) {
        return e.categories;
      }
    }
  }

  remakeUploaderArray() {
    this.uploaderArray = [];
    for (let i = 0; i < this.questions.length; i++) {
      const uploader = new this.FileUploader({ url: '/api/v1/file/upload', formData: i });
      uploader.onSuccessItem = (fileItem, response) => {
        const index = fileItem.formData;
        this.questions[index].question_image_url = response.upload_name;
      };
      this.uploaderArray.push(uploader);
    }
  }

  addQuestion(show) {
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

  deleteQuestion(index) {
    const questionId = this.questions[index].question_id;

    if (questionId) {
      this.API.delete('questions/' + questionId);
    }

    this.questions.splice(index, 1);
    this.openQuestionIndex = Math.min(this.openQuestionIndex, this.questions.length - 1);

    this.remakeUploaderArray();

    if (!this.questions) {
      this.addQuestion(1);
    }
  }

  saveExam() {
    const validate = this.exam.subject_id
      && this.exam.semester > 0
      && this.exam.semester <= 50
      && this.exam.date;

    if (validate) {
      this.isSaving = true;
      this.API.put('exams/' + this.examId, this.exam);

      for (const q of this.questions) {
        const validateQuestion = q.question
          || q.question_id;

        if (validateQuestion) {
          q.explanation = q.explanation || '';
          q.question_image_url = q.question_image_url || '';

          const data = {
            exam_id: this.exam.exam_id,
            user_id_added: this.user.user_id,
            category_id: q.category_id,
            question: q.question,
            type: q.type,
            answers: q.answers,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            question_image_url: q.question_image_url,
          };

          if (!q.question_id) { // New question
            this.API.post('questions', data).success(result => {
              q.question_id = result.question_id;
            });
          } else {
            this.API.put('questions/' + q.question_id, data);
          }
        }
      }

      this.hasChanged = false;
      this.isSaving = false;
    } else {
      alert('Es fehlen noch allgemeine Infos zur Klausur.');
    }
  }

  deleteExam() {
    this.API.delete('exams/' + this.exam.exam_id).success(() => {
      this.$location.url('/author');
    });
  }
}

angular.module('crucioApp').controller('EditExamController', EditExamController);
