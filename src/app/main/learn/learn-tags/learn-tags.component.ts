import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CollectionService } from './../../services/collection.service';

@Component({
  selector: 'app-learn-tags',
  templateUrl: './learn-tags.component.html',
  styleUrls: ['./learn-tags.component.scss'],
  providers: [ApiService, AuthService, CollectionService]
})
export class LearnTagsComponent implements OnInit {
  questionsByTag: any;
  readonly user: Crucio.User;
  distinctTags: any;
  tagSearch: any;

  constructor(private api: ApiService, private auth: AuthService, private collection: CollectionService) {
    this.user = this.auth.getUser();

    this.tagSearch = { tag: undefined };

    this.api.get('tags/distinct', { user_id: this.user.user_id }).subscribe(result => {
      this.distinctTags = result.tags;
    });

    this.loadTags();
  }

  ngOnInit() { }

  loadTags(): void {
    const data = { user_id: this.user.user_id };
    this.api.get('tags', data).subscribe(result => {
      const tags = result.tags;

      this.questionsByTag = [];
      for (const tagInfo of tags) {
        for (const tag of tagInfo.tags.split(',')) {
          const idx = this.questionsByTag.findIndex((element) => element.tag === tag);

          if (idx >= 0) {
            this.questionsByTag[idx].list.push(tagInfo);
          } else {
            this.questionsByTag.push({ tag: tag, list: [tagInfo] });
          }
        }
      }
    });
  }

  learnTags(method: Crucio.Method): void {
    this.collection.learn('tags', method, { tag: this.tagSearch.tag.tag, user_id: this.user.user_id });
  }
}
