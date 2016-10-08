class LearnOverviewController {
  API: API;
  Collection: Collection;
  $location: any;
  user: User;
  abstractExams: any;
  ready: number;
  distinctSemesters: any;
  distinctSubjects: any;
  subjectList: any;

  constructor(Auth, Page, API, Collection, $scope, $location, $timeout) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;

    Page.setTitleAndNav('Lernen | Crucio', 'Learn');

    this.user = Auth.getUser();

    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.loadOverview();

    // fresh login
    // var body = document.getElementsByTagName('body')[0];
    // body.className = body.className + ' body-animated';
  }

  loadOverview(): void {
    const data = { limit: 12 };
    this.API.get(`exams/abstract/${this.user.user_id}`, data).then(result => {
      this.abstractExams = result.data.exams;
      this.ready = 1;
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

angular.module('crucioApp').component('learnoverviewcomponent', {
  templateUrl: 'app/learn/overview/overview.html',
  controller: LearnOverviewController,
});
