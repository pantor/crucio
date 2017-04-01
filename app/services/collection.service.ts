class CollectionService {
  readonly API: APIService;
  readonly $state: angular.ui.IStateService;
  private collection: Crucio.Collection;

  constructor(API: APIService, $state: angular.ui.IStateService) {
    this.API = API;
    this.$state = $state;
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
        url = '';
        break;
    }

    this.API.get(url, params).then(result => {
      this.set(result.data.collection);

      switch (method) {
        case 'question':
          const goToQuestionId = this.collection.list[0].question_id;

          // Go to first question which is not answered yet
          /* if (true) {
            for (var i = 0; i < this.collection.list.length; i++) {
              if (!this.collection.user_datas[this.collection.list[i]]) {
                goToQuestionID = this.collection.list[i];
                break;
              }
            }
          } */

          this.$state.go('question', {questionId: goToQuestionId});
          break;

        // Currently only with type exam
        case 'exam':
          this.$state.go('exam');
          break;

        /* case 'pdf':
          var question_id_list = this.collection.list.join(',');
          var collection_info = encodeURIComponent(angular.toJson(data.collection.info));
          $window.location.assign('http://dev.crucio-leipzig.de/api/v1/pdf/collection?question_id_list='+question_id_list+'&collection_info='+collection_info);
          break;

        case 'pdf-both':
          var question_id_list = data.collection.question_id_list.join(',');
          var collection_info = encodeURIComponent(angular.toJson(data.collection.info));
          $window.location.assign('http://dev.crucio-leipzig.de/api/v1/pdf/both?question_id_list='+question_id_list+'&collection_info='+collection_info);
          break; */
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

  getWorked(): Crucio.CollectionListItem[] {
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

  analyseCount(): Crucio.AnalyseCount {
    const workedCollection = this.getWorked();

    const result = {
      correct: 0,
      wrong: 0,
      seen: 0,
      solved: 0,
      free: 0,
      no_answer: 0,
      all: this.collection.list.length,
      worked: workedCollection.length,
    };

    for (const q of workedCollection) {
      if (q.correct_answer === q.given_result && q.given_result > 0 && q.correct_answer > 0) {
        result.correct++;
      }

      if (q.correct_answer !== q.given_result && q.given_result > 0 && q.correct_answer > 0) {
        result.wrong++;
      }

      if (q.given_result > 0) {
        result.solved++;
      }

      if (q.given_result > -2) {
        result.seen++;
      }

      if (q.type === 1) {
        result.free++;
      }

      if (q.correct_answer === 0 && q.type !== 1) {
        result.no_answer++;
      }
    }

    return result;
  }



  getQuestions(list: number[]): any { // List of questionIds
    return this.API.get('questions/list', {list: JSON.stringify(list)}).then(result => {
      return result.data.list;
    });
  }
}

angular.module('crucioApp').service('Collection', CollectionService);
