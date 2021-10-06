// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
import { UserUtilsService } from '../../crud/utils/user-utils.service';
//import { UserUtilsService } from '../../crud/utils/user.utils.service';

@Injectable()
export class MenuAsideService {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


	constructor(private menuConfigService: MenuConfigService) {
		this.loadMenu();
	}

  loadMenu() {


    var userUtilService = new UserUtilsService()

    const menuItems: any[] = userUtilService.getUserMenu();

    console.log(menuItems);
    //const menuItemss: any[] = JSON.parse(localStorage.getItem(environment.menuBar));
    if (menuItems != null && menuItems != undefined) {

      menuItems.forEach((o, i) => {
        if (o.title == 'User Management') {
          o.submenu = o.submenu.filter(x => x.page != '/user-management/users/add');
        }
      });

      menuItems.unshift({
        title: 'Dashboard',
        root: true,
        icon: 'DashBoard.svg',
        page: '/dashboard',
        translate: 'MENU.DASHBOARD',
        bullet: 'dot'
      });

      //var newmenu = [{
      //  title: 'Dashboard',
      //  root: true,
      //  icon: 'DashBoard.svg',
      //  page: '/dashboard',
      //  translate: 'MENU.DASHBOARD',
      //  bullet: 'dot'
      //}, {
      //  title: 'Test',
      //  root: true,
      //  icon: 'DashBoard.svg',
      //  page: '/loan-recovery/test',
      //  translate: 'MENU.DASHBOARD',
      //  bullet: 'dot'
      //  },
      //   {
      //     title: 'sbs-fa-branch',
      //    root: true,
      //    icon: 'DashBoard.svg',
      //     page: '/loan-recovery/sbs-fa-branch',
      //    translate: 'MENU.DASHBOARD',
      //    bullet: 'dot'
      //  }, {
      //     title: 'fa-branch',
      //    root: true,
      //    icon: 'DashBoard.svg',
      //     page: '/loan-recovery/fa-branch',
      //    translate: 'MENU.DASHBOARD',
      //    bullet: 'dot'
      //  }, {
      //    title: 'Test',
      //    root: true,
      //    icon: 'DashBoard.svg',
      //     page: '/loan-recovery/search-pending-transaction',
      //    translate: 'MENU.DASHBOARD',
      //    bullet: 'dot'
      //  }];

      //this.menuList$.next(newmenu);
    }


    this.menuList$.next(menuItems);






		 //get menu list
		//const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
		//console.log(menuItems);
		//this.menuList$.next(menuItems);
	}
}
