class Collection {
  constructor() { }

  get() {
    if (angular.isUndefined(this.collection)) {
      if (angular.isDefined(sessionStorage.crucioCollection)) {
        this.set(angular.fromJson(sessionStorage.crucioCollection));
      }
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
      correct_q: 0,
      wrong_q: 0,
      seen_q: 0,
      solved_q: 0,
      free_q: 0,
      no_answer_q: 0,
      all_q: this.collection.list.length,
      worked_q: workedCollection.length,
    };

    for (const q of workedCollection) {
      if (q.correct_answer === q.given_result && q.given_result > 0 && q.correct_answer > 0) {
        result.correct_q++;
      }

      if (q.correct_answer !== q.given_result && q.given_result > 0 && q.correct_answer > 0) {
        result.wrong_q++;
      }

      if (q.given_result > 0) {
        result.solved_q++;
      }

      if (q.given_result > -2) {
        result.seen_q++;
      }

      if (q.type === 1) {
        result.free_q++;
      }

      if (q.correct_answer === 0 && q.type !== 1) {
        result.no_answer_q++;
      }
    }

    return result;
  }
}

angular.module('crucioApp').service('Collection', Collection);
