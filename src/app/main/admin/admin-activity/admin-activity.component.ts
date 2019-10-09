import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../services/api.service';
import { timer as observableTimer } from 'rxjs';

@Component({
  selector: 'app-admin-activity',
  templateUrl: './admin-activity.component.html',
  styleUrls: ['./admin-activity.component.scss']
})
export class AdminActivityComponent implements OnInit {
  activities: any;
  showActivity: any = {
    result: true,
    login: true,
    register: true,
    comment: true,
    examNew: true,
    examUpdate: true,
  };
  updateActivity = false;

  constructor(private api: ApiService) {
    const timer = observableTimer(2000, 2500);
    timer.subscribe(() => {
      if (this.updateActivity) {
        this.loadActivity();
      }
    });

    this.loadActivity();
  }

  ngOnInit() { }

  loadActivity(): void {
    this.api.get('stats/activities', this.showActivity).subscribe(result => {
      this.activities = result.activities;
    });
  }
}
