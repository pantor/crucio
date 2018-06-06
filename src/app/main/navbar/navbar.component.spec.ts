import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from './navbar.component';

class AuthServiceStub {
  getUser(): any { return {}; }
  logout(): void { }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [ { provide: AuthService, useClass: AuthServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
