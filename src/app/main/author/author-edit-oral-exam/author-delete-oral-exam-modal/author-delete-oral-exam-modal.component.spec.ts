import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from '../../../../services/api.service';
import { AuthorDeleteOralExamModalComponent } from './author-delete-oral-exam-modal.component';

class ApiStubService {

}

describe('AuthorDeleteOralExamModalComponent', () => {
  let component: AuthorDeleteOralExamModalComponent;
  let fixture: ComponentFixture<AuthorDeleteOralExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDeleteOralExamModalComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDeleteOralExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
