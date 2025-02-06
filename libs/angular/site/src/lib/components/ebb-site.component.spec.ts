import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EbbSite } from './ebb-site.component';

describe('EbbSite', () => {
  let component: EbbSite;
  let fixture: ComponentFixture<EbbSite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbbSite, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbbSite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
