class LearnOverviewController {
  private readonly user: Crucio.User;
  private abstractExams: any;
  private ready: number;
  private distinctSemesters: any;
  private distinctSubjects: any;
  private subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
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

  learnExam(method: Crucio.Method, examId: number): void {
    const data = { examId, random: 0 };
    this.Collection.learn('exam', method, data);
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
