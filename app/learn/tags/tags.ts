class LearnTagsController {
  readonly API: API;
  readonly user: Crucio.User;
  tags: any;
  distinctTags: any;
  questionsByTag: any;

  constructor(Auth: Auth, API: API) {
    this.API = API;

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
}

angular.module('crucioApp').component('learntagscomponent', {
  templateUrl: 'app/learn/tags/tags.html',
  controller: LearnTagsController,
});
