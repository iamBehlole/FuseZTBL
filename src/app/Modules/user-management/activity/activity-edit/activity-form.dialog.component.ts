// Angular
import {Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
// RxJS
import {Observable, of, Subscription, from} from 'rxjs';
// Lodash
import {each, find, some} from 'lodash';
// NGRX
import {Update} from '@ngrx/entity';
import {Store, select} from '@ngrx/store';
// State
import {AppState} from '../../../../../core/reducers';
// Services and Models
import {
  Role,
  Permission,
  selectRoleById,
  RoleUpdated,
  selectAllPermissions,
  selectAllRoles,
  selectLastCreatedRoleId,
  RoleOnServerCreated
} from '../../../../../core/auth';
import {delay, finalize} from 'rxjs/operators';
import {Activity} from '../../../../../core/auth/_models/activity.model';
import {ActivityService} from '../../../../../core/auth/_services/activity.service';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {BaseResponseModel} from '../../../../../core/_base/crud/models/_base.response.model';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
import {KtDialogService} from '../../../../../core/_base/layout';
import {Moment} from 'moment';

@Component({
  selector: 'kt-activity-edit',
  templateUrl: './activity-form.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ActivityFormDialogComponent implements OnInit {

  // Public properties
  saving = false;
  submitted = false;
  isVisible: boolean;
  errorShow: boolean;
  activityForm: FormGroup;
  public activity = new Activity();
  parentActivities: Activity[] = [];
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  private componentSubscriptions: Subscription;

  constructor(public dialogRef: MatDialogRef<ActivityFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store<AppState>,
              private _activityService: ActivityService,
              private formBuilder: FormBuilder,
              private layoutUtilsService: LayoutUtilsService,
              private ktDialogService: KtDialogService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.isVisible = true;
    this.errorShow = false;
    this.activity.clear();
    this._activityService.getParentActivities().subscribe(
      baseResponse => {
        this.parentActivities = baseResponse.Activities;
        console.log('this is parent activities');
        console.log(this.parentActivities);
      }
    );

    if (this.data.activity && this.data.activity.ActivityID) {
      this.activity = this.data.activity;
    }

    if (this.data.activity.IsParent == 1) {
      this.isVisible = false;
    }


    this.activityForm = this.formBuilder.group({
      ActivityName: [this.activity.ActivityName, [Validators.required, Validators.maxLength(30)]],
      ActivityUrl: [this.activity.ActivityUrl],
      ParentActivityID: [this.activity.ParentActivityID],
      TagName: [this.activity.TagName],
      PageIcon: [this.activity.PageIcon],
      IsParent: [this.activity.IsParent],
      ActivityID: [this.activity.ActivityID],
      IsActive: [this.activity.IsActive],
      checkAll: [false],
    });


  }

  hasError(controlName: string, errorName: string): boolean {
    return this.activityForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {


    this.errorShow = false;
    this.hasFormErrors = false;
    if (this.activityForm.invalid) {
      const controls = this.activityForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    debugger;


    this.activity = Object.assign(this.activity, this.activityForm.value);
    if (this.activity.IsParent) {
      this.activity.ParentActivityID = 0;
    } else {
      if (this.activity.ParentActivityID == 1) {

        this.errorShow = true;
        return;
      }
    }


    if (this.activity.ParentActivityID != 0) {

      // @ts-ignore
      this.activity.ParentActivityName = this.parentActivities.filter(x => x.ActivityID == this.activity.ParentActivityID)[0].ActivityName;
    }


    this.submitted = true;
    this.ktDialogService.show();

    if (this.data.activity && this.data.activity.ActivityID > 0) {
      this.activity = Object.assign(this.activity, this.activityForm.value);

      this._activityService
        .updateActivity(this.activity)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.ktDialogService.hide();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {
          console.log(baseResponse);
          if (baseResponse.Success === true) {
            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
            this.close(this.activity);
          } else {
            this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
          }
        });
    } else {

      this._activityService
        .createActivity(this.activity)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.ktDialogService.hide();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {

          debugger;
          console.log('base response');
          console.log(baseResponse);
          if (baseResponse.Success === true) {
            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
            this.close(this.activity);
          } else {
            this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
          }

        });
    }

  }


  showOrHide($event) {
    debugger;
    if ($event.checked === true) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }

  }


  get f(): any {
    return this.activityForm.controls;
  }

  close(result: any): void {
    this.dialogRef.close(result);
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
  prepareActivity(): Activity {
    const _activity = new Activity();
    _activity.ActivityID = this.activity.ActivityID;
    _activity.ActivityName = this.activity.ActivityName;
    _activity.ActivityUrl = this.activity.ActivityUrl;
    _activity.PageIcon = this.activity.PageIcon ? this.activity.PageIcon : '';
    _activity.TagName = this.activity.TagName;

    _activity.ParentActivityID = this.activity.ParentActivityID;
    _activity.IsActive = this.activity.IsActive;
    return _activity;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getTitle(): string {
    if (this.data && this.data.activity.ActivityID) {
      return 'Edit Page';
    }
    return 'New Page';
  }

  onIconPickerSelect(icon: string): void {
    this.activityForm.value.PageIcon = icon;
  }
}
