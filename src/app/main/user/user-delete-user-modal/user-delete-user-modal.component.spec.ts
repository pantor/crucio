import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../services/api.service';
import { UserDeleteUserModalComponent } from './user-delete-user-modal.component';

class ApiStubService {

}

describe('UserDeleteUserModalComponent', () => {
  let component: UserDeleteUserModalComponent;
  let fixture: ComponentFixture<UserDeleteUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteUserModalComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
