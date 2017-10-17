import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Collection, CollectionService } from './../../services/collection.service';

@Component({
  selector: 'app-learn-overview',
  templateUrl: './learn-overview.component.html',
  styleUrls: ['./learn-overview.component.scss'],
  providers: [CollectionService]
})
export class LearnOverviewComponent implements OnInit {
  collections: Collection[];
  private readonly user: Crucio.User;

  constructor(private api: ApiService, private auth: AuthService, private collection: CollectionService) {
    this.user = auth.getUser();

    this.api.get('collections', { user_id: this.user.user_id, limit: 100 })
      .subscribe(result => this.collections = result.collections);
  }

  ngOnInit() { }

  learnCollection(method: Crucio.Method, index: number): void {
    this.collection.learnCollection(method, this.collections[index]);
  }

  removeCollection(index: number): void {
    this.collection.deleteRemote(this.collections[index].collection_id);
    this.collections.splice(index, 1);
  }

  getWorkedList(list): any {
    return list.filter(e => e.given_result);
  }
}
