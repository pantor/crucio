class CollectionService {
  readonly API: APIService;
  collection: Crucio.Collection;

  constructor(API: APIService) {
    this.API = API;
  }

  get(): Crucio.Collection {
    if (angular.isUndefined(this.collection)
      && angular.isDefined(sessionStorage.crucioCollection)
    ) {
      this.set(angular.fromJson(sessionStorage.crucioCollection));
    }

    return this.collection;
  }

  set(collection: Crucio.Collection): void {
    this.collection = collection;
    sessionStorage.crucioCollection = angular.toJson(collection);
  }

  remove(): void {
    delete this.collection;
    sessionStorage.removeItem('crucioCollection');
  }

  getWorked(): Crucio.CollectionListItem[] {
    this.get();
    return this.collection.list.filter(e => e.given_result);
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

  saveMarkAnswer(index: number): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].mark_answer = 1;
      this.set(this.collection);
    }
  }

  prepareExam(examId: number, data: any): any {
    return this.API.get(`exams/action/prepare/${examId}`, data).then(result => {
      const collection: Crucio.Collection = { type: 'exam', list: result.data.list, exam_id: examId };
      this.set(collection);
      return collection;
    });
  }

  prepareSubjects(data): any {
    return this.API.get('questions/prepare-subjects', data).then(result => {
      const collection: Crucio.Collection = { type: 'subjects', list: result.data.list, selection: data.selection };
      this.set(collection);
      return collection;
    });
  }

  getIndexOfQuestion(questionId: number): number {
    // this.index = this.collection.list.findIndex(e => e.question_id === this.questionId);
    for (let i = 0; i < this.collection.list.length; i++) {
      if (this.collection.list[i].question_id === questionId) {
        return i;
      }
    }
    return -1;
  }

  getQuestionData(index: number): Crucio.CollectionListItem {
    return this.collection.list[index];
  }

  isHalftime(index: number): boolean {
    return (Math.abs(index + 1 - this.collection.list.length / 2) < 1) && (index > 3);
  }
}

angular.module('crucioApp').service('Collection', CollectionService);
