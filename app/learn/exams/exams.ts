class LearnExamsController {
  API: APIService;
  Collection: CollectionService;
  $location: angular.ILocationService;
  user: Crucio.User;
  examSearch: any;
  exams: Crucio.Exam[];
  distinctSemesters: any;
  distinctSubjects: any;

  constructor(Auth: AuthService, API: APIService, Collection: CollectionService, $scope: angular.IScope, $location: angular.ILocationService, $timeout: angular.ITimeoutService) {
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
    const data = { random: false };
    this.Collection.prepareExam(examId, data).then(result => {
      this.$location.path('/question').search('questionId', result.list[0].question_id);
    });
  }

  resetExam(exam: Crucio.Exam): void {
    exam.answered_questions = 0;
    this.API.delete(`results/${this.user.user_id}/${exam.exam_id}`, true);
  }
}

angular.module('crucioApp').component('learnexamscomponent', {
  templateUrl: 'app/learn/exams/exams.html',
  controller: LearnExamsController,
});
