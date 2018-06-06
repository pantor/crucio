import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss']
})
export class AdminStatsComponent implements OnInit {
  stats: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('stats/summary', { has_questions: true }).subscribe(result => {
      this.stats = result.stats;
    });
  }
}
