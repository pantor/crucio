import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';
import PageService from './../../services/page.service';

class AnalysisController {
  private readonly user: Crucio.User;
  private workedCombination: Crucio.CombinationElement[];
  private workedCollectionList: Crucio.CollectionListItem[];
  private count: Crucio.AnalyseCount;
  private exam: Crucio.Exam;

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService) {
    Page.setTitleAndNav('Analyse | Crucio', 'Learn');

    this.user = Auth.getUser();

    this.workedCollectionList = this.Collection.getWorkedList();
    this.Collection.loadCombinedListAndQuestions(this.workedCollectionList).then(result => {
      this.workedCombination = result;
      this.count = this.Collection.analyseCombination(this.workedCombination);
      this.Collection.saveResults(this.workedCombination);
    });

    if (this.Collection.getType() === 'exam') {
      this.API.get(`exams/${Collection.getExamId()}`).then(result => {
        this.exam = result.data.exam;
      });
    }
  }

  showCorrectAnswerClicked(index: number): void {
    this.workedCollectionList[index].mark_answer = 1;
    const questionId = this.workedCollectionList[index].question_id;
    this.Collection.saveMarkAnswer(this.Collection.getIndexOfQuestion(questionId));
  }
}

export const AnalysisComponent = 'analysisComponent';
app.component(AnalysisComponent, {
  templateUrl: 'app/learn/analysis/analysis.html',
  controller: AnalysisController,
});
