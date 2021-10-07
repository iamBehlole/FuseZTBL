import {ChangeDetectorRef, Component, OnInit, Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
// RXJS
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {LovService} from '../../../core/auth/_services/lov.service';
import {DateFormats, Lov, LovConfigurationKey} from '../../../core/auth/_models/lov.class';
import {LoanService} from '../../../core/auth/_services/loan.service';
import {Loan, LoanSecurities} from '../../../core/auth/_models/loan-application-header.model';

@Component({
    selector: 'kt-cl-securities',
    templateUrl: './cl-securities.component.html',
    styleUrls: ['./cl-securities.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ]
})
export class ClSecuritiesComponent implements OnInit {


    @Input() loanDetail: Loan;

    customerLandList: any = [];
    public LovCall = new Lov();
    LoggedInUserInfo: BaseResponseModel;
    LoanSecuritiesForm: FormGroup;
    public loanSecurities = new LoanSecurities();
    loanSecuritiesArray: LoanSecurities[] = [];
    editLoanSecuritiesArray: LoanSecurities[] = [];


    //Loan Type inventory
    SecurityTypes: any = [];
    securityType: any = [];
    SelectedSecurityType: any = [];

    //Loan Type inventory
    areaQuantity: any = [];
    areaQuantities: any = [];
    SelectedAreaQuantities: any = [];

    hasFormErrors = false;

    isSecuritiesFormInProgress: boolean;
    currentSelectedSecurityType: string;
    currentUpdateSecurityRecordId: number;

    constructor(
        private _loanService: LoanService,
        private _cdf: ChangeDetectorRef,
        private _lovService: LovService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit() {
        this.isSecuritiesFormInProgress = false;
        this.currentUpdateSecurityRecordId = 0;
        this.createForm();
        //this.getCustomerLand();
        this.getSecurityType();
        this.getAreaQuantity();
    }


    async getSecurityType() {
        this.SecurityTypes = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.SecurityType});

        this.SelectedSecurityType = this.SecurityTypes.LOVs;


    }

    searchSecurityType(securityTypeId) {
        securityTypeId = securityTypeId.toLowerCase();
        if (securityTypeId != null && securityTypeId != undefined && securityTypeId != '') {
            this.SelectedSecurityType = this.SecurityTypes.LOVs.filter(x => x.Name.toLowerCase().indexOf(securityTypeId) > -1);
        } else {
            this.SelectedSecurityType = this.SecurityTypes.LOVs;
        }
    }

    validateSecurityTypeOnFocusOut() {

        if (this.SelectedSecurityType.length == 0) {
            this.SelectedSecurityType = this.SecurityTypes.LOVs;
        }
    }

    setSecurityTypeValue(event: MatSelectChange) {
        this.currentSelectedSecurityType = event.source.triggerValue;
        ``;
    }

    async getAreaQuantity() {
        this.areaQuantities = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Quantity});

        this.SelectedAreaQuantities = this.areaQuantities.LOVs;

    }

    searchAreaQuantit(areaId) {
        areaId = areaId.toLowerCase();
        if (areaId != null && areaId != undefined && areaId != '') {
            this.SelectedAreaQuantities = this.areaQuantities.filter(x => x.Name.toLowerCase().indexOf(areaId) > -1);
        } else {
            this.SelectedAreaQuantities = this.areaQuantities;
        }
    }

    validateAreaQuantitOnFocusOut() {
        if (this.SelectedAreaQuantities.length == 0) {
            this.SelectedAreaQuantities = this.areaQuantities;
        }
    }

    createForm() {
        this.LoanSecuritiesForm = this.formBuilder.group({
            CollTypeID: [this.loanSecurities.CollTypeID], // security type
            BasisofMutation: [this.loanSecurities.BasisofMutation],
            QuantityUnit: [this.loanSecurities.QuantityUnit, [Validators.required]], //quantity area
            Quantity: [this.loanSecurities.Quantity], //quantity area
            UnitPrice: [this.loanSecurities.UnitPrice, [Validators.required]], // unit price

        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.LoanSecuritiesForm.controls[controlName].hasError(errorName);
    }

    loadAppSecuritiesDataOnUpdate(appSecuritiesData) {


        this.editLoanSecuritiesArray = appSecuritiesData;
        console.log('in app Securities console');
        console.log(appSecuritiesData);

        var tempCustomerArray: SecuritiesGrid[] = [];
        if (appSecuritiesData.length != 0) {
            appSecuritiesData.forEach(function(item, key) {

                var grid = new SecuritiesGrid();
                debugger
                grid.EnteredBy = item.EnteredBy;
                grid.CollTypeID = item.CollTypeID;
                grid.QuantityUnit = item.QuantityUnit;
                grid.Remarks = item.Remarks;
                grid.BasisofMutation = item.BasisofMutation;
                grid.AppSecurityID = item.AppSecurityID;
                grid.LoanAppID = item.LoanAppID;
                grid.UnitPrice = item.UnitPrice;
                grid.PludgedValue = item.PludgedValue;
                grid.MaxCreditLimit = item.MaxCreditLimit;
                grid.Quantity = item.Quantity;
                grid.EnteredDate = item.EnteredDate;
                grid.SecurityType = item.SecurityType;
                grid.OrgUnitID = item.OrgUnitID;
                tempCustomerArray.push(grid);


            });
        }
        debugger
        this.loanSecuritiesArray = tempCustomerArray;
    }

    getCustomerLand() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage('', 'Application Header Info Not Found');
            return;
        }


        this._loanService.getCustomerLand(this.loanDetail.ApplicationHeader.LoanAppID)
            .pipe(
                finalize(() => {
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.customerLandList = baseResponse.Loan.CustomersLoanLands;

                this._cdf.detectChanges();
            }
            //else
            //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });
    }

    attachCustomerLandtoLoan() {


        console.log(this.customerLandList);
        if (this.customerLandList.length > 0) {
            this.spinner.show();
            this._loanService.attachCustomersLand(this.customerLandList, this.loanDetail.TranId)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                ).subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                } else {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                }
            });
        } else {
            this.layoutUtilsService.alertMessage('', 'Customer land details not found');
        }
    }

    onSaveLoanSecurities() {
        debugger
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage('', 'Application Header Info Not Found');
            return;
        }

        this.hasFormErrors = false;
        if (this.LoanSecuritiesForm.invalid) {
            const controls = this.LoanSecuritiesForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        this.loanSecurities = Object.assign(this.loanSecurities, this.LoanSecuritiesForm.getRawValue());

        this.loanSecurities.Quantity = parseInt(this.LoanSecuritiesForm.controls['Quantity'].value);
        this.loanSecurities.UnitPrice = parseInt(this.LoanSecuritiesForm.controls['UnitPrice'].value);

        this.loanSecurities.PludgedValue = this.loanSecurities.Quantity * this.loanSecurities.UnitPrice;
//    if (this.loanSecurities.MaxCreditLimit = null, this.loanSecurities.MaxCreditLimit = undefined
//    ) {
//      this.loanSecurities.MaxCreditLimit = 0;
//}

        this.loanSecurities.Remarks = '';
        this.loanSecurities.AppSecurityID = this.currentUpdateSecurityRecordId;
        this.loanSecurities.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
        //this.loanSecurities.LoanAppID = 0;
        this.loanSecurities.BasisofMutation = 'PIU';
        this.loanSecurities.EnteredDate = this.datePipe.transform(new Date(), 'ddMMyyyy');

        this.loanSecurities.SecurityType = this.currentSelectedSecurityType;


        this.spinner.show();
        this.isSecuritiesFormInProgress = true;
        debugger
        this._loanService.saveLoanSecurities(this.loanSecurities, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.isSecuritiesFormInProgress = false;
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                debugger
                if (baseResponse.Success) {
                    debugger
                    this.isSecuritiesFormInProgress = false;
                    var loanGrid = new LoanSecurities();
                    loanGrid.AppSecurityID =
                        loanGrid.AppSecurityID = this.loanSecurities.AppSecurityID;
                    loanGrid.BasisofMutation = this.loanSecurities.BasisofMutation;
                    loanGrid.CollTypeID = this.loanSecurities.CollTypeID;
                    loanGrid.EnteredDate = this.loanSecurities.EnteredDate;
                    loanGrid.LoanAppID = this.loanSecurities.LoanAppID;
                    loanGrid.MaxCreditLimit = this.loanSecurities.MaxCreditLimit;
                    loanGrid.PludgedValue = this.loanSecurities.PludgedValue;
                    loanGrid.Quantity = this.loanSecurities.Quantity;
                    loanGrid.QuantityUnit = this.loanSecurities.QuantityUnit;
                    loanGrid.Remarks = this.loanSecurities.Remarks;
                    loanGrid.SecurityType = this.loanSecurities.SecurityType;
                    loanGrid.UnitPrice = this.loanSecurities.UnitPrice;
                    this.loanSecuritiesArray.push(loanGrid);
                    console.log(this.loanSecuritiesArray);
                    this._cdf.detectChanges();
                    this.LoanSecuritiesForm.controls['CollTypeID'].setValue('');
                    this.LoanSecuritiesForm.controls['Quantity'].setValue('');
                    this.LoanSecuritiesForm.controls['QuantityUnit'].setValue('');
                    this.LoanSecuritiesForm.controls['UnitPrice'].setValue('');
                    Object.keys(this.LoanSecuritiesForm.controls).forEach(key => {
                        this.LoanSecuritiesForm.get(key).markAsUntouched();
                    });
                    const dialogRef = this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                } else {
                    //this.isSaveApplicationHeaderInProgress = false;
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                }
            });

    }

    clearLoanSecuritiesForm() {
        this.LoanSecuritiesForm.controls['CollTypeID'].setValue('');
        this.LoanSecuritiesForm.controls['Quantity'].setValue('');
        this.LoanSecuritiesForm.controls['QuantityUnit'].setValue('');
        this.LoanSecuritiesForm.controls['UnitPrice'].setValue('');
        Object.keys(this.LoanSecuritiesForm.controls).forEach(key => {
            this.LoanSecuritiesForm.get(key).markAsUntouched();
        });
    }

    showUpdateSecuritiesForm(AppSecurityID) {

        for (var i = 0; i < this.editLoanSecuritiesArray.length; i++) {

            if (this.editLoanSecuritiesArray[i].AppSecurityID == AppSecurityID) {
                console.log('This is AppSecurityID array', this.editLoanSecuritiesArray[i]);
                debugger
                this.LoanSecuritiesForm.controls['Quantity'].setValue(this.editLoanSecuritiesArray[i].Quantity);
                this.LoanSecuritiesForm.controls['UnitPrice'].setValue(this.editLoanSecuritiesArray[i].UnitPrice);
                this.loanSecurities.MaxCreditLimit = this.editLoanSecuritiesArray[i].MaxCreditLimit;

                if (this.editLoanSecuritiesArray[i].CollTypeID != null, this.editLoanSecuritiesArray[i].CollTypeID != undefined) {
                    var devProdFlag = this.SelectedSecurityType.filter(x => x.Id == this.editLoanSecuritiesArray[i].CollTypeID); //[0].Id;
                    if (devProdFlag.length > 0) {
                        this.LoanSecuritiesForm.controls['CollTypeID'].setValue(devProdFlag[0].CollTypeID);
                    }
                }

                if (this.editLoanSecuritiesArray[i].CollTypeID != null, this.editLoanSecuritiesArray[i].CollTypeID != undefined) {
                    var devProdFlag = this.SelectedAreaQuantities.filter(x => x.Name == this.editLoanSecuritiesArray[i].BasisofMutation); //[0].Id;
                    if (devProdFlag.length > 0) {
                        this.LoanSecuritiesForm.controls['QuantityUnit'].setValue(devProdFlag[0].Id);
                    }
                }
            }
        }
    }
}

export class SecuritiesGrid {
    CollTypeID: number;
    QuantityUnit: number;
    Remarks: string;
    BasisofMutation: string;
    UnitPrice: number;
    AppSecurityID: number;
    LoanAppID: number;
    PludgedValue: number;
    MaxCreditLimit: number;
    Quantity: number;
    EnteredDate: string;
    SecurityType: string;
    EnteredBy: string;
    OrgUnitID: string;
}

import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSelectChange} from '@angular/material/select';