class AnalysisController {
    constructor(Page, Auth, API) {
        this.API = API;

        Page.setTitleAndNav('Analyse | Crucio', 'Lernen');

        this.user = Auth.getUser();
        this.questionList = angular.fromJson(sessionStorage.currentQuestionList);

        // Post results
        for (const question of this.questionList.list) {
            if (!question.mark_answer) { // Don't save results again, they were saved during the question page
                if (question.type > 1) { // Don't save free questions
                    if (question.given_result > 0) {
                        let correct = (question.correct_answer == question.given_result) ? 1 : 0;
                        if (question.correct_answer === 0) {
                            correct = -1;
                        }

                        if (question.question.type == 1) {
                            correct = -1;
                        }

                        const data = {
                            'correct': correct,
                            'question_id': question.question_id,
                            'user_id': this.user.user_id,
                            'given_result': question.given_result,
                        };
                        this.API.post('results', data);
                    }
                }
                // question.mark_answer = 'analysis';
            }
        }

        function getArrayByKey(array, name) {
            const result = [];
            for (const e of array) {
                if (e[name]) {
                    result.push(e);
                }
            }
            return result;
        }

        this.get_random = function (min, max) {
            if (min > max) {
                return -1;
            }

            if (min == max) {
                return min;
            }

            let r;
            do {
                r = Math.random();
            } while (r == 1.0);

            return min + parseInt(r * (max - min + 1), 0);
        };

        this.workedQuestionList = getArrayByKey(this.questionList.list, 'given_result');
        this.exam_id = this.questionList.exam_id;

        this.all_question_count = this.questionList.list.length;
        this.worked_question_count = this.workedQuestionList.length;

        this.correct_q_count = 0;
        this.wrong_q_count = 0;
        this.seen_q_count = 0;
        this.solved_q_count = 0;
        this.free_q_count = 0;
        this.no_answer_q_count = 0;

        this.random = this.get_random(0, 1000);

        for (const question2 of this.workedQuestionList) {
            if (question2.correct_answer == question2.given_result && question2.given_result > 0 && question2.correct_answer > 0) {
                this.correct_q_count++;
            }

            if (question2.correct_answer != question2.given_result && question2.given_result > 0 && question2.correct_answer > 0) {
                this.wrong_q_count++;
            }

            if (question2.given_result > 0) {
                this.solved_q_count++;
            }

            if (question2.given_result > -2) {
                this.seen_q_count++;
            }

            if (question2.type == 1) {
                this.free_q_count++;
            }

            if (question2.correct_answer === 0 && question2.type != 1) {
                this.no_answer_q_count++;
            }
        }

        if (this.exam_id) {
            this.API.get('exams/' + this.exam_id).success((result) => {
                this.exam = result;
            });
        }
    }

    showCorrectAnswerClicked(index) {
        this.workedQuestionList[index].show_correct_answer = 1;
    }
}

angular.module('learnModule').controller('AnalysisController', AnalysisController);
