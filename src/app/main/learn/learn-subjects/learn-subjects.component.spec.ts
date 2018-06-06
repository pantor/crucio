import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from '../../services/collection.service';
import { ApiService } from '../../../services/api.service';
import { LearnSubjectsComponent } from './learn-subjects.component';

class ApiStubService {
  get(url, data) {
    return Observable.of({ subjects: [] });
  }
}

class CollectionStubService {

}

describe('LearnSubjectsComponent', () => {
  let component: LearnSubjectsComponent;
  let fixture: ComponentFixture<LearnSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSubjectsComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .overrideComponent(LearnSubjectsComponent, {
      set: {
        providers: [
          { provide: CollectionService, useClass: CollectionStubService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
