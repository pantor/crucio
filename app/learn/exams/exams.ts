import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';

class LearnExamsController {
  private readonly user: Crucio.User;
  private examSearch: any;
  private exams: Crucio.Exam[];
  private distinctSemesters: any;
  private distinctSubjects: any;

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.examSearch = { semester: this.user.semester };


    this.API.get('exams/distinct', {visibility: 1}).then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctSubjects = result.data.subjects;
    });

    this.loadExams();

    // fresh login
    // var body = document.getElementsByTagName('body')[0];
    // body.className = body.className + ' body-animated';
  }

  loadExams(): void {
    const data = {
      user_id: this.user.user_id,
      semester: this.examSearch.semester,
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      query: this.examSearch.query,
      visibility: 1,
    };
    this.API.get('exams', data).then(result => {
      this.exams = result.data.exams;
    });
  }

  learnExam(method: Crucio.Method, examId: number): void {
    const data = { examId, random: 0 };
    this.Collection.learn('exam', method, data);
  }

  resetExam(exam: Crucio.Exam): void {
    exam.answered_questions = 0;
    this.API.delete(`results/${this.user.user_id}/${exam.exam_id}`, true);
  }
}

export const LearnExamsComponent = 'learnexamsComponent';
app.component(LearnExamsComponent, {
  templateUrl: 'app/learn/exams/exams.html',
  controller: LearnExamsController,
});
