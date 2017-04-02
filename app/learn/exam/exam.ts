class ExamController {
  private readonly user: Crucio.User;
  private combination: Crucio.CombinationElement[];
  private currentIndex: number;
  private length: number;
  private questions: Crucio.Question[];

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService,
    private readonly $state: angular.ui.IStateService, private readonly $uibModal: angular.ui.bootstrap.IModalService, $stateParams, $timeout: angular.ITimeoutService, private readonly $document: angular.IDocumentService, $window: angular.IWindowService) {
    Page.setTitleAndNav('Klausur | Crucio', 'Learn');

    this.user = Auth.getUser();
    this.Collection.loadCombinedListAndQuestions(this.Collection.getList()).then(result => {
      this.combination = result;
    });
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
  }

  currentQuestion(): Crucio.Question {
    return this.Collection.getQuestion(this.currentIndex);
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
