class LearnController {
  constructor(Auth, Page, API, Collection, $scope, $location, $timeout) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;

    Page.setTitleAndNav('Lernen | Crucio', 'Lernen');
    this.activeTab = 'abstract';

    this.user = Auth.getUser();

    this.exam_search = { semester: this.user.semester };
    this.comment_search = {};
    this.question_search = {};

    this.selection_subject_list = {};
    this.selection_number_questions = 0;
    this.number_questions_in_choosen_subjects = 0;

    this.slider_options = { floor: 0, ceil: this.number_questions_in_choosen_subjects };
    $timeout(() => { // Force slider rendering, a common problem see https://github.com/rzajac/angularjs-slider
      $scope.$broadcast('rzSliderForceRender');
    });

    $scope.$watch(() => this.number_questions_in_choosen_subjects, () => {
      const max = Math.min(this.number_questions_in_choosen_subjects, 500);
      this.slider_options = { floor: 0, ceil: max };
    }, true);


    this.API.get('exams/distinct').success(result => {
      this.distinct_semesters = result.semesters;
      this.distinct_subjects = result.subjects;
    });

    this.API.get('subjects').success(result => {
      this.subject_list = result.subjects;
    });

    this.loadAbstract();
    this.loadExams();
    this.loadTags();
    this.loadComments();
  }

  loadAbstract() {
    const data = { limit: 12 };
    this.API.get('exams/abstract/' + this.user.user_id, data).success(result => {
      this.abstract_exams = result.exams;
      this.ready = 1;
    });
  }

  loadExams() {
    const data = {
      user_id: this.user.user_id,
      semester: this.exam_search.semester,
      subject_id: this.exam_search.subject && this.exam_search.subject.subject_id,
      query: this.exam_search.query,
      visibility: 1,
    };
    this.API.get('exams', data).success(result => {
      this.exams = result.exams;
    });
  }

  loadTags() {
    const data = { user_id: this.user.user_id };
    this.API.get('tags', data).success(result => {
      this.tags = result.tags;

      this.distinct_tags = [];
      for (const entry of this.tags) {
        for (const tagText of entry.tags.split(',')) {
          if (!this.distinct_tags.includes(tagText)) {
            this.distinct_tags.push(tagText);
          }
        }
      }

      this.questions_by_tag = {};
      for (const distinctTag of this.distinct_tags) {
        this.questions_by_tag[distinctTag] = [];
        for (const entry of this.tags) {
          for (const tagText of entry.tags.split(',')) {
            if (distinctTag === tagText) {
              this.questions_by_tag[distinctTag].push(entry);
            }
          }
        }
      }
    });
  }

  loadComments() {
    const data = {
      query: this.comment_search.query,
      user_id: this.user.user_id,
    };
    this.API.get('comments', data).success(result => {
      this.comments = result.comments;

      this.questions_by_comment = {};
      for (const comment of this.comments) {
        this.questions_by_comment[comment.question] = this.questions_by_comment[comment.question] || [];
        this.questions_by_comment[comment.question].push(comment);
      }
    });
  }

  loadNumberQuestions() {
    const data = { selection: this.selection };
    this.API.get('questions/count', data, true).success(result => {
      this.number_questions_in_choosen_subjects = result.count;

      if (this.selection_number_questions === 0) {
        this.selection_number_questions = Math.min(this.number_questions_in_choosen_subjects, 50);
      }
      this.selection_number_questions = Math.min(this.selection_number_questions, this.number_questions_in_choosen_subjects);
    });
  }

  searchQuestion() {
    this.searchResults = []; // Reset search results on empty query
    this.hasSearched = false;

    if (this.question_search.query) {
      this.showSpinner = true;

      const data = {
        query: this.question_search.query,
        subject_id: this.question_search.subject && this.question_search.subject.subject_id,
        semester: this.question_search.semester,
        visibility: 1,
        limit: 100,
      };
      this.API.get('questions', data, true).success(result => {
        this.searchResults = result.result;

        this.showSpinner = false;
        this.hasSearched = true;
      });
    }
  }

  learnExam(examId) {
    const data = { random: true };
    this.API.get('exams/action/prepare/' + examId, data).success(result => {
      const collection = { list: result.list, exam_id: examId };
      this.Collection.set(collection);
      this.$location.path('/question').search('id', collection.list[0].question_id);
    });
  }

  learnSubjects() {
    const data = { selection: this.selection, limit: this.selection_number_questions };
    this.API.get('questions/prepare-subjects', data).success(result => {
      const collection = { list: result.list, selection: data.selection };
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
