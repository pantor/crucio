import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { ChangePasswordComponent } from './change-password.component';

class ApiStubService {

}

const RouteParams = {
  queryParams: Observable.of({token: 'asdfb'})
};

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: ActivatedRoute, useValue: RouteParams },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
