import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from '../../../../services/api.service';
import { AuthorDeleteExamModalComponent } from './author-delete-exam-modal.component';

class ApiStubService {

}

describe('AuthorDeleteExamModalComponent', () => {
  let component: AuthorDeleteExamModalComponent;
  let fixture: ComponentFixture<AuthorDeleteExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDeleteExamModalComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDeleteExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
