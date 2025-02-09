import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EcommaRoot } from './ebb-site-root';

describe('EcommaRoot', () => {
  let component: EcommaRoot;
  let fixture: ComponentFixture<EcommaRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcommaRoot, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommaRoot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
