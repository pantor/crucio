class ExamController {
    constructor(Page, Auth, API, $location, $uibModal, $routeParams, $timeout, $document) {
        this.API = API;
        this.$location = $location;
        this.$document = $document;
        this.$uibModal = $uibModal;
        this.Math = Math;

        Page.setTitleAndNav('Klausur | Crucio', 'Lernen');

        this.user = Auth.getUser();
        this.exam_id = $routeParams.id;
        this.questionList = { 'exam_id': this.exam_id, 'list': [] };

        this.current_index = 0;

        this.API.get('exams/' + this.exam_id).success((result) => {
            this.exam = result;

            for (const question of this.exam.questions) {
                this.questionList.list.push(question);
            }
        });

        $document.on('scroll', () => {
            const positionTop = $document.scrollTop();
            for (let i = 0; i < this.exam.questions.length; i++) {
                const question = angular.element(document.getElementById('id' + i));
                if (question.prop('offsetTop') > positionTop) {
                    $timeout(() => {
                        this.current_index = Math.max(i - 1, 0);
                    }, 0);
                    break;
                }
            }
        });
    }

    save_answer(question_i, given_answer) {
        this.questionList.list[question_i].given_result = String(given_answer);
    }

    scroll_to_top() {
        this.$document.scrollTopAnimated(0, 400);
    }

    hand_exam() {
        sessionStorage.currentQuestionList = angular.toJson(this.questionList);
        this.$location.path('/analysis').search('id', null);
    }

    open_image_model(file_name) {
        this.$uibModal.open({
            templateUrl: 'imageModalContent.html',
            controller: 'ModalInstanceController',
            controllerAs: 'ctrl',
            resolve: {
                image_url: () => {
                    return file_name;
                },
            },
        });
    }
}

angular.module('learnModule').controller('ExamController', ExamController);
