import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';


// RxJS
import { Observable, of, Subscription, from } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// Services and Models

import { delay, finalize } from 'rxjs/operators';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { KtDialogService } from '../../../../../core/_base/layout';
import { DocumentTypeService } from '../../../../../core/auth/_services/document-type.service';
import { DocumentTypeModel } from '../../../../../core/auth/_models/document-type.model';
import { BaseResponseModel } from '../../../../../core/_base/crud/models/_base.response.model';
import { ProfileService } from '../../../../../core/auth/_services/profile.service';
import { Profile } from '../../../../../core/auth/_models/profile.model';
import { Activity } from '../../../../../core/auth/_models/activity.model';
import { UserUtilsService } from '../../../../../core/_base/crud/utils/user-utils.service';

@Component({
  selector: 'kt-role-edit',
  templateUrl: './role-edit.component.html'
})
export class RoleEditComponent implements OnInit {

  saving = false;
  submitted = false;
  LOVs;
  roleForm: FormGroup;
  profile: Profile = new Profile();
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  _currentActivity: Activity = new Activity();

  //AccessToData = [{ Id: "1", Name: "Zone" },
  //{ Id: "2", Name: "Branch" },
  //{ Id: "3", Name: "All" }]

  AccessToData = [
    { Id: "1", Name: "All" },
    { Id: "2", Name: "Zone" },
    { Id: "3", Name: "Branch" }]


  constructor(public dialogRef: MatDialogRef<RoleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private _documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {

    this.getRoles();
    debugger;
    // var u = new UserUtilsService();
    //this._currentActivity = u.getActivity('Circles');

    debugger;
    if (this.data.profile && this.data.profile.ProfileID > 0) {
      this.profile = this.data.profile;
    }

    this.createForm();
  }

  getRoles(){

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
              "",
              baseResponse.Message,
              baseResponse.Code
            );
          }
          debugger
        });
      }



  //regex edited from https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  createForm() {
    this.roleForm = this.formBuilder.group({
      /*ProfileName: [this.profile.ProfileName, [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')]],*/
      ProfileName: [this.profile.ProfileName, [Validators.required, Validators.pattern('^(?=.{2,30}$)(?![_. ])(?!.*[_. ]{2})[a-zA-Z0-9._ ]+(?<![_. ])$')]],
      AccessToData: [1, [Validators.required]],
      ProfileID:[this.profile.ProfileID, [Validators.required]]

    });

  }


  hasError(controlName: string, errorName: string): boolean {
    return this.roleForm.controls[controlName].hasError(errorName);
  }


  get f(): any {
    return this.roleForm.controls;
  }


  onSubmit(): void {

    this.hasFormErrors = false;
    if (this.roleForm.invalid) {
      const controls = this.roleForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    this.profile = Object.assign(this.profile, this.roleForm.value);

    this.submitted = true;
    this.ktDialogService.show();

    if (this.data.profile.ProfileID > 0) {

console.log(this.profile)
      this._profileService.UpdateRole(this.profile)
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
            const message = `Polygon has been updated successfully`;
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            this.close(this.profile);
          }
          else {
            const message = `An error occure.`;
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          }

        });

    }



    else {
      this._profileService.AddNewRole(this.profile)
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
            const message = `Polygon has been updated successfully`;
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            console.log(this.profile);
            this.close(this.profile);
          }
          else {
            const message = `An error occure.`;
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          }

        });

    }


  }



  close(result: any): void {
    this.dialogRef.close(result);
  }



  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getTitle(): string {


    if (this.data.profile.ProfileID > 0) {

      return 'Edit Role';
    }
    return 'New Role';
  }
}
