import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-author-oral-exams',
  templateUrl: './author-oral-exams.component.html',
  styleUrls: ['./author-oral-exams.component.scss']
})
export class AuthorOralExamsComponent implements OnInit {
  oralExams: Crucio.OralExam[];
  oralExamSearch: any;
  distinctSemesters: {semester: number, name: string}[] = [{semester: 0, name: 'Physikum'}, {semester: 1, name: 'Staatsexamen'}];
  distinctYears: {year: number}[];

  constructor(private api: ApiService, private router: Router) {
    this.oralExamSearch = {};

    this.api.get('oral_exams/distinct').subscribe(result => {
      this.distinctYears = result.years;
    });

    this.loadOralExams();
  }

  ngOnInit() { }

  loadOralExams() {
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

  newOralExam() {
    const data = {
      examiner_count: 3,
      semester: 0,
      year: 2016,
    };
    this.api.post('oral_exams', data).subscribe(result => {
      this.router.navigate(['/app/edit-oral-exam'], { queryParams: { oralExamId: result.oral_exam_id } });
    });
  }
}
