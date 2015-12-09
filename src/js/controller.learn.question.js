class QuestionController {
    constructor(Auth, Page, API, $scope, $routeParams, $location, $window, $uibModal) {
        this.Auth = Auth;
        this.API = API;
        this.$location = $location;
        this.$uibModal = $uibModal;

        Page.setTitleAndNav('Frage | Crucio', 'Lernen');

        this.answerButtonClass = 'btn-primary';

        this.user = Auth.getUser();
        this.questionList = angular.fromJson(sessionStorage.currentQuestionList);

        this.question_id = $routeParams.id;
        this.reset_session = $routeParams.reset_session;

        if (!this.question_id) {
            this.$window.location.replace('/questions');
        }

        this.show_explanation = 0;
        this.given_result = 0;
        this.strike = {};

        if (this.reset_session) {
            this.questionList = {};
            sessionStorage.currentQuestionList = angular.toJson(this.questionList);
        }

        function getIndexBy(array, name, value) {
            for (let i = 0; i < array.length; i++) {
                if (array[i][name] == value) {
                    return i;
                }
            }
        }

        if (this.questionList) {
            if (Object.keys(this.questionList).length) {
                this.index = getIndexBy(this.questionList.list, 'question_id', this.question_id);
                this.length = this.questionList.list.length;
                this.show_answer = this.questionList.list[this.index].mark_answer;
                this.given_result = this.questionList.list[this.index].given_result;
                if (this.questionList.list[this.index].strike) {
                    this.strike = this.questionList.list[this.index].strike;
                }
            }
        }

        $scope.$watch(() => this.strike, (newValue) => {
            if (this.questionList) {
                if (Object.keys(this.questionList).length) {
                    this.questionList.list[this.index].strike = newValue;
                    sessionStorage.currentQuestionList = angular.toJson(this.questionList);
                }
            }
        }, true);

        API.get('questions/' + this.question_id + '/user/' + this.user.user_id).success((result) => {
            this.question = result;

            for (let i = 0; i < this.question.comments.length; i++) {
                this.question.comments[i].voting = (parseInt(this.question.comments[i].voting, 0) || 0);
                this.question.comments[i].user_voting = (parseInt(this.question.comments[i].user_voting, 0) || 0);
            }

            if (this.question.tags) {
                const array = this.question.tags.split(',');
                this.question.tags = [];
                for (const element of array) {
                    this.question.tags.push({ 'text': element });
                }
            } else {
                this.question.tags = [];
            }

            if (this.given_result) {
                this.check_answer(this.given_result);
            }

            if (this.show_answer) {
                this.mark_answer(this.given_result);
            }
        });
    }

    // If tag field is changed
    updateTags() {
        let string = '';
        for (const tag of this.question.tags) {
            string += tag.text + ',';
        }
        string = string.slice(0, -1);

        const data = { 'tags': string, 'question_id': this.question_id, 'user_id': this.user.user_id };
        this.API.post('tags', data);
    }

    // If show solution button is clicked
    show_solution() {
        const correctAnswer = this.correct_answer();
        let correct = (correctAnswer == this.given_result) ? 1 : 0;

        if (correctAnswer === 0) {
            correct = -1;
        }

        if (this.question.type == 1) {
            correct = -1;
        }

        const data = {
            'correct': correct,
            'question_id': this.question_id,
            'user_id': this.user.user_id,
            'given_result': this.given_result,
        };
        this.API.post('results', data);

        if (this.questionList) {
            if (Object.keys(this.questionList).length) {
                this.questionList.list[this.index].mark_answer = 1;
                sessionStorage.currentQuestionList = angular.toJson(this.questionList);
            }
        }

        this.mark_answer(this.given_result);
    }

    // Saves the answer
    save_answer(givenAnswer) {
        this.given_result = givenAnswer;

        if (this.questionList) {
            if (Object.keys(this.questionList).length) {
                this.questionList.list[this.index].given_result = givenAnswer;
                sessionStorage.currentQuestionList = angular.toJson(this.questionList);
            }
        }
    }

    // Checks the answer box
    check_answer(answer) {
        this.checked_answer = answer;
    }

    // Returns correct answer
    correct_answer() {
        return this.question.correct_answer;
    }

    // Colors the given answers and shows the correct solution
    mark_answer(givenAnswer) {
        this.mark_answer_free = true;
        const type = this.question.type;
        const correctAnswer = this.correct_answer();
        if (type > 1) {
            this.check_answer(givenAnswer);

            if (givenAnswer == correctAnswer) {
                this.correctAnswer = givenAnswer;
                this.answerButtonClass = 'btn-success';
            } else {
                this.wrongAnswer = givenAnswer;
                this.correctAnswer = correctAnswer;
                this.answerButtonClass = 'btn-danger';
            }
        } else if (type == 1) {
            this.answerButtonClass = 'btn-info';
        }
    }

    add_comment() {
        const now = new Date() / 1000;
        const data = { 'comment': this.commentText, 'question_id': this.question_id, 'reply_to': 0, 'username': this.user.username, 'date': now };
        this.API.post('comments/' + this.user.user_id, data).success((result) => {
            data.voting = 0;
            data.user_voting = 0;
            data.comment_id = result.comment_id;
            this.question.comments.push(data);
            this.commentText = '';
        });
    }

    delete_comment(index) {
        const commentId = this.question.comments[index].comment_id;
        this.API.delete('comments/' + commentId);
        this.question.comments.splice(index, 1);
    }

    increase_user_voting(currentUserVoting, commentId) {
        const result = Math.min(currentUserVoting + 1, 1);
        const data = { 'user_voting': result };
        this.API.post('comments/' + commentId + '/user/' + this.user.user_id, data);
        return result;
    }

    decrease_user_voting(currentUserVoting, commentId) {
        const result = Math.max(currentUserVoting - 1, -1);
        const data = { 'user_voting': result };
        this.API.post('comments/' + commentId + '/user/' + this.user.user_id, data);
        return result;
    }

    open_image_model() {
        this.$uibModal.open({
            templateUrl: 'imageModalContent.html',
            controller: 'ModalInstanceController',
            controllerAs: 'ctrl',
            resolve: {
                image_url: () => {
                    return this.question.question_image_url;
                },
            },
        });
    }
}

angular.module('learnModule').controller('QuestionController', QuestionController);
