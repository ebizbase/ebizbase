import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSubmenu } from './sidebar-submenu.component';

describe('SidebarSubmenu', () => {
  let component: SidebarSubmenu;
  let fixture: ComponentFixture<SidebarSubmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSubmenu],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSubmenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
