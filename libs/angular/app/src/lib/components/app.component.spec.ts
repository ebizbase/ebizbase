import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EbbApp } from './app.component';

describe('EbbApp', () => {
  let component: EbbApp;
  let fixture: ComponentFixture<EbbApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbbApp, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbbApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
