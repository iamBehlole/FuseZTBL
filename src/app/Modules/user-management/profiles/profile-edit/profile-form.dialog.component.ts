// Angular
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
// RxJS
import {Subscription} from 'rxjs';
// Lodash
// NGRX
import {Store} from '@ngrx/store';
// State
// Services and Models
import {delay, finalize} from 'rxjs/operators';
import {FormGroup, Validators, FormBuilder, FormArray, FormControl} from '@angular/forms';
import {RoleEditComponent} from '../role-edit/role-edit.component';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {Profile} from '../../../../core/auth/_models/profile.model';
import { Activity } from 'app/core/auth/_models/activity.model';
import {AppState } from 'app/core/reducers';
import { KtDialogService } from 'app/core/_base/layout';
import { ActivityService } from 'app/core/auth/_services/activity.service';
import { LayoutUtilsService } from 'app/core/_base/crud';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'app/core/auth/_services/profile.service';
import {UserUtilsService} from '../../../../core/_base/crud/utils/user-utils.service';
import { BaseResponseModel } from 'app/core/_base/crud/models/_base.response.model';


@Component({
  selector: 'kt-profile-form.dialog',
  templateUrl: './profile-form.dialog.component.html',
  styleUrls: ['profile-form.dialog.component.scss'],
})
export class ProfileFormDialogComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumnsPortal = ['activityName', 'create', 'read', 'update', 'delete'];
  displayedColumnsActivity = ['activityName'];
  expanded: boolean = false;
  create = 'Cr';
  update = 'U';
  delete = 'D';
  read = 'R';
  loading: boolean;
  AllowShow: boolean;
  ActivityShow: boolean;
  SaveButtonShow: boolean;
  ShowButton: boolean;
  saving = false;
  submitted = false;
  profileForm: FormGroup;
  profile: Profile = new Profile();
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  activities: Activity[] = [];
  baseActivities: Activity[] = [];
  public activity = new Activity();
  userActivities: any[] = [];
  isActivityStringValid: boolean;
  gridHeight: string;
  profiles: any[];
  SingleProfile: any;
  _currentActivity: Activity = new Activity();
  private componentSubscriptions: Subscription;

  /**
   * Component constructor
   *
   * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
   * @param data: any
   * @param store: Store<AppState>
   */
  constructor(
    private store: Store<AppState>,
    private _profileService: ProfileService,
    private formBuilder: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _activityService: ActivityService,
    private _cdf: ChangeDetectorRef,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {

    this.AllowShow = true;
    this.ShowButton = true;
    this.ActivityShow = true;
    this.SaveButtonShow = true;

    this.isActivityStringValid = true;
    this.profileForm = this.formBuilder.group({
      ProfileID: [this.profile.ProfileID, [Validators.required, Validators.maxLength(60)],],
      App: [this.profile.ProfileID],
      Portal: [this.profile.ProfileID]
    });


    this.GetAllProfiles();

    var u = new UserUtilsService();
    this._currentActivity = u.getActivity('Roles');

  }

  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 390 + 'px';
  }


  GetAllProfiles() {

    this._profileService.getAllProfiles()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.ktDialogService.hide();
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.profiles = baseResponse.Profiles;
          this._cdf.detectChanges();
        } else {
          this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        }
      });
  }

  GetActivities() {

    this.activity = new Activity();

    this._activityService.getAllActivities(this.activity).subscribe((response: BaseResponseModel) => {
      this.activities = response.Activities;

      this.dataSource.data = response.Activities;
      this.getBaseActivity();
      this.activities.forEach((o, i) => {

        o.C = false;
        o.R = false;
        o.U = false;
        o.D = false;
      });

    });

  }

  getBaseActivity() {
    this._activityService.getAllActivities(this.activity).subscribe((response: BaseResponseModel) => {
      this.baseActivities = response.Activities;
    });
  }

  isShowActivity(activityId: number, action: string, parentactivityId: string) {

    if (parentactivityId == '0') {
      return false;
    }
    //if (this.activities.length > 0) {
    //  var parent = this.activities.filter(x => x.ActivityID == activityId)[0].ParentActivityID;
    //  if (parent == 0) {
    //    return false;
    //  }
    //}
    if (this.baseActivities.length == 0) {
      return true;
    }
    var activity = this.baseActivities.filter(x => x.ActivityID == activityId)[0];
    if (action == 'Cr') {
      if (activity.C == false) {
        return false;
      } else {
        return true;
      }
    } else if (action == 'R') {
      if (activity.R == false) {
        return false;
      } else {
        return true;
      }
    } else if (action == 'U') {
      if (activity.U == false) {
        return false;
      } else {
        return true;
      }
    } else if (action == 'D') {
      if (activity.D == false) {
        return false;
      } else {
        return true;
      }
    }
  }

  getProfile(ProfileID) {


    this.ShowButton = false;
    this.AllowShow = false;
    this.ActivityShow = false;
    this.SingleProfile = this.profiles.filter(p => p.ProfileID == ProfileID.value);
    this.GetActivities();

    if (true) {
      this.loading = true;
      this.profile.ProfileID = ProfileID.value;
      this._profileService
        .getProfileByID(this.profile)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((baseResponse: any) => {
          if (baseResponse.Success) {
            this.userActivities = baseResponse.Activities;
            document.getElementById('focus-removal').className = document.getElementById('focus-removal').className.replace('mat-focused', '');

            var newActivities = this.userActivities;
            if (this.userActivities.length > 0) {

              this.userActivities.forEach((o, i) => {

                newActivities.forEach((oo, i) => {

                  if (o.ActivityID == oo.ActivityID) {
                    oo.C = o.C;
                    oo.R = o.R;
                    oo.U = o.U;
                    oo.D = o.D;
                    this.changeActivityItemCheckbox(o.ActivityID);
                  }

                });


              });

              // this.profileForm.controls['ProfileID'].setValue(this.userActivities[0].ProfileID);

            }

          } else {
            this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
          }
        });

      this._cdf.detectChanges();
    }
  }

  cbti(value: boolean) {
    if (value) {
      return '1';
    }
    return '0';
  }

  private addCheckboxes() {
    this.activities.forEach((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.profileForm.controls.orders as FormArray).push(control);
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.profileForm.controls[controlName].hasError(errorName);
  }


  changeActivityCheckbox(activityId: number, value: boolean) {
    debugger;
    this.isActivityStringValid = true;
    var activity = this.activities.filter(x => x.ActivityID == activityId)[0];
    if (activity.ParentActivityID == 0) {
      var childActivities = this.activities.filter(
        x => {
          x.ParentActivityID == activityId
        }
        );
      childActivities.forEach((o, i) => {
        this.activities.forEach((oo, i) => {
          if (oo.ActivityID == o.ActivityID) {
            oo.C = value;
            oo.R = value;
            oo.U = value;
            oo.D = value;
            oo.isActivityChecked = value;
          }
        });
      });
    } else {
      this.activities.forEach((o, i) => {
        if (o.ActivityID == activityId) {
          o.C = value;
          o.R = value;
          o.U = value;
          o.D = value;

          //o.C = this.checkDefault(activityId,"C",value);
          //o.R = this.checkDefault(activityId, "R", value);;
          //o.U = this.checkDefault(activityId, "U", value);;
          //o.D = this.checkDefault(activityId, "D", value);;
        }
      });
      this.checkParentActivityCheckbox(activityId);

    }

  }

  checkDefault(activityId: number, action: string, value: boolean) {
    var activity = this.baseActivities.filter(x => x.ActivityID == activityId)[0];
    if (action == 'C') {
      if (activity.C == false) {
        return false;
      } else {
        return value;
      }
    } else if (action == 'R') {
      if (activity.R == false) {
        return false;
      } else {
        return value;
      }
    } else if (action == 'U') {
      if (activity.U == false) {
        return false;
      } else {
        return value;
      }
    } else if (action == 'D') {
      if (activity.D == false) {
        return false;
      } else {
        return value;
      }
    }
  }

  changeActivityItemCheckbox(activityId: number) {

    this.isActivityStringValid = true;
    var parent = this.activities.filter(x => x.ActivityID == activityId)[0];

    this.activities.forEach((o, i) => {
      if (o.ActivityID == activityId) {
        if (o.C == true || o.R == true || o.U == true || o.D == true) {
          o.isActivityChecked = true;
          parent.isActivityChecked = true;
        } else {
          o.isActivityChecked = false;
        }
        o.R = true;
      }
    });
    this.checkParentActivityCheckbox(activityId);
  }

  checkParentActivityCheckbox(activityId: number) {

    var parentActivityId = this.activities.filter(x => x.ActivityID == activityId)[0].ParentActivityID;
    var isParentChecked = false;
    var childActivities = this.activities.filter(x => x.ParentActivityID == parentActivityId);
    childActivities.forEach((o, i) => {
      if (o.isActivityChecked == true) {
        isParentChecked = true;
      }
    });

    this.activities.forEach((o, i) => {
      if (o.ActivityID == parentActivityId) {
        o.isActivityChecked = isParentChecked;
      }
    });
  }

  onSubmit(): void {

    let flat_array = [];
    this.userActivities.forEach(activity => {
      activity.ChildActvities.forEach(child => {
        flat_array.push(child);
      });
    });
    this._profileService
      .updateProfile(flat_array,this.profileForm.value.ProfileID)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          //this.close(this.profile);
        } else {
          this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        }
      });
    // debugger;
    //
    // this.hasFormErrors = false;
    // if (this.profileForm.invalid) {
    //   const controls = this.profileForm.controls;
    //   Object.keys(controls).forEach(controlName =>
    //     controls[controlName].markAsTouched()
    //   );
    //
    //   this.hasFormErrors = true;
    //   return;
    // }
    // this.profile = Object.assign(this.profile, this.profileForm.value);
    //
    // this.activitiesList = '';
    // this.activities.forEach((o, i) => {
    //   if (o.ParentActivityID != 0 && (o.C == true || o.R == true || o.U == true || o.D == true)) {
    //     this.activitiesList = this.activitiesList + '' + (o.ParentActivityID.toString() + ',' + o.ActivityID.toString() + ',' + this.cbti(o.C) + ',' + this.cbti(o.R) + ',' + this.cbti(o.U) + ',' + this.cbti(o.D) + ',' + this.cbti(o.E) + ',' + this.cbti(o.EX) + '|');
    //   }
    // });
    //
    // this.activitiesList = this.activitiesList.substring(0, this.activitiesList.length - 1);
    // if (this.activitiesList == '') {
    //   this.isActivityStringValid = false;
    //   return;
    // } else {
    //   this.isActivityStringValid = true;
    // }
    // this.profile.ActivityList = this.activitiesList;
    // this.submitted = true;
    // this.ktDialogService.show();
    // debugger;
    // if (this.userActivities.length > 0) {
    //   //this.profile.activitiesListAdd = this.profile.activitiesList;
    //   //this.profile.activitiesListDelete = '';
    //   var selectedProfiledata = this.userActivities.filter(x => x.ProfileID == this.profile.ProfileID);
    //   this.profile.ProfileName = selectedProfiledata[0].ProfileName;
    //
    //
    //   debugger;
    //
    //
    //   this._profileService
    //     .updateProfile(this.profile)
    //     .pipe(
    //       finalize(() => {
    //         this.submitted = false;
    //         this.ktDialogService.hide();
    //       })
    //     )
    //     .subscribe((baseResponse: BaseResponseModel) => {
    //       if (baseResponse.Success === true) {
    //         this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
    //         //this.close(this.profile);
    //       } else {
    //         this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
    //       }
    //
    //       //this.auditService.create(PagesEnum.profilesUrl, '/UserManagement/UpdateProfile', AE.Update, baseResponse.isSuccess);
    //     });
    // } else {
    //   this._profileService
    //     .createProfile(this.profile)
    //     .pipe(
    //       finalize(() => {
    //         this.submitted = false;
    //         this.ktDialogService.hide();
    //       })
    //     )
    //     .subscribe((baseResponse: BaseResponseModel) => {
    //
    //       debugger;
    //       if (baseResponse.Success === true) {
    //         this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
    //         //this.close(this.profile);
    //       } else {
    //         this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
    //       }
    //
    //     });
  }


  deleteRole() {
    const _title = 'Role';
    const _description = 'Are you sure to permanently delete this Role?';
    const _waitDesciption = 'Role is deleting...';
    const _deleteMessage = `Role has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      var profile = new Profile();
      profile = this.SingleProfile[0];

      this._profileService.DeleteRole(profile).pipe(
        finalize(() => {

        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          this.GetAllProfiles();
        } else {
          this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        }

      });

    });
    this._cdf.detectChanges();
  }


  editRole() {
    debugger;

    var profile = new Profile();
    profile = this.SingleProfile[0];
    const dialogRef = this.dialog.open(RoleEditComponent, {data: {profile: profile}, disableClose: true});
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.GetAllProfiles();

    });
    this._cdf.detectChanges();
  }

  addRole() {

    debugger;

    var profile = new Profile();
    const dialogRef = this.dialog.open(RoleEditComponent, {data: {profile: profile}, disableClose: true});
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.GetAllProfiles();
    });
    this._cdf.detectChanges();
  }


  /**
   * On destroy
   */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  /**
   * Returns role for save
   */


  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getTitle(): string {
    //if (this.data.profile && this.data.profile.ProfileID) {
    //  return 'Edit Profile';
    //}
    return 'Assign Pages';
  }

  toggleAccordion(i: number) {
    let down_arrow = document.getElementById('arrow_down_' + i).style.display;
    if (down_arrow == 'block') {
      document.getElementById('arrow_down_' + i).style.display = 'none';
      document.getElementById('arrow_up_' + i).style.display = 'block';
      document.getElementById('table_' + i).style.display = 'block';
    } else {
      document.getElementById('arrow_up_' + i).style.display = 'none';
      document.getElementById('arrow_down_' + i).style.display = 'block';
      document.getElementById('table_' + i).style.display = 'none';

    }
  }

  updateActivityDetails(parentActivityId, childActivityID, operation, currentCheckBox) {

    let childActivity = this.userActivities.filter(activity => activity.ActivityID == parentActivityId)[0]
      .ChildActvities.filter(childActivity => childActivity.ActivityID == childActivityID)[0];
    if (operation == 'read') {
      if (currentCheckBox == false) {
        childActivity.R = true;
      } else {
        childActivity.R = false;
      }
    } else if (operation == 'update') {
      if (currentCheckBox == false) {
        childActivity.U = true;
      } else {
        childActivity.U = false;
      }
    } else if (operation == 'create') {
      if (currentCheckBox == false) {
        childActivity.C = true;
      } else {
        childActivity.C = false;
      }
    } else if (operation == 'delete') {
      if (currentCheckBox == false) {
        childActivity.D = true;
      } else {
        childActivity.D = false;
      }
    }

  }

}

