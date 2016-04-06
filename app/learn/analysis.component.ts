class AnalysisController {
  API: API;
  user: User;
  random: number;
  examId: number;
  workedCollection: any;
  count: AnalyseCount;
  exam: Exam;

  constructor(Page, Auth, API, Collection) {
    this.API = API;

    Page.setTitleAndNav('Analyse | Crucio', 'Lernen');

    this.user = Auth.getUser();

    // Post results, but not which are already saved or are free questions
    for (const question of Collection.get().list) {
      if (!question.mark_answer && question.type > 1 && question.given_result > 0) {
        let correct = (question.correct_answer === question.given_result) ? 1 : 0;
        if (question.correct_answer === 0 || question.question.type === 1) {
          correct = -1;
        }

        const data = {
          correct,
          given_result: question.given_result,
          question_id: question.question_id,
          user_id: this.user.user_id,
        };
        this.API.post('results', data);
      }
    }

    function getRandom(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.random = getRandom(0, 1000);

    this.examId = Collection.get().exam_id;
    this.workedCollection = Collection.getWorked();
    this.count = Collection.analyseCount();

    if (this.examId) {
      this.API.get(`exams/${this.examId}`).then(result => {
        this.exam = result.data.exam;
      });
    }
  }

  showCorrectAnswerClicked(index: number) {
    this.workedCollection[index].show_correct_answer = 1;
  }
}

angular.module('crucioApp').component('analysiscomponent', {
  templateUrl: 'app/learn/analysis.html',
  controller: AnalysisController,
});
