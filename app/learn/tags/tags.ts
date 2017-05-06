import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';

class LearnTagsController {
  private readonly user: Crucio.User;
  private tags: any;
  private distinctTags: any;
  private questionsByTag: any;
  private selectedTag: string;

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService) {
    this.user = Auth.getUser();

    this.loadTags();
  }

  loadTags(): void {
    const data = { user_id: this.user.user_id };
    this.API.get('tags', data).then(result => {
      this.tags = result.data.tags;

      this.distinctTags = [];
      for (const entry of this.tags) {
        for (const tagText of entry.tags.split(',')) {
          if (!this.distinctTags.includes(tagText)) {
            this.distinctTags.push(tagText);
          }
        }
      }

      this.questionsByTag = {};
      for (const distinctTag of this.distinctTags) {
        this.questionsByTag[distinctTag] = [];
        for (const entry of this.tags) {
          for (const tagText of entry.tags.split(',')) {
            if (distinctTag === tagText) {
              this.questionsByTag[distinctTag].push(entry);
            }
          }
        }
      }
    });
  }

  learnTags(method: Crucio.Method): void {
    this.Collection.learn('tags', method, {tag: this.selectedTag, user_id: this.user.user_id});
  }
}

export const LearnTagsComponent = 'learntagsComponent';
app.component(LearnTagsComponent, {
  templateUrl: 'app/learn/tags/tags.html',
  controller: LearnTagsController,
});
