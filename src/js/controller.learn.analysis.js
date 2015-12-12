class AnalysisController {
    constructor(Page, Auth, API, Analysis) {
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

        this.random = this.get_random(0, 1000);

        this.exam_id = this.questionList.exam_id;
        this.workedQuestionList = Analysis.getWorkedQuestionList(this.questionList);

        const analysisResult = Analysis.analzyseQuestionList(this.workedQuestionList);
        this.correct_q_count = analysisResult.correct_q_count;
        this.wrong_q_count = analysisResult.wrong_q_count;
        this.seen_q_count = analysisResult.seen_q_count;
        this.solved_q_count = analysisResult.solved_q_count;
        this.free_q_count = analysisResult.free_q_count;
        this.no_answer_q_count = analysisResult.no_answer_q_count;
        this.all_question_count = this.questionList.list.length;
        this.worked_question_count = this.workedQuestionList.length;

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
