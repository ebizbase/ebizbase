import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationMenuComponent } from './notification-menu.component';

describe('NotificationMenuComponent', () => {
  let component: NotificationMenuComponent;
  let fixture: ComponentFixture<NotificationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationMenuComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
