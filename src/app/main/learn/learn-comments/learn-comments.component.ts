import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-learn-comments',
  templateUrl: './learn-comments.component.html',
  styleUrls: ['./learn-comments.component.scss']
})
export class LearnCommentsComponent implements OnInit {
  commentsByQuestion: any;
  readonly user: Crucio.User;

  constructor(private api: ApiService, private auth: AuthService) {
    this.user = auth.getUser();

    this.loadComments();
  }

  ngOnInit() { }

  loadComments(): void {
    this.api.get('comments', { user_id: this.user.user_id }).subscribe(result => {
      const comments = result.comments;

      this.commentsByQuestion = [];
      for (const c of comments) {
        let already = false;
        for (const cq of this.commentsByQuestion) {
          if (c.question === cq.question) {
            cq.list.push(c);
            already = true;
            break;
          }
        }

        if (!already) {
          this.commentsByQuestion.push({ question: c.question, list: [ c ] });
        }
      }

      this.commentsByQuestion.sort((a, b) => b.list[0].date - a.list[0].date);
    });
  }
}
