class LearnController {
  constructor(Auth, Page, API, Collection, $scope, $location, $timeout) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;

    Page.setTitleAndNav('Lernen | Crucio', 'Lernen');
    this.activeTab = 'abstract';

    this.user = Auth.getUser();

    this.examSearch = { semester: this.user.semester };
    this.commentSearch = {};
    this.questionSearch = {};

    this.selection = {};
    this.selectedQuestionNumber = 0;
    this.numberQuestionsInSelection = 0;

    this.sliderOptions = { floor: 0, ceil: this.numberQuestionsInSelection };
    $timeout(() => { // Force slider rendering, a common problem, see angularjs-slider github repo
      $scope.$broadcast('rzSliderForceRender');
    });


    this.API.get('exams/distinct').then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });

    this.loadAbstract();
    this.loadExams();
    this.loadTags();
    this.loadComments();
  }

  loadAbstract() {
    const data = { limit: 12 };
    this.API.get('exams/abstract/' + this.user.user_id, data).then(result => {
      this.abstractExams = result.data.exams;
      this.ready = 1;
    });
  }

  loadExams() {
    const data = {
      user_id: this.user.user_id,
      semester: this.examSearch.semester,
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      query: this.examSearch.query,
      visibility: 1,
    };
    this.API.get('exams', data).then(result => {
      this.exams = result.data.exams;
    });
  }

  loadTags() {
    const data = { user_id: this.user.user_id };
    this.API.get('tags', data).then(result => {
      this.tags = result.data.tags;

      this.distinctTags = [];
      for (const entry of this.tags) {
        for (const tagText of entry.tags.split(',')) {
          if (!this.distinctTags.includes(tagText)) {
            this.distinctTags.push(tagText);
          }
        }
      }

      this.questionsByTag = {};
      for (const distinctTag of this.distinctTags) {
        this.questionsByTag[distinctTag] = [];
        for (const entry of this.tags) {
          for (const tagText of entry.tags.split(',')) {
            if (distinctTag === tagText) {
              this.questionsByTag[distinctTag].push(entry);
            }
          }
        }
      }
    });
  }

  loadComments() {
    const data = {
      query: this.commentSearch.query,
      user_id: this.user.user_id,
    };
    this.API.get('comments', data).then(result => {
      this.comments = result.data.comments;

      this.questionsByComment = {};
      for (const c of this.comments) {
        this.questionsByComment[c.question] = this.questionsByComment[c.question] || [];
        this.questionsByComment[c.question].push(c);
      }
    });
  }

  loadNumberQuestions() {
    const data = { selection: this.selection };
    this.API.get('questions/count', data, true).then(result => {
      this.numberQuestionsInSelection = result.data.count;

      const sliderMax = Math.min(this.numberQuestionsInSelection, 500);
      this.sliderOptions = { floor: 0, ceil: sliderMax };

      if (!this.selectedQuestionNumber) {
        this.selectedQuestionNumber = 50;
      }
      this.selectedQuestionNumber = Math.min(
        this.selectedQuestionNumber,
        this.numberQuestionsInSelection
      );
    });
  }

  searchQuestion() {
    this.searchResults = []; // Reset search results on empty query
    this.hasSearched = false;

    if (this.questionSearch.query) {
      this.showSpinner = true;

      const data = {
        query: this.questionSearch.query,
        subject_id: this.questionSearch.subject && this.questionSearch.subject.subject_id,
        semester: this.questionSearch.semester,
        visibility: 1,
        limit: 100,
      };
      this.API.get('questions', data, true).then(result => {
        this.searchResults = result.data.result;

        this.showSpinner = false;
        this.hasSearched = true;
      });
    }
  }

  learnExam(examId) {
    const data = { random: true };
    this.API.get('exams/action/prepare/' + examId, data).then(result => {
      const collection = { list: result.data.list, exam_id: examId };
      this.Collection.set(collection);
      this.$location.path('/question').search('id', collection.list[0].question_id);
    });
  }

  learnSubjects() {
    const data = { selection: this.selection, limit: this.selectedQuestionNumber };
    this.API.get('questions/prepare-subjects', data).then(result => {
      const collection = { list: result.data.list, selection: data.selection };
      this.Collection.set(collection);
      this.$location.path('/question').search('id', collection.list[0].question_id);
    });
  }

  resetExam(exam) {
    exam.answered_questions = 0;
    this.API.delete('results/' + this.user.user_id + '/' + exam.exam_id, true);
  }
}

angular.module('crucioApp').controller('LearnController', LearnController);
