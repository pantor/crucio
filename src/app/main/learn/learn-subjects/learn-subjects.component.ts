import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Collection, CollectionService } from './../../services/collection.service';

@Component({
  selector: 'app-learn-subjects',
  templateUrl: './learn-subjects.component.html',
  styleUrls: ['./learn-subjects.component.scss'],
  providers: [CollectionService]
})
export class LearnSubjectsComponent implements OnInit {
  subjects: any;
  selection: any = {};
  selectedQuestionNumber = 0;
  numberQuestionsInSelection = 0;
  sliderConfig = { min: 0, max: 0 };

  constructor(private api: ApiService, private collection: CollectionService) {
    this.api.get('subjects', { has_questions: true })
      .subscribe(result => this.subjects = result.subjects);
  }

  ngOnInit() { }

  toggleSubject(subjectId: number): void {
    if (!this.selection[subjectId]) {
      this.selection[subjectId] = { subject: true };
    } else {
      this.selection[subjectId].subject = !this.selection[subjectId].subject;
    }

    this.loadNumberQuestions();
  }

  toggleCategory(subjectId: number, categoryId): void {
    if (!this.selection[subjectId]) {
      const categories = {};
      categories[categoryId] = true;
      this.selection[subjectId] = { subject: false, categories: categories };
    } else if (!this.selection[subjectId].categories) {
      const categories = {};
      categories[categoryId] = true;
      this.selection[subjectId].categories = categories;
    } else {
      this.selection[subjectId].categories[categoryId] = !this.selection[subjectId].categories[categoryId];
    }

    this.loadNumberQuestions();
  }

  loadNumberQuestions(): void {
    const data = { selection: this.selection };
    this.api.get('questions/count', data).subscribe(result => {
      this.numberQuestionsInSelection = result.count;

      this.sliderConfig.min = Math.min(this.numberQuestionsInSelection, 1);
      this.sliderConfig.max = Math.min(this.numberQuestionsInSelection, 500);

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
    this.collection.learn('subjects', method, data);
  }
}
