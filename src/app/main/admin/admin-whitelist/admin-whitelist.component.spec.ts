import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ApiService } from '../../../services/api.service';
import { AdminWhitelistComponent } from './admin-whitelist.component';

class ApiStubService {
  get(url, data) {
    return of({
      stats: {}
    })
  }
}

describe('AdminWhitelistComponent', () => {
  let component: AdminWhitelistComponent;
  let fixture: ComponentFixture<AdminWhitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminWhitelistComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
