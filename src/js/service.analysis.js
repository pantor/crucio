class Analysis {
    constructor() {

    }

    getWorkedQuestionList(questionList) {
        function getArrayByKey(array, name) {
            const result = [];
            for (const e of array) {
                if (e[name]) {
                    result.push(e);
                }
            }
            return result;
        }

        return getArrayByKey(questionList.list, 'given_result');
    }

    analzyseQuestionList(questionList) {
        const result = {
            correct_q_count: 0,
            wrong_q_count: 0,
            seen_q_count: 0,
            solved_q_count: 0,
            free_q_count: 0,
            no_answer_q_count: 0,
        };

        for (const question of questionList) {
            if (question.correct_answer == question.given_result && question.given_result > 0 && question.correct_answer > 0) {
                result.correct_q_count++;
            }

            if (question.correct_answer != question.given_result && question.given_result > 0 && question.correct_answer > 0) {
                result.wrong_q_count++;
            }

            if (question.given_result > 0) {
                result.solved_q_count++;
            }

            if (question.given_result > -2) {
                result.seen_q_count++;
            }

            if (question.type == 1) {
                result.free_q_count++;
            }

            if (question.correct_answer === 0 && question.type != 1) {
                result.no_answer_q_count++;
            }
        }

        return result;
    }
}

angular.module('crucioApp').service('Analysis', Analysis);
