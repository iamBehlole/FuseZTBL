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

import {delay, finalize} from 'rxjs/operators';

import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
import {KtDialogService} from '../../../../../core/_base/layout';
import {BaseResponseModel} from '../../../../../core/_base/crud/models/_base.response.model';
import {ConfigurationService} from '../../../../../core/auth/_services/configuration.service';
import {Configuration} from '../../../../../core/auth/_models/configuration.model';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'kt-configuration-edit',
  templateUrl: './configuration-edit.component.html'
})
export class ConfigurationEditComponent implements OnInit {

  saving = false;
  submitted = false;
  configurationForm: FormGroup;
  configuration: Configuration = new Configuration();
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  Inputhint: string;
  lovDesc: string;
  lovList: any = [];
  isClob = false;
  isModel = false;
  is_parent: boolean = false;
  editModel: any = {};
  keyValuePatternErrorMessage = null;
  parents: any;

  constructor(public dialogRef: MatDialogRef<ConfigurationEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store<AppState>,
              private _configurationService: ConfigurationService,
              private formBuilder: FormBuilder,
              private layoutUtilsService: LayoutUtilsService,
              private ktDialogService: KtDialogService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.configuration.clear();

    if (this.data.configuration && this.data.configuration.KeyID) {
      this.configuration = this.data.configuration;
    }

    this.createForm();

    this.Inputhint = this.configuration.Description;
    this.getParents();
  }


  createForm() {

    this.configurationForm = this.formBuilder.group({
      KeyName: new FormControl({value: '', disabled: true,}),
      KeyValue: [this.configuration.KeyValue, [Validators.required, Validators.maxLength(60)]],
      KeyValueClob: [this.configuration.KeyValueClob],
      IsParent: [this.configuration.IsParent],
      ParentID: [this.configuration.ParentID]
    });


    this.configurationForm.controls['KeyName'].setValue(this.configuration.KeyName);

  }


  hasError(controlName: string, errorName: string): boolean {
    return this.configurationForm.controls[controlName].hasError(errorName);
  }


  get f(): any {
    return this.configurationForm.controls;
  }


  onSubmit(): void {
    //this.configuration.clear();

    this.hasFormErrors = false;
    if (this.configurationForm.invalid) {
      const controls = this.configurationForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    debugger;
    this.configuration = Object.assign(this.configuration, this.configurationForm.value);

    this.submitted = true;
    this.ktDialogService.show();

    //if (this.data.configuration && this.data.configuration.KeyID > 0) {

    this._configurationService.UpdateConfiguration(this.configuration)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          debugger;
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          this.close(this.configuration);
        } else {
          this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        }
      });
  }


  onChange(params) {
    debugger;
    this.manageKeyValue(params.value);
  }

  manageKeyValue(type: any) {

    debugger;
    if (type == 'String') {
      this.isClob = false;
    }
    if (type == 'Numaric') {

      this.isClob = false;
    }

    if (type == 'CLOB') {

      this.isClob = true;
    }

  }


  close(result: any): void {
    this.dialogRef.close(result);
  }


  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getTitle(): string {
    if (this.data && this.data.configuration.KeyID) {
      return 'Edit configuration';
    }
    return 'New configuration';
  }


  private getParents() {
    this._configurationService.getParents().subscribe((data: any) => {
      this.parents = data.Configurations;
    });
  }

  changedParentStatus() {
    if (this.configurationForm.value.IsParent == false) {
      this.is_parent = false;
    } else {
      this.is_parent = true;
    }
  }
}
