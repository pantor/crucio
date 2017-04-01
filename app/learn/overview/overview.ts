class LearnOverviewController {
  readonly API: APIService;
  readonly Collection: CollectionService;
  readonly user: Crucio.User;
  abstractExams: any;
  ready: number;
  distinctSemesters: any;
  distinctSubjects: any;
  subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, API: APIService, Collection: CollectionService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
    this.API = API;
    this.Collection = Collection;

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
    const data = { examId, random: 0 };
    this.Collection.learn('exam', 'question', data);
  }

  learnExamView(examId: number): void {
    this.Collection.learn('exam', 'exam', { examId });
  }

  learnExamPDF(examId: number): void {
    this.Collection.learn('exam', 'pdf', { examId });
  }

  resetExam(exam: Crucio.Exam): void {
    exam.answered_questions = 0;
    this.API.delete(`results/${this.user.user_id}/${exam.exam_id}`, true);
  }
}

angular.module('crucioApp').component('learnoverviewcomponent', {
  templateUrl: 'app/learn/overview/overview.html',
  controller: LearnOverviewController,
});
