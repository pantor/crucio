class ExamController {
  constructor(
    Page, Auth, API, Collection,
    $location, $uibModal, $routeParams, $timeout, $document, $window
  ) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;
    this.$document = $document;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Klausur | Crucio', 'Lernen');

    this.user = Auth.getUser();
    this.examId = $routeParams.id;
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

  loadExam() {
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

  isHalftime(index) {
    return (Math.abs(index + 1 - this.questions.length / 2) < 1) && (index > 3);
  }

  handExam() {
    this.$location.path('/analysis').search('id', null);
  }

  openImageModal(fileName) {
    this.$uibModal.open({
      templateUrl: 'imageModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: 'ctrl',
      resolve: {
        data: () => {
          return fileName;
        },
      },
    });
  }
}

angular.module('crucioApp').component('examcomponent', {
  templateUrl: 'views/exam.html',
  controller: ExamController,
});
