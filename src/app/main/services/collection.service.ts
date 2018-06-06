import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Rx';

export class Collection {
  collection_id?: number;
  list: Crucio.CollectionListItem[];
  questions: any;
  type: Crucio.Type;
  exam_id?: number; // Exam
  selection?: any; // Subjects, Categories
  tag?: string; // Tag
  questionSearch?: any; // Query, Subject, Semester
}

@Injectable()
export class CollectionService {
  private collection: Collection;
  private readonly user: any;

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {
    this.user = this.auth.getUser();
  }

  private loadLocal(): void {
    if (this.collection == null && sessionStorage.crucioCollection != null) {
      this.collection = JSON.parse(sessionStorage.crucioCollection);
    }
  }

  private saveLocal(collection: Collection): void {
    this.collection = collection;
    sessionStorage.crucioCollection = JSON.stringify(collection);
  }

  deleteLocal(): void {
    delete this.collection;
    sessionStorage.removeItem('crucioCollection');
  }

  saveRemote(): Observable<any> {
    if (this.collection.collection_id > -1) {
      const data = { collection: this.collection };
      return this.api.put(`collections/${this.collection.collection_id}`, data);
    } else {
      const data = { user_id: this.user.user_id, collection: this.collection };
      return this.api.post('collections', data).map(result => {
        this.collection.collection_id = result.collection_id;
        this.saveLocal(this.collection);
        return result;
      });
    }
  }

  deleteRemote(collection_id: number): void {
    this.api.delete(`collections/${collection_id}`).subscribe(() => { });
  }

  learn(type: Crucio.Type, method: Crucio.Method, params: any): void {
    const url = {
      tags: 'tags/prepare',
      exam: `exams/action/prepare/${params.examId}`,
      subjects: 'questions/prepare-subjects',
      query: 'questions/prepare-query',
    }

    this.api.get(url[type], params).subscribe(result => {
      this.learnCollection(method, result.collection);
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
        this.router.navigate(['/app/question'], { queryParams: { questionId: goToQuestionId } });
        break;

      case 'exam':
        this.router.navigate(['/app/exam']);
        break;

      case 'pdf-exam':
      case 'pdf-solution':
      case 'pdf-both':
        const listString = this.getQuestionIds(this.collection.list).join(',');
        const info = encodeURIComponent(JSON.stringify({
          type: this.collection.type,
          examId: this.collection.exam_id,
          selection: this.collection.selection,
          tag: this.collection.tag,
          questionSearch: this.collection.questionSearch,
        }));

        window.location.assign(`${this.api.base}pdf/collection/${method}?list=${listString}&info=${info}`);
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
    return null;
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

  loadQuestions(): Observable<any> {
    this.loadLocal();
    const listQuestionIds = this.getQuestionIds(this.collection.list);
    return this.getQuestions(listQuestionIds).map(data => {
      this.collection.questions = data;
      this.saveLocal(this.collection);
      return this.collection.questions;
    });
  }

  loadCombinedListAndQuestions(list: Crucio.CollectionListItem[]): Observable<any> {
    this.loadLocal();
    const listQuestionIds = this.getQuestionIds(list);
    return this.getQuestions(listQuestionIds).map(data => {
      this.collection.questions = data;
      this.saveLocal(this.collection);

      const result: any = [];
      for (let i = 0; i < list.length; i++) {
        result.push({ data: list[i], question: this.collection.questions[i] });
      }
      return result;
    });
  }

  analyseCombination(combination: Crucio.CombinationElement[]): any {
    const result: any = {
      correct: 0,
      wrong: 0,
      seen: 0,
      solved: 0,
      free: 0,
      no_answer: 0,
      all: this.getLength(),
      worked: combination.length,
    };

    for (const c of combination) {
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
    for (const c of combination) {
      if (!c.data.mark_answer && c.question.type > 1) {
        let correct = (c.question.correct_answer === c.data.given_result) ? 1 : 0;
        if (c.question.correct_answer === 0) {
          correct = -1;
        }

        if (correct === 1) { // Mark correct answers
          this.setMarkAnswer(this.getIndexOfQuestion(c.question.question_id));
        }

        const data = {
          correct,
          given_result: c.data.given_result,
          question_id: c.question.question_id,
          user_id: this.user.user_id,
        };
        this.api.post('results', data);
      }
    }
  }


  private getQuestions(listOfQuestionIds: number[]): Observable<any> {
    return this.api.get('questions/list', {list: JSON.stringify(listOfQuestionIds)}).map(response => response.list);
  }

  private getQuestionIds(list: Crucio.CollectionListItem[]): number[] {
    const result = [];
    for (let i = 0; i < list.length; i++) {
      result.push(list[i].question_id);
    }
    return result;
  }
}
