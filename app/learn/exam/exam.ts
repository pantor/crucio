class ExamController {
  private readonly user: Crucio.User;
  private currentIndex: number;
  private length: number;
  private questions: Crucio.Question[];

  constructor(
    Page: PageService, Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService,
    private readonly $state: angular.ui.IStateService, private readonly $uibModal: angular.ui.bootstrap.IModalService, $stateParams, $timeout: angular.ITimeoutService, private readonly $document: angular.IDocumentService, $window: angular.IWindowService
  ) {
    Page.setTitleAndNav('Klausur | Crucio', 'Learn');

    this.user = Auth.getUser();
    this.Collection.loadQuestions();
    this.length = this.Collection.getLength();

    this.currentIndex = 0;

    $document.on('scroll', () => {
      const positionTop = $document.scrollTop();

      const isIdAbovePosition = (i: number) => {
        const question = angular.element($window.document.getElementById(`id${i}`));
        if (question.prop('offsetTop') > positionTop) {
          $timeout(() => {
            this.currentIndex = Math.max(i - 1, 0);
          }, 0);
          return true;
        }
        return false;
      };

      for (let i = 0; i < this.length; i++) {
        if (isIdAbovePosition(i)) {
          break;
        }
      }

      /* this.currentIndex = this.collection.list.findIndex(e => {
        const question = angular.element($window.document.getElementById('id' + i));
        return (question.prop('offsetTop') > positionTop);
      }); */
    });

    /* if (this.Collection.getType() == 'exam') {
      this.API.get(`exams/${this.Collection.getExamId()}`).then(result => {
        this.exam = result.data.exam;
      });
    } */
  }

  currentQuestion(): Crucio.Question {
    return this.Collection.getQuestion(this.currentIndex);
  }

  handExam(): void {
    this.$state.go('analysis');
  }

  openImageModal(fileName: string): void {
    this.$uibModal.open({
      component: 'imageModalComponent',
      resolve: {
        data: () => fileName,
      },
    });
  }
}

angular.module('crucioApp').component('examcomponent', {
  templateUrl: 'app/learn/exam/exam.html',
  controller: ExamController,
});
