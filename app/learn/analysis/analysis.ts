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

      for (let c of this.workedCombination) {
        if (!c.data.mark_answer && c.question.type > 1) {
          let correct = (c.question.correct_answer === c.data.given_result) ? 1 : 0;
          if (c.question.correct_answer === 0) {
            correct = -1;
          }

          const data = {
            correct,
            given_result: c.data.given_result,
            question_id: c.question.question_id,
            user_id: this.user.user_id,
          };
          this.API.post('results', data);
        }
      }
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

angular.module('crucioApp').component('analysiscomponent', {
  templateUrl: 'app/learn/analysis/analysis.html',
  controller: AnalysisController,
});
