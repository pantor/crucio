class CollectionService {
  readonly API: APIService;
  readonly $state: angular.ui.IStateService;
  private readonly $window: any;
  private collection: Crucio.Collection;

  constructor(API: APIService, $state: angular.ui.IStateService, $window: any) {
    this.API = API;
    this.$state = $state;
    this.$window = $window;
  }

  private get(): Crucio.Collection {
    if (angular.isUndefined(this.collection)
      && angular.isDefined(sessionStorage.crucioCollection)
    ) {
      this.set(angular.fromJson(sessionStorage.crucioCollection));
    }

    return this.collection;
  }

  private set(collection: Crucio.Collection): void {
    this.collection = collection;
    sessionStorage.crucioCollection = angular.toJson(collection);
  }

  remove(): void {
    delete this.collection;
    sessionStorage.removeItem('crucioCollection');
  }


  learn(type: string, method: string, params: any): void {
    // if (method === 'question') { params.load_first_question = true; }
    // if (method === 'exam') { params.load_all_questions = true; }

    let url = '';
    switch (type) {
      case 'tags':
        url = 'tags/prepare';
        break;

      case 'exam':
        url = `exams/action/prepare/${params.examId}`;
        break;

      case 'subjects':
        url = 'questions/prepare-subjects';
        break;

      case 'query':
        url = 'questions/prepare-query';
        break;
    }

    this.API.get(url, params).then(result => {
      this.set(result.data.collection);

      switch (method) {
        case 'question':
          // TODO Go to first question which is not answered yet
          const goToQuestionId = this.collection.list[0].question_id;
          this.$state.go('question', {questionId: goToQuestionId});
          break;

        case 'exam':
          this.$state.go('exam');
          break;

        case 'pdf':
        case 'pdf-solution':
          const listString = this.getQuestionIds(this.collection.list).join(',');
          const info = encodeURIComponent(angular.toJson({
            type: this.collection.type,
            examId: this.collection.exam_id,
            selection: this.collection.selection,
            tag: this.collection.tag,
            questionSearch: this.collection.questionSearch,
          }));

          const view = method == 'pdf' ? 'exam' : 'solution';
          this.$window.location.assign(`api/v1/pdf/collection/${view}?list=${listString}&info=${info}`);
          break;
      }
    });
  }

  getType(): string {
    this.get();
    return this.collection.type;
  }

  getExamId(): number {
    this.get();
    return this.collection.exam_id;
  }

  getTag(): string {
    this.get();
    return this.collection.tag;
  }

  getLength(): number {
    this.get();
    return this.collection.list.length;
  }

  getQuestion(index: number): Crucio.Question {
    this.get();
    if (this.collection.questions) {
      return this.collection.questions[index];
    }
    return undefined;
  }

  getWorkedList(): Crucio.CollectionListItem[] {
    this.get();
    return this.collection.list.filter(e => e.given_result);
  }


  loadQuestions(): any {
    this.get();
    const listQuestionIds = this.getQuestionIds(this.collection.list);
    return this.getQuestions(listQuestionIds).then(result => {
      this.collection.questions = result;
      this.set(this.collection);
      return this.collection.questions;
    });
  }

  loadWorkedQuestions(): any {
    this.get();
    const workedList = this.getWorkedList();
    const workedListQuestionIds = this.getQuestionIds(workedList);
    return this.getQuestions(workedListQuestionIds).then(result => {
      return result;
    });
  }

  getIndexOfQuestion(questionId: number): number {
    this.get();
    // this.index = this.collection.list.findIndex(e => e.question_id === this.questionId);
    for (let i = 0; i < this.collection.list.length; i++) {
      if (this.collection.list[i].question_id === questionId) {
        return i;
      }
    }
    return -1;
  }

  getQuestionData(index: number): Crucio.CollectionListItem {
    this.get();
    return this.collection.list[index];
  }

  getQuestionIds(list: Crucio.CollectionListItem[]): number[] {
    let result = [];
    for (let i = 0; i < list.length; i++) {
      result.push(list[i].question_id);
    }
    return result;
  }

  saveMarkAnswer(index: number): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].mark_answer = 1;
      this.set(this.collection);
    }
  }

  saveAnswer(index: number, answer: number): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].given_result = answer;
      this.set(this.collection);
    }
  }

  saveStrike(index: number, strike: boolean[]): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].strike = strike;
      this.set(this.collection);
    }
  }

  analyseCount(workedQuestions: Crucio.Question[]): Crucio.AnalyseCount {
    const workedCollectionList = this.getWorkedList();

    const result = {
      correct: 0,
      wrong: 0,
      seen: 0,
      solved: 0,
      free: 0,
      no_answer: 0,
      all: this.collection.list.length,
      worked: workedCollectionList.length,
    };

    for (let i = 0; i < workedQuestions.length; i++) {
      const question = workedQuestions[i];
      const questionData = workedCollectionList[i];

      if (question.correct_answer === questionData.given_result && questionData.given_result > 0 && question.correct_answer > 0) {
        result.correct++;
      }

      if (question.correct_answer !== questionData.given_result && questionData.given_result > 0 && question.correct_answer > 0) {
        result.wrong++;
      }

      if (questionData.given_result > 0) {
        result.solved++;
      }

      if (questionData.given_result > -2) {
        result.seen++;
      }

      if (question.type === 1) {
        result.free++;
      }

      if (question.correct_answer === 0 && question.type !== 1) {
        result.no_answer++;
      }
    }

    return result;
  }



  getQuestions(list: number[]): any { // List is list of questionIds
    return this.API.get('questions/list', {list: JSON.stringify(list)}).then(result => {
      return result.data.list as Crucio.Question[];
    });
  }
}

angular.module('crucioApp').service('Collection', CollectionService);
