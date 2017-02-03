class ExamController {
  readonly API: API;
  Collection: Collection;
  $location: angular.ILocationService;
  $document: any;
  $uibModal: angular.ui.bootstrap.IModalService;
  user: Crucio.User;
  examId: number;
  currentIndex: number;
  exam: Crucio.Exam;
  length: number;
  questions: Crucio.Question[];

  constructor(
    Page: Page, Auth: Auth, API: API, Collection: Collection,
    $location: angular.ILocationService, $uibModal: angular.ui.bootstrap.IModalService, $stateParams, $timeout: angular.ITimeoutService, $document, $window
  ) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;
    this.$document = $document;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Klausur | Crucio', 'Learn');

    this.user = Auth.getUser();
    this.examId = $stateParams.examId;
    this.currentIndex = 0;

    $document.on('scroll', () => {
      const positionTop = $document.scrollTop();

      const isIdAbovePosition = (i) => {
        const question = angular.element($window.document.getElementById(`id${i}`));
        if (question.prop('offsetTop') > positionTop) {
          $timeout(() => {
            this.currentIndex = Math.max(i - 1, 0);
          }, 0);
          return true;
        }
        return false;
      };

      for (let i = 0; i < this.Collection.get().list.length; i++) {
        if (isIdAbovePosition(i)) {
          break;
        }
      }

      /* this.currentIndex = this.collection.list.findIndex(e => {
        const question = angular.element($window.document.getElementById('id' + i));
        return (question.prop('offsetTop') > positionTop);
      }); */
    });

    this.loadExam();
  }

  loadExam(): void {
    this.API.get(`exams/${this.examId}`).then(result => {
      this.exam = result.data.exam;
      this.length = result.data.questions.length;
      this.Collection.set({
        type: 'exam',
        exam_id: this.examId,
        list: result.data.questions,
      });
    });
  }

  handExam(): void {
    this.$location.path('/analysis').search('id', null);
  }

  openImageModal(fileName: string): void {
    this.$uibModal.open({
      templateUrl: 'imageModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: '$ctrl',
      resolve: {
        data: () => {
          return fileName;
        },
      },
    });
  }
}

angular.module('crucioApp').component('examcomponent', {
  templateUrl: 'app/learn/exam/exam.html',
  controller: ExamController,
});
