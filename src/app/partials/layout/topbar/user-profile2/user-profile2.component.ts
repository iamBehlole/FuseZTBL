// Angular
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { ReportService } from '../../../../../core/auth/_services/report.service';
import { finalize } from 'rxjs/operators';

//import 'rxjs/add/operator/takeWhile';
//import 'rxjs/add/observable/timer';

import { MatTableDataSource, MatDialog } from '@angular/material';
import { NotificationDetailsComponent } from '../../../../pages/report-management/Notification-history/notification-details/notification-details.component';
import { Router } from '@angular/router';
@Component({
  selector: 'kt-user-profile2',
  templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
  // Public properties
  user$: Observable<User>;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;

  ShowNotification: boolean;

  notificationCount: string;
  apiTimer: any
  alive = true;
  dataSource = new MatTableDataSource();
  // displayedColumns = ['CreatedBy', 'View'];
  displayedColumns = ['CreatedBy'];
  /**
  * Component constructor
  *
  * @param store: Store<AppState>
  */
  constructor(private store: Store<AppState>,
    private _reportservice: ReportService,
    private _cdf: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router
  ) {
  }

  interval = 10;
  intervalId = 0;
  seconds = this.interval;
  /**
  * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
  */

  /**
  * On init
  */
  ngOnInit(): void {
    this.user$ = this.store.pipe(select(currentUser));

    this.ShowNotification = true;
    //start calling your api every 10 secs
    //Observable.timer(0, 10000)
    //  .takeWhile(() => this.alive) // only fires when component is alive
    //  .subscribe(() => {
    //    this.getDashboardNotification();
    //  });


    this.getDashboardNotification();
  }

  ngOnDestroy() {
    this.clearTimer();
  }
  /**
  * Log out
  */
  logout() {
    this.store.dispatch(new Logout());
  }




  viewAll() {
    this.router.navigateByUrl("/report-management/notification-history");
  }



  getDashboardNotification() {
    
    this.ShowNotification = true;
    this._reportservice.getDashboardNotification()
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.Notifications;
          this.notificationCount = baseResponse.NotificationCount;
          this._cdf.detectChanges();
          if (this.notificationCount > "0") {
            this.ShowNotification = false;
            this._cdf.detectChanges();
          }
         
          this.startTimer();
        }

        else {
        }

      });
   
  }

  viewNotificationLocationDetails(Notification: object) {


    const dialogRef = this.dialog.open(NotificationDetailsComponent, { data: { Notification: Notification }, disableClose: true, panelClass: ['full-screen-modal']});
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }


    });
  }


  startTimer() { this.countDown(); }
  stopTimer() {
    this.clearTimer();
  }

  private clearTimer() { clearInterval(this.intervalId); }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.clearTimer()
        this.seconds = this.interval;
        this.getDashboardNotification()
      }
    }, 1000);
  }


}
