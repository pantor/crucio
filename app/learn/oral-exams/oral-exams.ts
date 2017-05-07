import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';

class LearnOralExamsController {
  private readonly user: Crucio.User;
  private oralExamSearch: any;
  private oralExams: Crucio.OralExam[];
  private distinctOralSemesters: any;
  private distinctOralYears: any;
  private hasSearched: boolean;

  constructor(Auth: AuthService, private readonly API: APIService, $scope: angular.IScope, $location: angular.ILocationService, $timeout: angular.ITimeoutService) {
    this.user = Auth.getUser();

    this.oralExamSearch = {
      semester: (this.user.semester <= 4 ? { semester: 0, name: 'Physikum' } : { semester: 1, name: 'Staatsexamen' })
    };

    this.API.get('oral_exams/distinct', {visibility: 1}).then(result => {
      this.distinctOralSemesters = result.data.semesters;
      this.distinctOralYears = result.data.years;
    });
  }

  searchOralExams(): void {
    this.oralExams = []; // Reset search results on empty query
    this.hasSearched = false;

    if (this.oralExamSearch.query) {
      const data = {
        semester: this.oralExamSearch.semester && this.oralExamSearch.semester.semester,
        year: this.oralExamSearch.year && this.oralExamSearch.year.year,
        query: this.oralExamSearch.query,
        limit: 200,
      };
      this.API.get('oral_exams', data).then(result => {
        this.oralExams = result.data.oral_exams;

        this.hasSearched = true;
      });
    }
  }
}

export const LearnOralExamsComponent = 'learnOralExamsComponent';
app.component(LearnOralExamsComponent, {
  templateUrl: 'app/learn/oral-exams/oral-exams.html',
  controller: LearnOralExamsController,
});
