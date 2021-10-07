import {ChangeDetectorRef, Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LovService} from '../../../core/auth/_services/lov.service';
import {
    Lov,
    LovConfigurationKey,
    DateFormats,
} from '../../../core/auth/_models/lov.class';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {finalize} from 'rxjs/operators';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {Branch} from '../../../core/auth/_models/branch.model';
import {Zone} from '../../../core/auth/_models/zone.model';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReschedulingList} from '../../../core/auth/_models/loan-application-header.model';
import {ReschedulingService} from '../../../core/auth/_services/rescheduling.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {BaseRequestModel} from '../../../core/_base/crud/models/_base.request.model';
import {CommonService} from '../../../core/auth/_services/common.service';
import {DatePipe} from '@angular/common';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
    selector: 'kt-request-for-rl',
    templateUrl: './request-for-rl.component.html',
    styleUrls: ['./request-for-rl.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class RequestForRlComponent implements OnInit {

    request = new BaseRequestModel();
    today = new Date();

    RfrlForm: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    errorShow: boolean;
    hasFormErrors = false;
    Field = false;
    Table = false;
    AddTable: boolean;
    checked = false;
    tableArr: any;
    idx: any;
    pidx: any;

    response: any = [];
    checkedArr: ReschedulingList[] = [];
    newAdd: ReschedulingList[] = [];
    graceMonthsSelect = false;

    select: Selection[] = [
        {value: '13', viewValue: '13'},
        {value: '14', viewValue: '14'},
        {value: '15', viewValue: '15'},
        {value: '16', viewValue: '16'},
        {value: '17', viewValue: '17'},
        {value: '18', viewValue: '18'},
        {value: '19', viewValue: '19'},
        {value: '20', viewValue: '20'},
        {value: '21', viewValue: '21'},
        {value: '22', viewValue: '22'},
        {value: '23', viewValue: '23'},
        {value: '24', viewValue: '24'},
    ];


    // Request Category inventory
    RequestTypes: any = [];
    RequestType: any = [];
    SelectedRequestType: any = [];

    // Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    // Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    public LovCall = new Lov();
    public ReschedulingList = new ReschedulingList();

    constructor(
        private fb: FormBuilder,
        private _lovService: LovService,
        private _circleService: CircleService,
        private cdRef: ChangeDetectorRef,
        private _reschedulingService: ReschedulingService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private layoutUtilsService: LayoutUtilsService,
        private _common: CommonService,
        private datePipe: DatePipe,
    ) {
        this.AddTable = false;
    }

    ngOnInit(): void{
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
        // console.log(this.LoggedInUserInfo)
        this.create();

        this.GetZones();

        this.getRequestTypes();

        // this.RfrlForm.controls[Zone].value = this.LoggedInUserInfo.Zone.ZoneName;
        // this.RfrlForm.controls.Branch.value = this.LoggedInUserInfo.Branch.Name

    }

    // tslint:disable-next-line:typedef
    create() {
        this.RfrlForm = this.fb.group({
            Zone: ['', Validators.required],
            Branch: ['', Validators.required],
            Cnic: ['', Validators.required],
            EffectiveReqDate: ['', Validators.required],
            Remarks: ['', Validators.required],
            RequestCategory: ['', Validators.required],
            GraceMonths: ['', Validators.required],
            MPpno: ['', Validators.required],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.RfrlForm.controls[controlName].hasError(errorName);
    }

    // tslint:disable-next-line:typedef
    onAlertClose($event) {
        this.hasFormErrors = false;
    }


    // tslint:disable-next-line:typedef
    GetZones() {
        this._circleService
            .getZones()
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    // tslint:disable-next-line:typedef only-arrow-functions
                    baseResponse.Zones.forEach(function(value) {
                        value.ZoneName = value.ZoneName.split('-')[1];
                    });
                    this.Zones = baseResponse.Zones;
                    this.SelectedZones = this.Zones;
                    console.log('zone loaded');
                    // tslint:disable-next-line:triple-equals
                    if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
                        this.RfrlForm.controls['Zone'].setValue(
                            this.LoggedInUserInfo.Zone.ZoneName
                        );
                        console.log(
                            'this.LoggedInUserInfo.Zone.ZoneId    Request',
                            this.LoggedInUserInfo.Zone.ZoneId
                        );
                        this.GetBranches(this.LoggedInUserInfo.Zone.ZoneId);
                    }
                    // this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
                    // this.GetBranches(this.Zones[0].ZoneId);
                    this.cdRef.detectChanges();
                }
                // else
                //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            });
    }

    // tslint:disable-next-line:typedef
    GetBranches(ZoneId) {
        this.Branches = [];
        this.RfrlForm.controls['Branch'].setValue(null);
        this.Zone.ZoneId = ZoneId.value;
        this._circleService
            .getBranchesByZone(this.Zone)
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.Branches = baseResponse.Branches;
                    this.SelectedBranches = this.Branches;
                    // tslint:disable-next-line:triple-equals
                    if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
                        this.RfrlForm.controls['Branch'].setValue(
                            this.LoggedInUserInfo.Branch.Name
                        );
                        console.log(
                            'this.LoggedInUserInfo.Branch.BranchId    Request',
                            this.LoggedInUserInfo.Branch.BranchId,
                            'this.LoggedInUserInfo.Branch.BranchCode',
                            this.LoggedInUserInfo.Branch.BranchCode
                        );
                    }
                    // this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
                    this.cdRef.detectChanges();
                }
            });
    }

    // -------------------------------Request Type Core Functions-------------------------------//
    // tslint:disable-next-line:typedef
    async getRequestTypes() {
        this.RequestTypes = await this._lovService.CallLovAPI(
            (this.LovCall = {TagName: LovConfigurationKey.RequestCategory})
        );
        this.SelectedRequestType = this.RequestTypes.LOVs;
        console.log(this.SelectedRequestType);
    }

    // tslint:disable-next-line:typedef
    find() {

        this.errorShow = false;
        this.hasFormErrors = false;


        if (this.RfrlForm.invalid) {
            const controls = this.RfrlForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        // tslint:disable-next-line:triple-equals
        if (this.RfrlForm.value == '' && this.RfrlForm.value == undefined && this.RfrlForm.value == null) {
            this.Field = true;
            this.Table = false;
        }
        // else{
        //   this.Table = true;
        // }


        this.spinner.show();
        this.ReschedulingList = Object.assign(
            this.ReschedulingList,
            this.RfrlForm.getRawValue()
        );

        console.log(this.ReschedulingList);
        this._reschedulingService
            .GetRescheduling(this.ReschedulingList)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    console.log(
                        'BaseResponse of Get Reschedule',
                        baseResponse.Loan.ReschedulingList
                    );
                    this.Table = true;
                    this.Field = false;
                    this.response = baseResponse.Loan.ReschedulingList;

                    // this.RfrlForm.controls["Cnic"].setValue('');
                    //   this.RfrlForm.controls["EffectiveReqDate"].setValue('');
                    //   this.RfrlForm.controls["Remarks"].setValue('');
                    //   this.RfrlForm.controls["RequestCategory"].setValue('');
                    //   this.RfrlForm.controls["MPpno"].setValue('');

                    //   this.RfrlForm.get('Cnic').markAsPristine();
                    //   this.RfrlForm.get('Cnic').markAsUntouched();
                    //   this.RfrlForm.get('EffectiveReqDate').markAsUntouched();
                    //    this.RfrlForm.get('EffectiveReqDate').markAsPristine();
                    //    this.RfrlForm.get('Remarks').markAsUntouched();
                    //    this.RfrlForm.get('Remarks').markAsPristine();
                    //    this.RfrlForm.get('RequestCategory').markAsUntouched();
                    //    this.RfrlForm.get('RequestCategory').markAsPristine();
                    //    this.RfrlForm.get('MPpno').markAsUntouched();
                    //    this.RfrlForm.get('MPpno').markAsPristine();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    this.Field = true;
                    this.Table = false;
                }
            });
    }

    // tslint:disable-next-line:typedef
    onChange(id: ReschedulingList, event, index) {

        this.idx = index;
        const ind = index;
        // tslint:disable-next-line:one-variable-per-declaration variable-name
        let prev_i;

        // tslint:disable-next-line:triple-equals
        if (prev_i == undefined || prev_i != ind) {
            prev_i = ind;
            this.pidx = prev_i;
        }

        // tslint:disable-next-line:triple-equals
        if (event.checked == true && this.checkedArr.length == 0) {

            this.checkedArr.push(id);
            console.log('checked array data', this.checkedArr);

            this.AddTable = false;

            // tslint:disable-next-line:triple-equals
        } else if (this.checkedArr.length != 0 && prev_i == index) {

            this.tableArr = this.checkedArr;
        } else {
            for (let i = 0; this.checkedArr.length > i; i++) {
                // tslint:disable-next-line:triple-equals
                if (this.checkedArr[i].LoanAppID == id.LoanAppID) {
                    this.checkedArr.splice(i);
                    console.log('remove array data', this.checkedArr);
                }
            }

        }
    }

    // tslint:disable-next-line:typedef
    onSelectionChange(e) {
        console.log(e.value);
        // tslint:disable-next-line:triple-equals
        if (this.RfrlForm.controls.RequestCategory.value && e.value != '3') {
            this.graceMonthsSelect = false;
            this.RfrlForm.controls['GraceMonths'].setValue('');
            this.RfrlForm.get('GraceMonths').clearValidators();
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        } else {
            this.graceMonthsSelect = true;
            this.RfrlForm.get('GraceMonths').setValidators([Validators.required]);
            this.RfrlForm.get('GraceMonths').updateValueAndValidity();
        }
    }

    // tslint:disable-next-line:typedef
    Add() {
        console.log(this.checkedArr);
        if (this.checkedArr.length > 0) {

            this.AddTable = true;
            this.checked = false;


            this.tableArr = this.checkedArr;

        } else {
            this.AddTable = false;
        }
    }

    // tslint:disable-next-line:typedef
    submitData() {
        this.spinner.show();
        this.request = new BaseRequestModel();
        const shantoo = this.RfrlForm.controls.EffectiveReqDate.value;
        console.log(shantoo._d);
        const newDate = this.datePipe.transform(shantoo._d, 'ddMMyyyy');
        console.log(newDate);
        // tslint:disable-next-line:prefer-const
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        for (let i = 0; this.checkedArr.length > i; i++) {
            this.checkedArr[i].ManagerPPNo = this.RfrlForm.controls['MPpno'].value;

            this.checkedArr[i].EffectiveReqDate = newDate;
            this.checkedArr[i].Remarks = this.RfrlForm.controls['Remarks'].value;
            this.checkedArr[i].RequestCategory = this.RfrlForm.controls['RequestCategory'].value;
            this.checkedArr[i].Cnic = this.RfrlForm.controls['Cnic'].value;
            this.checkedArr[i].McoPPNO = userInfo.User.UserName;
        }
        this._reschedulingService
            .AddReschedulLoanInstallment(this.checkedArr)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    // tslint:disable-next-line:typedef
    deleteRow(index: any) {
        this.checkedArr.splice(index);
    }

    // tslint:disable-next-line:typedef
    cancelData() {
        for (let i = 0; this.checkedArr.length > i; i++) {
            this.checkedArr.splice(i);
        }
        console.log(this.checkedArr);
    }

}

export interface Selection {
    value: string;
    viewValue: string;
}

export class ReschedulingGrid {
    CustomerID: string;
    LoanAppID: number;
    LoanDisbID: number;
    BranchCode: string;
    Cnic: string;
    LoanCaseNo: string;
    GlSubCode: string;
    OsPrin: number;
    OsMarkup: number;
    DisbStatusID: number;
    CustomerName: string;
    FatherName: string;
    PermanentAddress: string;
    GlSubname: string;
    MajorBorrower: string;
    GlSubID: number;
    EffectiveReqDate: string;
    UserID: string;
    GraceMonths: number;
    RequestCategory: number;
    RequestStatus: number;
    BranchID: string;
    ManagerPPNo: number;
    McoPPNO: number;
    Remarks: string;
    ID: string;
}
