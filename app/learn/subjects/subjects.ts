class LearnSubjectsController {
  private readonly user: Crucio.User;
  private selection: any;
  private selectedQuestionNumber: number;
  private numberQuestionsInSelection: number;
  private sliderOptions: any;
  private abstractExams: any;
  private ready: number;
  private distinctSemesters: any;
  private distinctSubjects: any;
  private subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.selection = {};
    this.selectedQuestionNumber = 0;
    this.numberQuestionsInSelection = 0;

    this.sliderOptions = { floor: 0, ceil: this.numberQuestionsInSelection };
    $timeout(() => { // Force slider rendering, a common problem, see angularjs-slider github repo
      $scope.$broadcast('rzSliderForceRender');
    });


    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.API.get('subjects', {has_questions: true}).then(result => {
      this.subjectList = result.data.subjects;
    });
  }

  loadNumberQuestions(): void {
    const data = { selection: this.selection };
    this.API.get('questions/count', data).then(result => {
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

  learnSubjects(method: Crucio.Method): void {
    const data = { selection: this.selection, limit: this.selectedQuestionNumber };
    this.Collection.learn('subjects', method, data);
  }
}

angular.module('crucioApp').component('learnsubjectscomponent', {
  templateUrl: 'app/learn/subjects/subjects.html',
  controller: LearnSubjectsController,
});
