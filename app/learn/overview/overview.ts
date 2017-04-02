class LearnOverviewController {
  private readonly user: Crucio.User;
  private abstractExams: any;
  private collections: Crucio.Collection[];
  private ready: number;
  private distinctSemesters: any;
  private distinctSubjects: any;
  private subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.API.get('exams/distinct', { visibility: 1 }).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.API.get(`exams/abstract/${this.user.user_id}`, { limit: 12 }).then(result => {
      this.abstractExams = result.data.exams;
      this.ready = 1;
    });

    this.API.get('collections', { user_id: this.user.user_id, limit: 12 }).then(result => {
      this.collections = result.data.collections;
    });

    // fresh login
    // var body = document.getElementsByTagName('body')[0];
    // body.className = body.className + ' body-animated';
  }

  learnExam(method: Crucio.Method, examId: number): void {
    const data = { examId, random: 0 };
    this.Collection.learn('exam', method, data);
  }

  learnCollection(method: Crucio.Method, index: number): void {
    this.Collection.learnCollection(method, this.collections[index]);
  }

  removeCollection(index: number): void {
    this.Collection.delete(this.collections[index].collection_id);
    this.collections.splice(index, 1);
  }

  getWorkedList(list): any {
    return list.filter(e => e.given_result);
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
