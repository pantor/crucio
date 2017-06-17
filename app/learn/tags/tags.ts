import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';

class LearnTagsController {
  private readonly user: Crucio.User;
  private tags: any;
  private distinctTags: {tag: string}[];
  private selectedTag: {tag: string};
  private questionsByTag: any;

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService) {
    this.user = Auth.getUser();

    this.API.get('tags/distinct', { user_id: this.user.user_id }).then(result => {
      this.distinctTags = result.data.tags;

      this.loadTags();
    });
  }

  loadTags(): void {
    const data = { user_id: this.user.user_id };
    this.API.get('tags', data).then(result => {
      this.tags = result.data.tags;

      this.questionsByTag = {};
      for (const distinctTag of this.distinctTags) {
        this.questionsByTag[distinctTag.tag] = [];
        for (const entry of this.tags) {
          for (const tagText of entry.tags.split(',')) {
            if (distinctTag.tag === tagText) {
              this.questionsByTag[distinctTag.tag].push(entry);
            }
          }
        }
      }
    });
  }

  learnTags(method: Crucio.Method): void {
    this.Collection.learn('tags', method, {tag: this.selectedTag.tag, user_id: this.user.user_id});
  }
}

export const LearnTagsComponent = 'learnTagsComponent';
app.component(LearnTagsComponent, {
  templateUrl: 'app/learn/tags/tags.html',
  controller: LearnTagsController,
});
