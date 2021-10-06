// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';
// Auth reducers and selectors
import { AppState } from '../../../core/reducers/';
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';
import { BaseResponseModel } from '../../../core/_base/crud/models/_base.response.model';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  currentUser: BaseResponseModel = new BaseResponseModel();
  private subject: BehaviorSubject<boolean>;
  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    var userUtilService = new UserUtilsService();
    var tokenExpired = userUtilService.isTokenExpired();
    this.currentUser = new BaseResponseModel();
    this.currentUser = userUtilService.getUserDetails();

    this.subject = new BehaviorSubject<boolean>(!tokenExpired);

    if (tokenExpired) {
      userUtilService.removeUserDetails();
      //window.location.reload(true);
      this.router.navigateByUrl('/auth/login');
     return;
    }

    var isValidUrl = userUtilService.isValidUrl(state.url);
    //this.subject = new BehaviorSubject<boolean>(isValidUrl);
    if (!isValidUrl) {

      var menu = userUtilService.getUserMenu();
      if (menu == null || menu == undefined) {
        userUtilService.removeUserDetails();
        this.router.navigateByUrl('/auth/login');
        return;
      }
      this.router.navigateByUrl('/auth/unauthorize');
      return;
    }
    //this.router.navigateByUrl('/auth/login');
    return this.subject.asObservable();
  }
}
