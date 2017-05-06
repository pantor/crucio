import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import CollectionService from './../../services/collection.service';

class LearnOverviewController {
  private readonly user: Crucio.User;
  private collections: Crucio.Collection[];
  private ready: number;

  constructor(Auth: AuthService, private readonly API: APIService, private readonly Collection: CollectionService) {
    this.user = Auth.getUser();

    this.API.get('collections', { user_id: this.user.user_id, limit: 100 }).then(result => {
      this.collections = result.data.collections;
      this.ready = 1;
    });

    // fresh login
    // var body = document.getElementsByTagName('body')[0];
    // body.className = body.className + ' body-animated';
  }

  learnCollection(method: Crucio.Method, index: number): void {
    this.Collection.learnCollection(method, this.collections[index]);
  }

  removeCollection(index: number): void {
    this.Collection.delete(this.collections[index].collection_id);
    this.collections.splice(index, 1);
  }

  getWorkedList(list): any {
    return list.filter(e => e.given_result);
  }
}

export const LearnOverviewComponent = 'learnoverviewComponent';
app.component(LearnOverviewComponent, {
  templateUrl: 'app/learn/overview/overview.html',
  controller: LearnOverviewController,
});
