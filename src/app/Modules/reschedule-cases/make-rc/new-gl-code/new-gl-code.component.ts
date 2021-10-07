import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlConfigrationsDetail} from '../../../../core/auth/_models/loan-application-header.model';
//  '../../../../core/auth/_models/loan-application-header.model';
import {LoanService} from '../../../../core/auth/_services/loan.service';
import {finalize} from 'rxjs/operators';
import {LayoutUtilsService} from '../../../../core/_base/crud';


import {NgxSpinnerService} from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'kt-new-gl-code',
    templateUrl: './new-gl-code.component.html',
    styleUrls: ['./new-gl-code.component.scss']
})
export class NewGlCodeComponent implements OnInit {

    aa: any;
    glDialogForm: FormGroup;
    public glConfigrationsDetail = new GlConfigrationsDetail();
    loading: boolean;
    CropDetailList: any;
    GLDetailList: any;
    GlRangeDetailList: any;
    GlSchemeCropDetailList: any;
    SchemeDetailList: any;
    hasFormErrors = false;
    errorShow = false;

    field = false;
    table = false;

    cdlfield = false;
    cdltable = false;

    gdlfield = false;
    gdltable = false;

    glrfield = false;
    glrtable = false;

    glsfield = false;
    glstable = false;

    sdlfield = false;
    sdltable = false;

    bgRow: boolean;

    displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'Unit', 'Rate', 'InstallmentFreq'];

    dv: any;
    count: any;

    dataSource = new MatTableDataSource();

    constructor(private fb: FormBuilder,
                private _loanService: LoanService,
                private spinner: NgxSpinnerService,
                private layoutUtilsService: LayoutUtilsService,
                private dialogRef: MatDialogRef<NewGlCodeComponent>,
                @Inject(MAT_DIALOG_DATA) data
    ) {

        this.aa = data;
        // this.datta(data)
    }

    size = 10; // Default Items Per Page
    // p : number =1;
    pageIndex = 1; // Page Number
    length: any; // Data Length or Total Items from Api


    ngOnInit(): void{
        this.createForm();
        this.setDefaultValue();

        // tslint:disable-next-line:triple-equals
        if (this.glDialogForm.controls.GLCode.value != '') {
            this.getGlCode();
        }


    }

    // tslint:disable-next-line:typedef
    setDefaultValue() {
        this.glDialogForm.controls['GLCode'].setValue(this.aa.NGlC);
    }

    // tslint:disable-next-line:typedef
    paginate(event: any) {
        this.pageIndex = event;
        this.dataSource = this.dv.slice(event * this.size - this.size, event * this.size);
    }

    // tslint:disable-next-line:typedef
    createForm() {
        this.glDialogForm = this.fb.group({
            GLCode: ['', Validators.required],
            SchemeCode: [''],
            CropCode: ['']
        });
    }


    // tslint:disable-next-line:typedef
    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.glDialogForm.controls[controlName].hasError(errorName);
    }


    // tslint:disable-next-line:typedef
    getGlCode() {

        this.spinner.show();
        this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glDialogForm.getRawValue());
        this._loanService.SearchGLCode(this.glConfigrationsDetail)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {

                    console.log(baseResponse);

                    this.table = true;
                    this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
                    this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
                    this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
                    this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
                    this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;

                    // tslint:disable-next-line:triple-equals
                    if (this.CropDetailList == undefined) {
                        this.cdltable = false;
                        this.cdlfield = true;
                    } else {
                        this.cdltable = true;
                        this.cdlfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GLDetailList == undefined) {
                        this.gdltable = false;
                        this.gdlfield = true;
                    } else {
                        this.gdltable = true;
                        this.gdlfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GlRangeDetailList == undefined) {
                        this.glrtable = false;
                        this.glrfield = true;
                    } else {
                        this.glrtable = true;
                        this.glrfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GlSchemeCropDetailList == undefined) {
                        this.glstable = false;
                        this.glsfield = true;
                    } else {
                        this.glstable = true;
                        this.glsfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.SchemeDetailList == undefined) {
                        this.sdltable = false;
                        this.sdlfield = true;
                    } else {
                        this.sdltable = true;
                        this.sdlfield = false;
                    }


                    console.log(this.CropDetailList);
                    console.log(this.GLDetailList);
                    console.log(this.GlRangeDetailList);
                    console.log(this.GlSchemeCropDetailList);
                    console.log(this.SchemeDetailList);


                    this.dv = this.CropDetailList;

                    this.dataSource = new MatTableDataSource(this.CropDetailList.reverse());

                    this.length = this.CropDetailList.length;
                    // this.count = length.count;
                    // for()
                    this.paginate(this.pageIndex);
                    console.log(this.dataSource);
                    // this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                } else {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    // tslint:disable-next-line:typedef
    find() {
        this.spinner.show();
        this.errorShow = false;
        this.hasFormErrors = false;


        if (this.glDialogForm.invalid) {
            const controls = this.glDialogForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            this.table = false;
            this.hasFormErrors = true;
            this.spinner.hide();
            return;
        }

        // tslint:disable-next-line:triple-equals
        if (this.glDialogForm.value == '' && this.glDialogForm.value == undefined && this.glDialogForm.value == null) {
            // this.Field = true;
            this.table = false;
        }

        this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glDialogForm.getRawValue());

        this._loanService.SearchGLCode(this.glConfigrationsDetail)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.table = true;
                    this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
                    this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
                    this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
                    this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
                    this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;


                    console.log(this.CropDetailList);
                    console.log(this.GLDetailList);
                    console.log(this.GlRangeDetailList);
                    console.log(this.GlSchemeCropDetailList);
                    console.log(this.SchemeDetailList);


                    // tslint:disable-next-line:triple-equals
                    if (this.CropDetailList == undefined) {
                        this.cdltable = false;
                        this.cdlfield = true;
                    } else {
                        this.cdltable = true;
                        this.cdlfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GLDetailList == undefined) {
                        this.gdltable = false;
                        this.gdlfield = true;
                    } else {
                        this.gdltable = true;
                        this.gdlfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GlRangeDetailList == undefined) {
                        this.glrtable = false;
                        this.glrfield = true;
                    } else {
                        this.glrtable = true;
                        this.glrfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.GlSchemeCropDetailList == undefined) {
                        this.glstable = false;
                        this.glsfield = true;
                    } else {
                        this.glstable = true;
                        this.glsfield = false;
                    }

                    // tslint:disable-next-line:triple-equals
                    if (this.SchemeDetailList == undefined) {
                        this.sdltable = false;
                        this.sdlfield = true;
                    } else {
                        this.sdltable = true;
                        this.sdlfield = false;
                    }


                    this.dv = this.CropDetailList;

                    this.dataSource = new MatTableDataSource(this.CropDetailList.reverse());

                    this.length = this.CropDetailList.length;
                    // this.count = length.count;
                    // for()
                    this.paginate(this.pageIndex);
                    console.log(this.dataSource);
                    // this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                } else {
                    this.spinner.hide();
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.table = false;
                }
            });
    }

    onCloseClick(): void {

        this.dialogRef.close({data: {}}); // Keep only this row
    }

}
