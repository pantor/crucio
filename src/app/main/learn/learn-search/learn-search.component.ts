import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Collection, CollectionService } from './../../services/collection.service';

@Component({
  selector: 'app-learn-search',
  templateUrl: './learn-search.component.html',
  styleUrls: ['./learn-search.component.scss'],
  providers: [CollectionService]
})
export class LearnSearchComponent implements OnInit {
  readonly user: Crucio.User;
  searchResults: any[];
  distinctSemesters: any;
  distinctSubjects: any;
  questionSearch: any;
  hasSearched = false;
  showSpinner = false;
  limit = 100;

  constructor(private api: ApiService, private auth: AuthService, private collection: CollectionService) {
    this.user = this.auth.getUser();

    this.questionSearch = { semester: { semester: this.user.semester } };

    this.api.get('exams/distinct', { visibility: 1 }).subscribe(result => {
      this.distinctSemesters = result.semesters;
      this.distinctSubjects = result.subjects;
    });
  }

  ngOnInit() { }

  searchQuestion(): void {
    this.hasSearched = false;

    if (this.questionSearch.query) {
      this.showSpinner = true;

      const data = {
        query: this.questionSearch.query,
        subject_id: this.questionSearch.subject && this.questionSearch.subject.subject_id,
        semester: this.questionSearch.semester && this.questionSearch.semester.semester,
        visibility: 1,
        limit: this.limit,
      };
      this.api.get('questions', data).subscribe(result => {
        this.searchResults = result.result;
        this.showSpinner = false;
        this.hasSearched = true;
      });

    } else {
      this.searchResults = null;
    }
  }

  learnQuery(method: Crucio.Method): void {
    this.collection.learn('query', method, {
      query: this.questionSearch.query,
      subject_id: this.questionSearch.subject && this.questionSearch.subject.subject_id,
      semester: this.questionSearch.semester && this.questionSearch.semester.semester,
      limit: this.limit,
      user_id: this.user.user_id,
    });
  }
}
