import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationMenu } from './notification-menu.component';

describe('NotificationMenu', () => {
  let component: NotificationMenu;
  let fixture: ComponentFixture<NotificationMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationMenu, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
