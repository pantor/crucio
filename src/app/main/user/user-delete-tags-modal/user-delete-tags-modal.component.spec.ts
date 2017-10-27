import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../services/api.service';
import { UserDeleteTagsModalComponent } from './user-delete-tags-modal.component';

class ApiStubService {

}

describe('UserDeleteTagsModalComponent', () => {
  let component: UserDeleteTagsModalComponent;
  let fixture: ComponentFixture<UserDeleteTagsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteTagsModalComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteTagsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
