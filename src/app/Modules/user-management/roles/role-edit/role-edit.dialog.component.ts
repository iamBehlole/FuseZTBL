// Angular
import {Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, of, Subscription} from 'rxjs';

import {finalize} from 'rxjs/operators';
// Lodash
import {each, find, some} from 'lodash';
// NGRX
import {Store, select} from '@ngrx/store';
import {Permission, Role } from 'app/core/auth';
import {Profile} from '../../../../core/auth/_models/profile.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppState } from 'app/core/reducers';
import { ProfileService } from 'app/core/auth/_services/profile.service';
import { LayoutUtilsService } from 'app/core/_base/crud';
// State
// Services and Models

@Component({
  selector: 'kt-role-edit-dialog',
  templateUrl: './role-edit.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RoleEditDialogComponent implements OnInit, OnDestroy {
  // Public properties

  roleForm: FormGroup;
  role: Role;
  LOVs;
  caseUpdate = false;
  role$: Observable<Role>;
  public profile = new Profile;
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  allPermissions$: Observable<Permission[]>;
  rolePermissions: Permission[] = [];
  // Private properties
  private componentSubscriptions: Subscription;

  /**
   * Component constructor
   *
   * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
   * @param data: any
   * @param store: Store<AppState>
   */
  constructor(public dialogRef: MatDialogRef<RoleEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store<AppState>,
              private fb: FormBuilder,
              private _profileService: ProfileService,
              private layoutUtilsService: LayoutUtilsService) {


  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.setup();
    // console.log("dialog data"+this.data);
    this.getRoles();
    this.createForm();

  }

  setup() {
    this.profile = this.data.profile;
    if (this.data.profile.ProfileID > 0) {
      this.caseUpdate = true;
    } else {
      this.caseUpdate = false;
    }
  }

  getRoles() {
    // this.spinner.show();
    this._profileService
      .getRoleGroups()
      .pipe(finalize(() => {
        // this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {

          this.LOVs = baseResponse.LOVs;
          console.log(this.LOVs);
          debugger


          // this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;
          // console.log(this.dataSource);
          // this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code
          );
        }
        debugger
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }


  createForm() {
    this.roleForm = this.fb.group({
      ProfileID: [this.profile.ProfileID, Validators.required],
      ProfileName: [this.profile.ProfileName, Validators.required],
      ProfileDesc: [this.profile.ProfileDesc, Validators.required],
      ActivityList: [this.profile.ActivityList, Validators.required],
      ChannelID: [this.profile.ChannelID, Validators.required],
      CreatedBy: [this.profile.CreatedBy, Validators.required],
      UpdatedBy: [this.profile.UpdatedBy, Validators.required],
      EndedBy: [this.profile.EndedBy, Validators.required],
      Status: [this.profile.Status, Validators.required],
      isSelected: [this.profile.isSelected, Validators.required],
      AccessToData: [this.profile.AccessToData, Validators.required],

    });

    if (this.caseUpdate == true) {
      this.roleForm.controls.ProfileID.disable();
    }

  }


  /** ACTIONS */
  /**
   * Returns permissions ids
   */
  preparePermissionIds(): number[] {
    const result = [];
    each(this.rolePermissions, (_root: Permission) => {
      if (_root.isSelected) {
        result.push(_root.id);
        each(_root._children, (_child: Permission) => {
          if (_child.isSelected) {
            result.push(_child.id);
          }
        });
      }
    });
    return result;
  }

  /**
   * Returns role for save
   */
  prepareRole(): Role {
    const _role = new Role();
    _role.id = this.role.id;
    _role.permissions = this.preparePermissionIds();
    // each(this.assignedRoles, (_role: Role) => _user.roles.push(_role.id));
    _role.title = this.role.title;
    _role.isCoreRole = this.role.isCoreRole;
    return _role;
  }

  /**
   * Save data
   */
  onSubmit() {
    // this.hasFormErrors = false;
    // this.loadingAfterSubmit = false;
    // /** check form */
    // if (!this.isTitleValid()) {
    // 	this.hasFormErrors = true;
    // 	return;
    // }

    // const editedRole = this.prepareRole();
    // if (editedRole.id > 0) {
    // 	this.updateRole(editedRole);
    // } else {
    // 	this.createRole(editedRole);
    // }

    this.profile = Object.assign(this.profile, this.roleForm.value);

    if (this.caseUpdate == true) {
      this.Update(this.profile);
    } else {
      //  this.caseUpdate==false;
      this.Add(this.profile);
    }
  }

  Update(val: any) {

    this._profileService
      .UpdateRole(val)
      .pipe(finalize(() => {
        // this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          const message = `Polygon has been updated successfully`;
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          debugger

        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code
          );
        }
        debugger
      });
  }

  Add(val: any) {

    this._profileService.AddNewRole(val)
      .pipe(finalize(() => {
        this.caseUpdate = false;
        // this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          debugger

        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message,
            baseResponse.Code
          );
        }
        debugger
      });
  }

  /** UI */
  /**
   * Returns component title
   */
  getTitle(): string {
    if (this.caseUpdate == true) {
      // tslint:disable-next-line:no-string-throw
      return 'Edit role';
    }

    // tslint:disable-next-line:no-string-throw
    return 'New role';
  }

  /**
   * Returns is title valid
   */
  isTitleValid(): boolean {
    return (this.role && this.role.title && this.role.title.length > 0);
  }
}
