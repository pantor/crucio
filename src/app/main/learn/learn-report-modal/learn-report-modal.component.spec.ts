import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../services/api.service';
import { LearnReportModalComponent } from './learn-report-modal.component';

class ApiStubService {

}

describe('LearnReportModalComponent', () => {
  let component: LearnReportModalComponent;
  let fixture: ComponentFixture<LearnReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnReportModalComponent ],
      imports: [ FormsModule ],
      providers: [
        NgbActiveModal,
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnReportModalComponent);
    component = fixture.componentInstance;
    component.user = { };
    component.question = { };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
