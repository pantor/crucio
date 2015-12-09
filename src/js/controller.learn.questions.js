class QuestionsController {
    constructor(Auth, Page, API, Selection, $scope, $location) {
        this.API = API;
        this.Selection = Selection;
        this.$location = $location;

        Page.setTitleAndNav('Lernen | Crucio', 'Lernen');

        this.user = Auth.getUser();

        this.exam_search = { 'subject': '', 'semester': '', 'query': '', 'query_keys': ['subject', 'semester', 'date'] };
        this.comment_search = { 'query': '', 'query_keys': ['comment', 'username', 'question_id'] };
        this.tag_search = { 'query': '', 'query_keys': ['tag'] };

        this.subject_list = subject_list;

        this.question_field_message = '';

        this.selection_subject_list = {};
        this.selection_number_questions = 0;
        this.number_questions_in_choosen_subjects = 0;
        this.conditions = 1;

        this.show_spinner = false;
        this.slider_options = { floor: 0, ceil: this.number_questions_in_choosen_subjects };

        $scope.$watch(() => this.selection_subject_list, () => {
            const data = { ignoreLoadingBar: true, selection_subject_list: this.selection_subject_list };
            this.API.post('learn/number-questions', data).success((result) => {
                this.number_questions_in_choosen_subjects = result.number_questions;

                if (this.selection_number_questions === 0) {
                    this.selection_number_questions = Math.min(this.number_questions_in_choosen_subjects, 50);
                }

                if (this.selection_number_questions > this.number_questions_in_choosen_subjects) {
                    this.selection_number_questions = this.number_questions_in_choosen_subjects;
                }
            });
        }, true);

        $scope.$watch(() => this.number_questions_in_choosen_subjects, () => {
            let max = this.number_questions_in_choosen_subjects;
            if (max > 200) {
                max = 200;
            }

            let step = 10;
            if (max < 100) {
                step = 10;
            }
            if (max < 40) {
                step = 4;
            }
            if (max < 20) {
                step = 1;
            }

            if (max < 200) {
                if (max % step !== 0) {
                    max += step;
                }
            }

            this.slider_options = { floor: 0, ceil: max };
        }, true);

        this.API.get('exams/user_id/' + this.user.user_id).success((result) => {
            this.exams = result.exam;
            this.distinct_semesters = Selection.findDistinct(this.exams, 'semester');
            this.distinct_subjects = Selection.findDistinct(this.exams, 'subject');

            // Find Exams for Abstract
            this.abstract_exams = [];
            for (const entry of this.exams) {
                let select = true;

                if (entry.semester != this.user.semester) {
                    select = false;
                }

                if (entry.date == 'unbekannt') {
                    select = false;
                }

                if (this.exams.length > 10) {
                    if (entry.question_count < 30) {
                        select = false;
                    }
                }

                if (entry.answered_questions > 0) {
                    select = true;
                }

                if (select) {
                    if (entry.answered_questions > 0) {
                        this.abstract_exams.unshift(entry);
                    } else {
                        this.abstract_exams.push(entry);
                    }
                }
            }

            this.ready = 1;
        });

        const data = { 'user_id': this.user.user_id };
        this.API.get('tags', data).success((result) => {
            this.tags = result.tags;

            this.distinct_tags = [];
            for (const entry of this.tags) {
                for (const tagText of entry.tags.split(',')) {
                    if (this.distinct_tags.indexOf(tagText) == -1) {
                        this.distinct_tags.push(tagText);
                    }
                }
            }

            this.questions_by_tag = {};
            for (const distinctTag of this.distinct_tags) {
                this.questions_by_tag[distinctTag] = [];
            }
            for (const distinctTag of this.distinct_tags) {
                for (const entry of this.tags) {
                    for (const tagText of entry.tags.split(',')) {
                        if (distinctTag == tagText) {
                            this.questions_by_tag[distinctTag].push(entry);
                        }
                    }
                }
            }
        });

        this.API.get('comments/' + this.user.user_id).success((result) => {
            this.comments = result.comments;

            this.questions_by_comment = {};
            for (const comment of this.comments) {
                this.questions_by_comment[comment.question] = [];
            }

            for (const comment of this.comments) {
                this.questions_by_comment[comment.question].push(comment);
            }
        });
    }

    learnExam(examId) {
        const random = 1;
        this.API.get('exams/action/prepare/' + examId + '/' + random).success((result) => {
            const questionList = { 'list': result.list };
            questionList.exam_id = examId;
            sessionStorage.currentQuestionList = angular.toJson(questionList);
            this.$location.path('/question').search('id', questionList.list[0].question_id);
        });
    }

    learnSubjects() {
        const data = { selection_subject_list: this.selection_subject_list, selection_number_questions: this.selection_number_questions };
        this.API.post('learn/prepare', data).success((result) => {
            const questionList = { 'list': result.list };
            questionList.selection_subject_list = data.selection_subject_list;
            sessionStorage.currentQuestionList = angular.toJson(questionList);
            this.$location.path('/question').search('id', questionList.list[0].question_id);
        });
    }

    resetResults(index) {
        const examId = this.exams[index].exam_id;
        this.exams[index].answered_questions = 0;
        const data = {};
        this.API.delete('results/' + this.user.user_id + '/' + examId, data);
    }

    resetAbstractResults(index) {
        const examId = this.abstract_exams[index].exam_id;
        this.abstract_exams[index].answered_questions = 0;
        const data = {};
        this.API.delete('results/' + this.user.user_id + '/' + examId, data);
    }

    toggleSelection(subject, category, checked = false) {
        const selection = this.selection_subject_list;
        const subjects = this.subject_list;

        if (Object.keys(selection).indexOf(subject) > -1) { // If Subject in Selection Keys
            if (selection[subject].length === 0) { // If Subject in Selection has Empty Array
                if (category == 'all') {
                    delete selection[subject];
                }
            } else if (selection[subject].length > 0) { // If Subject in Selection has Full Array
                if (category == 'all') {
                    if (!checked) {
                        selection[subject] = subjects[subject].slice(0);
                    } else {
                        delete selection[subject];
                    }
                } else {
                    const idx = selection[subject].indexOf(category);
                    if (idx > -1) {
                        selection[subject].splice(idx, 1);
                        if (selection[subject].length === 0) {
                            delete selection[subject];
                        }
                    } else {
                        selection[subject].push(category);
                    }
                }
            } else { // If Subject in Selection has No Array
                if (category == 'all') {
                    selection[subject] = subjects[subject].slice(0);
                } else {
                    selection[subject] = [category];
                }
            }
        } else {
            if (category == 'all') {
                selection[subject] = subjects[subject].slice(0);
            } else {
                selection[subject] = [category];
            }
        }
    }

    searchQuestion() {
        this.search_results = [];

        const query_question = this.question_search_query;
        this.question_field_message = '';
        if (query_question.length) {
            this.show_spinner = true;

            const data = { 'query': this.question_search_query, 'visibility': 1, 'limit': 101 };
            // , 'subject': this.question_search_subject, 'semester': this.question_search_semester };
            this.API.get('questions', data).success((result) => {
                this.show_spinner = false;

                if (result.result.length === 0) {
                    this.question_field_message = 'Nichts gefunden ;(';
                } else if (result.result.length > 100) {
                    this.question_field_message = 'Zu viel gefunden, geht es ein bisschen konkreter? ;(';
                } else {
                    this.search_results = result.result;
                }
            });
        }
    }

    examInSelection(index) {
        return this.Selection.isElementIncluded(this.exams[index], this.exam_search);
    }

    examInSelectionCount() {
        return this.Selection.count(this.exams, this.exam_search);
    }
}

angular.module('userModule').controller('QuestionsController', QuestionsController);
