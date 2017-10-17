import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-learn-oral-exams',
  templateUrl: './learn-oral-exams.component.html',
  styleUrls: ['./learn-oral-exams.component.scss']
})
export class LearnOralExamsComponent implements OnInit {
  oralExams: any;
  private readonly user: Crucio.User;
  oralExamSearch: any;
  distinctSemesters: {semester: number, name: string}[] = [{semester: 0, name: 'Physikum'}, {semester: 1, name: 'Staatsexamen'}];
  distinctYears: {year: number}[];

  constructor(private api: ApiService, private auth: AuthService) {
    this.user = this.auth.getUser();

    this.oralExamSearch = {
      semester: (this.user.semester <= 4 ? this.distinctSemesters[0] : this.distinctSemesters[1])
    };

    this.api.get('oral_exams/distinct').subscribe(result => {
      this.distinctYears = result.years;
    });
  }

  ngOnInit() { }

  searchOralExams() {
    this.oralExams = null;

    if (this.oralExamSearch.query) {
      const data = {
        year: this.oralExamSearch.year && this.oralExamSearch.year.year,
        semester: this.oralExamSearch.semester && this.oralExamSearch.semester.semester,
        query: this.oralExamSearch.query,
        limit: 200,
      };
      this.api.get('oral_exams', data).subscribe(result => {
        this.oralExams = result.oral_exams;
      });
    }
  }
}
