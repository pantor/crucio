import * as angular from 'angular';
import { app } from './../crucio';
import APIService from './api.service';
import AuthService from './auth.service';

export class Collection {
  collection_id?: number;
  list: Crucio.CollectionListItem[];
  questions: Crucio.Question[];
  type: Crucio.Type;
  exam_id?: number; // Exam
  selection?: any; // Subjects, Categories
  tag?: string; // Tag
  questionSearch?: any; // Query, Subject, Semester
}

export default class CollectionService {
  private collection: Collection;
  private readonly user: Crucio.User;

  constructor(Auth: AuthService, private readonly API: APIService, private readonly $state: angular.ui.IStateService, private readonly $window: angular.IWindowService) {
      this.user = Auth.getUser();
  }

  private loadLocal(): void {
    if (angular.isUndefined(this.collection)
      && angular.isDefined(sessionStorage.crucioCollection)
    ) {
      this.collection = angular.fromJson(sessionStorage.crucioCollection);
    }
  }

  private saveLocal(collection: Collection): void {
    this.collection = collection;
    sessionStorage.crucioCollection = angular.toJson(collection);
  }

  deleteLocal(): void {
    delete this.collection;
    sessionStorage.removeItem('crucioCollection');
  }

  saveRemote(): void {
    if (this.collection.collection_id > -1) {
      const data = { collection: this.collection };
      this.API.put(`collections/${this.collection.collection_id}`, data).then(result => {

      });
    } else {
      const data = { user_id: this.user.user_id, collection: this.collection };
      this.API.post('collections', data).then(result => {
        this.collection.collection_id = result.data.collection_id;
        this.saveLocal(this.collection);
      });
    }
  }

  deleteRemote(collection_id: number): void {
    this.API.delete(`collections/${collection_id}`);
  }

  learn(type: Crucio.Type, method: Crucio.Method, params: any): void {
    const url = {
      tags: 'tags/prepare',
      exam: `exams/action/prepare/${params.examId}`,
      subjects: 'questions/prepare-subjects',
      query: 'questions/prepare-query',
    }

    this.API.get(url[type], params).then(result => {
      this.learnCollection(method, result.data.collection);
    });
  }

  learnCollection(method: Crucio.Method, collection: Collection): void {
    this.saveLocal(collection);

    switch (method) {
      case 'question':
        let goToQuestionId = this.collection.list[0].question_id;
        for (const listElement of this.collection.list) { // Go to first question which is not answered yet
          if (listElement.given_result === undefined && listElement.mark_answer !== 1) {
            goToQuestionId = listElement.question_id;
            break;
          }
        }
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
  }

  getType(): Crucio.Type {
    this.loadLocal();
    return this.collection.type;
  }

  getExamId(): number {
    this.loadLocal();
    return this.collection.exam_id;
  }

  getLength(): number {
    this.loadLocal();
    return this.collection.list.length;
  }

  getList(): Crucio.CollectionListItem[] {
    this.loadLocal();
    return this.collection.list;
  }

  getWorkedList(): Crucio.CollectionListItem[] {
    return this.getList().filter(e => e.given_result > -2); // Seen...
  }

  getQuestion(index: number): Crucio.Question {
    this.loadLocal();
    if (this.collection.questions) {
      return this.collection.questions[index];
    }
    return undefined;
  }

  getIndexOfQuestion(questionId: number): number {
    this.loadLocal();
    // this.index = this.collection.list.findIndex(e => e.question_id === this.questionId);
    for (let i = 0; i < this.collection.list.length; i++) {
      if (this.collection.list[i].question_id === questionId) {
        return i;
      }
    }
    return -1;
  }

  getQuestionData(index: number): Crucio.CollectionListItem {
    this.loadLocal();
    return this.collection.list[index];
  }

  setAnswer(index: number, answer: number): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].given_result = answer;
      this.saveLocal(this.collection);
    }
  }

  setMarkAnswer(index: number): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].mark_answer = 1;
      this.saveLocal(this.collection);
    }
  }

  setStrike(index: number, strike: boolean[]): void {
    if (this.collection && Object.keys(this.collection).length) {
      this.collection.list[index].strike = strike;
      this.saveLocal(this.collection);
    }
  }

  loadQuestions(): angular.IPromise<Crucio.Question[]> {
    this.loadLocal();
    const listQuestionIds = this.getQuestionIds(this.collection.list);
    return this.getQuestions(listQuestionIds).then(result => {
      this.collection.questions = result;
      this.saveLocal(this.collection);
      return this.collection.questions;
    });
  }

  loadCombinedListAndQuestions(list: Crucio.CollectionListItem[]): angular.IPromise<Crucio.CombinationElement[]> {
    this.loadLocal();
    const listQuestionIds = this.getQuestionIds(list);
    return this.getQuestions(listQuestionIds).then(questions => {
      this.collection.questions = questions;
      this.saveLocal(this.collection);

      let result: Crucio.CombinationElement[] = [];
      for (let i = 0; i < list.length; i++) {
        result.push({ data: list[i], question: questions[i] });
      }
      return result;
    });
  }

  analyseCombination(combination: Crucio.CombinationElement[]): Crucio.AnalyseCount {
    const result: Crucio.AnalyseCount = {
      correct: 0,
      wrong: 0,
      seen: 0,
      solved: 0,
      free: 0,
      no_answer: 0,
      all: this.getLength(),
      worked: combination.length,
    };

    for (let c of combination) {
      if (c.question.correct_answer === c.data.given_result && c.data.given_result > 0 && c.question.correct_answer > 0) {
        result.correct++;
      }

      if (c.question.correct_answer !== c.data.given_result && c.data.given_result > 0 && c.question.correct_answer > 0) {
        result.wrong++;
      }

      if (c.data.given_result > 0) {
        result.solved++;
      }

      if (c.data.given_result > -2) {
        result.seen++;
      }

      if (c.question.type === 1) {
        result.free++;
      }

      if (c.question.correct_answer === 0 && c.question.type !== 1) {
        result.no_answer++;
      }
    }

    return result;
  }

  saveResults(combination: Crucio.CombinationElement[]): void {
    // TODO from older git
  }


  private getQuestions(listOfQuestionIds: number[]): angular.IPromise<Crucio.Question[]> {
    return this.API.get('questions/list', {list: JSON.stringify(listOfQuestionIds)}).then(result => {
      return result.data.list as Crucio.Question[];
    });
  }

  private getQuestionIds(list: Crucio.CollectionListItem[]): number[] {
    let result = [];
    for (let i = 0; i < list.length; i++) {
      result.push(list[i].question_id);
    }
    return result;
  }
}

app.service('Collection', CollectionService);
