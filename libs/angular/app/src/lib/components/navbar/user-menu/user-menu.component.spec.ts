import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserMenu } from './user-menu.component';

describe('UserMenu', () => {
  let component: UserMenu;
  let fixture: ComponentFixture<UserMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenu, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
