class Collection {
  constructor() { }

  get() {
    if (angular.isUndefined(this.collection)
      && angular.isDefined(sessionStorage.crucioCollection)
    ) {
      this.set(angular.fromJson(sessionStorage.crucioCollection));
    }

    return this.collection;
  }

  set(collection) {
    this.collection = collection;
    sessionStorage.crucioCollection = angular.toJson(collection);
  }

  remove() {
    delete this.collection;
    sessionStorage.removeItem('crucioCollection');
  }

  getWorked() {
    this.get();
    return this.collection.list.filter(e => e.given_result);
  }

  analyseCount() {
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
}

angular.module('crucioApp').service('Collection', Collection);
