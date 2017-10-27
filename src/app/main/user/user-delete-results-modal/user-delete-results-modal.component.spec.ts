import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../services/api.service';
import { UserDeleteResultsModalComponent } from './user-delete-results-modal.component';

class ApiStubService {

}

describe('UserDeleteResultsModalComponent', () => {
  let component: UserDeleteResultsModalComponent;
  let fixture: ComponentFixture<UserDeleteResultsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteResultsModalComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
