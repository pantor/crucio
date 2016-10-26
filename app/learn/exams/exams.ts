class LearnExamsController {
  API: API;
  Collection: Collection;
  $location: any;
  user: User;
  examSearch: any;
  exams: Exam[];
  distinctSemesters: any;
  distinctSubjects: any;

  constructor(Auth, API, Collection, $scope, $location, $timeout) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;

    this.user = Auth.getUser();

    this.examSearch = { semester: this.user.semester };


    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.loadExams();

    // fresh login
    // var body = document.getElementsByTagName('body')[0];
    // body.className = body.className + ' body-animated';
  }

  loadExams(): void {
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

  learnExam(examId: number): void {
    const data = { random: true };
    this.Collection.prepareExam(examId, data).then(result => {
      this.$location.path('/question').search('questionId', result.list[0].question_id);
    });
  }

  resetExam(exam): void {
    exam.answered_questions = 0;
    this.API.delete(`results/${this.user.user_id}/${exam.exam_id}`, true);
  }
}

angular.module('crucioApp').component('learnexamscomponent', {
  templateUrl: 'app/learn/exams/exams.html',
  controller: LearnExamsController,
});
