class LearnSubjectsController {
  readonly API: APIService;
  readonly Collection: CollectionService;
  $location: any;
  readonly user: Crucio.User;
  selection: any;
  selectedQuestionNumber: number;
  numberQuestionsInSelection: number;
  sliderOptions: any;
  abstractExams: any;
  ready: number;
  distinctSemesters: any;
  distinctSubjects: any;
  subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, API: APIService, Collection: CollectionService, $scope: angular.IScope, $location: angular.ILocationService, $timeout: angular.ITimeoutService) {
    this.API = API;
    this.Collection = Collection;
    this.$location = $location;

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

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });
  }

  loadNumberQuestions(): void {
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

  learnSubjects(): void {
    const data = { selection: this.selection, limit: this.selectedQuestionNumber };
    this.Collection.prepareSubjects(data).then(result => {
      this.$location.path('/question').search('questionId', result.list[0].question_id);
    });
  }
}

angular.module('crucioApp').component('learnsubjectscomponent', {
  templateUrl: 'app/learn/subjects/subjects.html',
  controller: LearnSubjectsController,
});
