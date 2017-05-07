import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';

class LearnSubjectsController {
  private readonly user: Crucio.User;
  private selection: any;
  private selectedQuestionNumber: number;
  private numberQuestionsInSelection: number;
  private sliderOptions: { floor: number, ceil: number };
  private subjectList: Crucio.Subject[];

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.selection = {};
    this.selectedQuestionNumber = 0;
    this.numberQuestionsInSelection = 0;
    this.sliderOptions = { floor: 0, ceil: this.numberQuestionsInSelection };

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

export const LearnSubjectsComponent = 'learnSubjectsComponent';
app.component(LearnSubjectsComponent, {
  templateUrl: 'app/learn/subjects/subjects.html',
  controller: LearnSubjectsController,
});
