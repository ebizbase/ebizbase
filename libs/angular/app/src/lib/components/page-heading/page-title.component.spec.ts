import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeading } from './page-heading.component';

describe('PageHeadingComponent', () => {
  let component: PageHeading;
  let fixture: ComponentFixture<PageHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeading],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
