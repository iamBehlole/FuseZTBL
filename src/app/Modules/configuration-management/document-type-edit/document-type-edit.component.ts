
// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
// RxJS
import { Observable, of, Subscription, from } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// Services and Models

import { delay, finalize } from 'rxjs/operators';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { KtDialogService } from '../../../../core/_base/layout';
import { DocumentTypeService } from '../../../../core/auth/_services/document-type.service';
import { DocumentTypeModel } from '../../../../core/auth/_models/document-type.model';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';


@Component({
  selector: 'kt-document-type-edit',
  templateUrl: './document-type-edit.component.html'
})
export class DocumentTypeEditComponent implements OnInit {

  saving = false;
  submitted = false;
  documentTypeForm: FormGroup;
  public documentType = new DocumentTypeModel();
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;



  constructor(public dialogRef: MatDialogRef<DocumentTypeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private _documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {

    this.documentType.clear();
  
    if (this.data.docuemtnType && this.data.docuemtnType.Id) {
      this.documentType = this.data.docuemtnType;
    }

    this.createForm();
  }




  createForm() {

    this.documentTypeForm = this.formBuilder.group({
      Name: [this.documentType.Name, [Validators.required, Validators.maxLength(30)]],
      NoOfPages: [this.documentType.NoOfPages, [Validators.required, Validators.maxLength(60)]],
    });

  }


  hasError(controlName: string, errorName: string): boolean {
    return this.documentTypeForm.controls[controlName].hasError(errorName);
  }


  get f(): any {
    return this.documentTypeForm.controls;
  }


  onSubmit(): void {

    debugger;
    this.hasFormErrors = false;
    if (this.documentTypeForm.invalid) {
      const controls = this.documentTypeForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    this.documentType = Object.assign(this.documentType, this.documentTypeForm.value);

    if (this.documentType.NoOfPages == '0') {
      this.layoutUtilsService.alertElement("", "Number of pages should greater than zero", "Invalid Number of pages");
      return
    }
    this.submitted = true;
    this.ktDialogService.show();

    if (this.data.docuemtnType.Id > 0) {
      this._documentTypeService
        .UpdateDocumentType(this.documentType)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.ktDialogService.hide();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {
          console.log(baseResponse);
          if (baseResponse.Success === true) {
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          
            this.close(this.documentType);
          }
          else {
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          }
        });
    }

    else {

      this._documentTypeService
        .AddDocumentType(this.documentType)
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
            debugger;
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            this.close(this.documentType);
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
    if (this.data && this.data.docuemtnType.Id) {
      return 'Edit DocumentType';
    }
    return 'New DocumentType';
  }


}
