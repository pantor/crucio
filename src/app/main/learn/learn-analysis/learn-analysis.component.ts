import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Collection, CollectionService } from '../../services/collection.service';

@Component({
  selector: 'app-learn-analysis',
  templateUrl: './learn-analysis.component.html',
  styleUrls: ['./learn-analysis.component.scss'],
  providers: [CollectionService, ToastService]
})
export class LearnAnalysisComponent implements OnInit {
  workedCombination: Crucio.CombinationElement[];
  workedCollectionList: Crucio.CollectionListItem[];
  readonly user: Crucio.User;
  count: Crucio.AnalyseCount;
  exam: Crucio.Exam;

  constructor(private api: ApiService, private auth: AuthService, public collection: CollectionService, private toast: ToastService) {
    this.user = this.auth.getUser();

    this.workedCollectionList = this.collection.getWorkedList();
    this.collection.loadCombinedListAndQuestions(this.workedCollectionList).subscribe(result => {
      this.workedCombination = result;
      this.count = this.collection.analyseCombination(this.workedCombination);
      this.collection.saveResults(this.workedCombination);
    });

    if (this.collection.getType() === 'exam') {
      this.api.get(`exams/${this.collection.getExamId()}`).subscribe(result => {
        this.exam = result.exam;
      });
    }
  }

  ngOnInit() { }

  showCorrectAnswerClicked(index: number): void {
    this.workedCollectionList[index].mark_answer = 1;
    const questionId = this.workedCollectionList[index].question_id;
    this.collection.setMarkAnswer(this.collection.getIndexOfQuestion(questionId));
  }

  save(): void {
    this.collection.saveRemote().subscribe(result => {
      if (result.status) {
        this.toast.new('Gespeichert');
      } else {
        this.toast.new('Fehler');
      }
    });
  }
}
