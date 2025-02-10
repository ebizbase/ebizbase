import { Injectable, signal } from '@angular/core';
import { MenuItem, SubMenuItem } from '../models/menu.model';
import { PageInfo } from '../models/page-information.model';

@Injectable({
  providedIn: 'root',
})
export class EbbAppService {
  // sidebar menu
  private _mobileMenusOpened = signal(false);
  private _menus = signal<MenuItem[]>([]);

  // General page config
  private _info = signal<PageInfo | null>(null);

  get menus() {
    return this._menus();
  }

  set menus(menus: MenuItem[]) {
    this._menus.set(menus);
  }

  set pageInfo(info: PageInfo | null) {
    this._info.set(info);
  }

  get pageInfo() {
    return this._info();
  }

  get mobileSidebarOpened() {
    return this._mobileMenusOpened();
  }

  set mobileSidebarOpened(value: boolean) {
    this._mobileMenusOpened.set(value);
  }

  public toggleMobileSidebar() {
    this._mobileMenusOpened.set(!this._mobileMenusOpened());
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }
}
