class EditController {
    constructor(Page, Auth, API, FileUploader, $scope, $location, $routeParams, $timeout) {
        this.API = API;
        this.FileUploader = FileUploader;
        this.$location = $location;
        this.$timeout = $timeout;

        Page.setTitleAndNav('Klausur | Crucio', 'Autor');

        this.ready = 0;

        this.user = Auth.getUser();
        this.exam_id = $routeParams.id;
        this.open_question_index = -1;

        this.subject_list = subject_list;

        this.has_changed = 0;
        this.number_changed = 0;
        this.is_saving = 0;

        this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
        this.uploader.onSuccessItem = (fileItem, response) => {
            this.exam.file_name = response.upload_name;
        };
        this.uploader_array = [];


        $scope.$watch(() => this.exam, () => {
            if (this.number_changed > 1) {
                this.has_changed = 1;
            }
            this.number_changed += 1;
        }, true);

        $scope.$on('$locationChangeStart', (event) => {
            if (this.has_changed == 1) {
                const confirmClose = confirm('Die Änderungen an der Klausur bleiben dann ungespeichert. Wirklich verlassen?');
                if (!confirmClose) {
                    event.preventDefault();
                }
            }
        });

        this.API.get('exams/' + this.exam_id).success((result) => {
            this.exam = result;
            this.exam.semester = Number(result.semester);
            this.exam.duration = Number(result.duration);

            for (let i = 0; i < this.exam.questions.length; i++) {
                if (this.exam.questions[i].topic.length === 0) {
                    this.exam.questions[i].topic = 'Sonstiges';
                }

                if (this.exam.questions[i].question_id == $routeParams.question_id) {
                    this.open_question_index = i;
                }
            }


            this.remakeUploaderArray();

            if (this.exam.questions.length === 0) {
                this.addQuestion(false);
            }

            if (!this.exam.subject) {
                this.exam.subject = 'Allgemeine Pathologie';
                this.exam.sort = 'Erstklausur';
            }

            this.ready = 1;
        });
    }

    remakeUploaderArray() {
        this.uploader_array = [];
        for (let i = 0; i < this.exam.questions.length; i++) {
            const uploader = new this.FileUploader({ url: '/api/v1/file/upload', formData: i });
            uploader.onSuccessItem = (fileItem, response) => {
                const index = fileItem.formData;
                this.exam.questions[index].question_image_url = response.upload_name;
            };
            this.uploader_array.push(uploader);
        }
    }

    addQuestion(show) {
        const question = {
            'question': '',
            'type': 5,
            'correct_answer': 0,
            'answers': ['', '', '', '', '', ''],
            'topic': 'Sonstiges',
        };

        this.exam.questions.push(question);
        if (show) {
            this.open_question_index = this.exam.questions.length - 1;
        }

        this.remakeUploaderArray();
    }

    deleteQuestion(index) {
        const question_id = this.exam.questions[index].question_id;

        if (question_id) {
            this.API.delete('questions/' + question_id);
        }

        this.exam.questions.splice(index, 1);

        this.remakeUploaderArray();

        if (this.open_question_index >= this.exam.questions.length) {
            this.open_question_index = this.exam.questions.length - 1;
        }

        if (this.exam.questions.length === 0) {
            this.addQuestion(1);
        }
    }

    saveExam() {
        let validate = true;
        if (!this.exam.subject) {
            validate = false;
        }

        if (this.exam.semester < 1) {
            validate = false;
        }

        if (!this.exam.date) {
            validate = false;
        }

        if (validate) {
            this.is_saving = 1;

            const exam_data = this.exam;
            this.API.put('exams/' + this.exam_id, exam_data);

            for (const question of this.exam.questions) {
                let validateQuestion = true;
                if (!question.question.length) {
                    validateQuestion = false;
                }

                if (question.question_id) {
                    validateQuestion = true;
                }

                if (validateQuestion) {
                    if (!question.explanation) {
                        question.explanation = '';
                    }

                    if (!question.question_image_url) {
                        question.question_image_url = '';
                    }

                    const data = {
                        'question': question.question,
                        'topic': question.topic,
                        'type': question.type,
                        'answers': question.answers,
                        'correct_answer': question.correct_answer,
                        'exam_id': this.exam.exam_id,
                        'user_id_added': this.user.user_id,
                        'explanation': question.explanation,
                        'question_image_url': question.question_image_url,
                    };

                    // New Question
                    if (!question.question_id) {
                        this.API.post('questions', data).success((result) => {
                            question.question_id = result.question_id;
                        });
                    } else {
                        this.API.put('questions/' + question.question_id, data);
                    }
                }
            }

            this.has_changed = 0;
            this.is_saving = 0;
        } else {
            alert('Es fehlen noch allgemeine Infos zur Klausur.');
        }
    }

    deleteExam() {
        this.API.delete('exams/' + this.exam.exam_id).success(() => {
            this.$location.url('/author');
        });
    }
}

angular.module('authorModule').controller('EditController', EditController);
