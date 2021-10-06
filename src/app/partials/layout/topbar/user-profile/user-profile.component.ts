// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { UserUtilsService } from '../../../../../core/_base/crud/utils/user-utils.service';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

  userName: string;
  BranchName: string;
  DisplayName: string;
	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
  @Input() icon: boolean;
  displayNameShow: boolean;
  userNameShow: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
  constructor(private store: Store<AppState>
  ) {
	}
  /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

	/**
	 * On init
	 */
  ngOnInit(): void {

    this.displayNameShow = false;
    this.userNameShow = false;
    var userUtilsService = new UserUtilsService();

    var userInfo = userUtilsService.getUserDetails();

    this.userName = userInfo.User.UserName;
    this.DisplayName = userInfo.User.DisplayName;
    if (userInfo.Branch)
    {
      this.BranchName = userInfo.Branch.Name;
    }
    else
    {
      this.BranchName = '';

    }

    if (this.DisplayName == "Admin") {
      this.displayNameShow = true;
    }
    else {

      this.userNameShow = true;
    }

  }



	changePassword() {
		//this.router.navigateByUrl('/auth/change-password');
	}
	/**
	 * Log out
	 */
  logout() {

    var userUtilsService = new UserUtilsService();
    userUtilsService.removeUserDetails();
    localStorage.clear();
    window.location.reload(true);

    //this.userService
    //  .logout()
    //  .pipe(
    //    finalize(() => {
    //      var userUtilsService = new UserUtilsService();
    //      userUtilsService.removeUserDetails();
    //      window.location.reload(true);
    //    })
    //  )
    //  .subscribe((baseResponse: BaseResponseModel) => {
    //    console.log(baseResponse);
    //  });
    //this.store.dispatch(new Logout());
  }
}
