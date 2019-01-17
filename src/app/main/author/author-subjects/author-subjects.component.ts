import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-author-subjects',
  templateUrl: './author-subjects.component.html',
  styleUrls: ['./author-subjects.component.scss']
})
export class AuthorSubjectsComponent implements OnInit {
  subjects: any;

  constructor(private api: ApiService) {
    this.api.get('subjects').subscribe(result => {
      this.subjects = result.subjects;
    });
  }

  ngOnInit() { }
}
