import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { TimeagoComponent } from '../../directives/timeago/timeago.component';
import { AdminActivityComponent } from './admin-activity.component';

class ApiStubService {
  get(url, data) {
    return Observable.of({
      activities: []
    })
  }
}

describe('AdminActivityComponent', () => {
  let component: AdminActivityComponent;
  let fixture: ComponentFixture<AdminActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminActivityComponent, TimeagoComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
