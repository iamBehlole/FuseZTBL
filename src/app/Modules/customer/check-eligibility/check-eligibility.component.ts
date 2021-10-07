import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

// RxJS
import { Observable, of, Subscription, from } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
// State
// Services and Models

import { delay, finalize } from 'rxjs/operators';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
    DateFormats,
    errorMessages,
    Lov,
    LovConfigurationKey,
    MaskEnum,
    regExps
} from '../../../core/auth/_models/lov.class';
import {DateAdapter} from 'angular-calendar';
import {Activity} from '../../../core/auth/_models/activity.model';
import {CreateCustomer} from '../../../core/auth/_models/customer.model';
import {BaseRequestModel} from '../../../core/_base/crud/models/_base.request.model';
import {DocumentTypeService} from '../../../core/auth/_services/document-type.service';
import {AppState} from '../../../core/reducers';
import {CustomerService} from '../../../core/auth/_services/customer.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {KtDialogService} from '../../../core/_base/layout';
import {LovService} from '../../../core/auth/_services/lov.service';
import {CommonService} from '../../../core/auth/_services/common.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';


@Component({
  selector: 'kt-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class CheckEligibilityComponent implements OnInit {

  saving = false;
  submitted = false;
  customerInfo: FormGroup;
  _activity: Activity = new Activity();
  hasFormErrors = false;
  loading = false;
  viewLoading = false;
  dataID = "Test"
  CustomerNdc: any;
  CustomerECIB: any;
  Customer: any;
  gridHeight: string;
  Ftb: number;
  NDCPerform: boolean;
  IsNdcDefaulter: boolean;
  IsEcibDefaulter: boolean;
  BiMatricCasePerfom: boolean;
  NdcSubmit: boolean;
  BioMetricCapture: boolean;
  BiometricCredentials: boolean;
  ECIBPerformSuccess: boolean;
  NDCActionPerformSuccess: boolean;
  ECIBPerform: boolean;
  ECIBPerformForm: boolean;
  loadingAfterSubmit = false;

  public LovCall = new Lov();
  public GenderLov: any;

  submitCwrLoading = false;
  refreshEcibLoading = false;

  BMVS_NIVS: string;
  NDC_Val: string;
  ECIB_Val: string;
  NDCLinkView: boolean;
  EcibLinkView: boolean;
  checkEligibiltyCnic: boolean;

  _customer: CreateCustomer = new CreateCustomer();
  public request = new BaseRequestModel();



  public maskEnums = MaskEnum;
  errors = errorMessages;

  todayMax = new Date();
  todayMin = new Date();


  constructor(
    private store: Store<AppState>,
    private _documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    private _customerService: CustomerService,
    private userUtilsService: UserUtilsService,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _cdf: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private _lovService: LovService,
    //private state: RouterStateSnapshot,
    private router: Router,
    private datePipe: DatePipe,
    private _common: CommonService,
    private _snackBar: MatSnackBar) {

    debugger;

    var bit = localStorage.getItem("CreateCustomerBit");
    if (bit == '1')
      localStorage.setItem('CreateCustomerBit', '10');

  }

  ngOnInit() {
    this.NDCPerform = false;
    this.IsNdcDefaulter = false;
    this.NDCActionPerformSuccess = true;
    this.NdcSubmit = false;
    this.BioMetricCapture = false;
    this.BiometricCredentials = false;
    this.BiMatricCasePerfom = false;
    this.ECIBPerform = false;
    this.ECIBPerformForm = false;
    this.ECIBPerformSuccess = false;
    this.IsEcibDefaulter = false;
    this.NDCLinkView = true;
    this.EcibLinkView = true;
    this.checkEligibiltyCnic = false;
    this.LoadLovs();
    this.createForm();
    debugger;

    this.todayMax.setFullYear(this.todayMax.getFullYear() - 18);

  }

  async LoadLovs() {

    this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Gender })


    debugger;
    this.GenderLov.LOVs = this._lovService.SortLovs(this.GenderLov.LOVs);
  }


  //Get Customer Info
  getCustomerInfo() {
    debugger;
    this.checkEligibiltyCnic = true;
    const controlsCust = this.customerInfo.controls;

    this._customer = Object.assign(this._customer, this.customerInfo.value);


    if (this.customerInfo.controls["Cnic"].invalid) {
      controlsCust["Cnic"].markAsTouched()

      this.hasFormErrors = true;
      this.checkEligibiltyCnic = false;
      return;
    }
    else {
      this.hasFormErrors = false;
    }

    //if ((this._customer.Cnic == null || this._customer.Cnic == "")) {

    //  controlsCust["Cnic"].markAsTouched()

    //  return;
    //}
    //else if (this._customer.Cnic.length != 13) {
    //  controlsCust["Cnic"].markAsTouched()

    //  return;
    //}

    this.loading = true;
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;



    this.request.Customer = this._customer;

    this._activity.ActivityID = 1;
    this.request.Activity = this._activity;

    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;

    this._customerService.getCustomerInfo(this.request)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.loading = false;
          this.NDCPerform = true;
          this.NdcSubmit = true;
          this.Customer = baseResponse.Customer;

          this.BMVS_NIVS = this.Customer.isBMVSAvailable;
          if (this.Customer.isBMVSAvailable)
            this.BMVS_NIVS = "Success";
          else
            this.BMVS_NIVS = "Not Found";


          this.CustomerNdc = baseResponse.customerNDC;
          if (this.CustomerNdc.Code == "449") {
            this.IsNdcDefaulter = true;
            this.NDC_Val = this.CustomerNdc.Message;
          }
          else {
            this.IsNdcDefaulter = false;
          }
          this.Ftb = baseResponse.Ftb;
          this._cdf.detectChanges();

          if (this.Customer.NDCPDFLink == null || this.Customer.NDCPDFLink == "") {
            this.NDCLinkView = false;
            this.layoutUtilsService.alertMessage("", "No NDCP Record Available");
          }
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

  }

  //Submit NDC
  SubmitNdc() {

    debugger;
    if (this.CustomerNdc.Code == '449') {

      this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
    }

    else {

      const _title = 'Confirmation';
      const _description = 'Do you really want to continue?';
      const _waitDesciption = '';
      const _deleteMessage = `Role has been deleted`;

      const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.loading = true;
        debugger;
        this._customer = this.Customer;
        this._customerService.submitNdc(this._customer)
          .pipe(
            finalize(() => {
              this.submitted = false;
              this.loading = false;
              this.ktDialogService.hide();
            })
          )
          .subscribe((baseResponse: BaseResponseModel) => {
            debugger;
            if (baseResponse.Success === true) {
              this.NDCActionPerformSuccess = false;
              this.NdcSubmit = false;
              this.BiMatricCasePerfom = true;

              ////Os Change Set
              this.PerformUseCases(baseResponse);
              ////

              this._cdf.detectChanges();
              //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            }
            else {
              this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }

          });

      });
    }




  }


  ///By Pass screens in terms of data
  //OS Change Set
  PerformUseCases(Data) {
    debugger;
    if (Data.Customer != '' && Data.Customer != null && Data.Customer != undefined) {

      var check = Data.Customer.isBMVSAvailable;

      if (check) {
        this.BiMatricCasePerfom = false;
        this._customer = new CreateCustomer();
        this._customer = Object.assign(this._customer, Data.Customer);
        this.BiometricCredentials = true;

      }

      else {
        this.BiMatricCasePerfom = true;
        this.BiometricCredentials = false;
        this._customer = new CreateCustomer();
        this._customer = Object.assign(this._customer, Data.Customer);
      }
      this.createForm();
      this._cdf.detectChanges();
    }

  }

  //Perform biomatric
  performBiomatric() {

    this.BiMatricCasePerfom = false;
    //this.BiometricCredentials = true;
    this.BioMetricCapture = true;


  }

  //Submit biomatric
  saveBiomatricdata() {
    debugger;

    const controls = this.customerInfo.controls;

    this._customer = Object.assign(this._customer, this.customerInfo.value);

    if ((this._customer.Cnic == null || this._customer.Cnic == "") || (this._customer.CnicExpiry == null || this._customer.CnicExpiry == "") || (this._customer.Dob == null || this._customer.Dob == "") || (this._customer.CustomerName == null || this._customer.CustomerName == "") || (this._customer.FatherName == null || this._customer.FatherName == "") || (this._customer.CurrentAddress == null || this._customer.CurrentAddress == "")) {

      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;

    }
    this._customer.Dob = this.datePipe.transform(this._customer.Dob, "ddMMyyyy");
    this._customer.CnicExpiry = this.datePipe.transform(this._customer.CnicExpiry, "ddMMyyyy");
    this.BioMetricCapture = false;
    this.BiometricCredentials = true;
  }

  //Submit CWR
  submitCWR() {
    this.submitCwrLoading = true;
    debugger;
    this.hasFormErrors = false;
    const controls = this.customerInfo.controls;

    if (this.customerInfo.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;

      return;
    }

    this.loading = true;
    debugger;

    // this._customer = Object.assign(this._customer, this.customerInfo.getRawValue());

    this.Customer.CurrentAddress = this.customerInfo.controls['CurrentAddress'].value
    this._customer.CurrentAddress = this.customerInfo.controls['CurrentAddress'].value;
    this.Customer.Gender = this.customerInfo.controls['Gender'].value
    this._customer.Gender = this.customerInfo.controls['Gender'].value;

    this.Customer = this._customer;

    ///

    ///


    this._customerService.addCustomerInfo(this._customer)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.loading = false;
          this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          debugger;
          this.BiometricCredentials = false;
          this.ECIBPerform = true;
          this.ECIBPerformForm = true;
          if (this.Customer.isBMVSAvailable)
            this.BMVS_NIVS = "Success";
          else
            this.BMVS_NIVS = "Not Found";
          this.Customer = baseResponse.Customer;
          this.CustomerECIB = baseResponse.Ecib;
          // console.log(this.Customer);
          // console.log(this.CustomerECIB)

          if (this.CustomerECIB.Code == "549") {
            this.IsEcibDefaulter = true;
          }
          else {
            this.IsEcibDefaulter = false;
          }
          debugger
          if (this.Customer.ECIBPDFLink == null || this.Customer.ECIBPDFLink == "") {
            this.EcibLinkView = false;
            //this.layoutUtilsService.alertMessage("", "No ECIB Record Available");
          }
          else {
            this.EcibLinkView = true;
          }

          if(this.CustomerECIB.Message == "Eligible"){
            //debugger
            this.ECIBPerform = false;
            this.ECIBPerformSuccess = true;
            localStorage.setItem('SearchCustomerStatus', JSON.stringify(this.Customer));
          }


        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      });

  }


  //Refresh Ecib
  refreshEcib() {

    this.refreshEcibLoading = true;
    if (this.CustomerECIB.Code == '549') {
      this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
    }
    else {

      this.loading = true;
      debugger;

      this._customer = this.Customer;
      console.log(this._customer)
      this._customerService.refreshEcib(this._customer)
        .pipe(
          finalize(() => {
            this.refreshEcibLoading = true;
            this.submitted = false;
            this.loading = false;
            this.ktDialogService.hide();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {
          debugger;
          this.refreshEcibLoading = true;
          if (baseResponse.Success === true) {
            debugger;
            this.BiometricCredentials = false;
            this.Customer = baseResponse.Customer;
            this.CustomerECIB = baseResponse.Ecib;



            localStorage.setItem('SearchCustomerStatus', JSON.stringify(this.Customer));


            var bit = localStorage.getItem("CreateCustomerBit");

            if (bit == '10') {

              localStorage.setItem('CreateCustomerBit', '5');

              this.ECIBPerform = false;
              this.ECIBPerformSuccess = true;


              //this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });
            }
            else {
              this.ECIBPerform = false;
              this.ECIBPerformSuccess = true;
            }

            if (this.Customer.ECIBPDFLink == null || this.Customer.ECIBPDFLink == "") {
              this.EcibLinkView = false;
              //this.layoutUtilsService.alertMessage("", "No ECIB Record Available");
            }
            else {
              this.EcibLinkView = true;
            }

          }
          else {
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          }

        });
    }
    //this.refreshEcibLoading = false;
  }


  NextOpenCreateCustomer() {
    debugger

    console.log(this.Customer)
    var bit = localStorage.getItem("CreateCustomerBit");
    if (bit == '10') {
      localStorage.setItem('CreateCustomerBit', '5');
      bit = localStorage.getItem("CreateCustomerBit");
    }
    //console.log(bit)
    if (bit == "") {
      this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
    }
    else {
      this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });
    }

  }


  createForm() {
    this.customerInfo = this.formBuilder.group({
      Cnic: [this._customer.Cnic, [Validators.required, , Validators.pattern(regExps.cnic)]],
      Dob: [this._common.stringToDate(this._customer.Dob), [Validators.required]],
      CnicExpiry: [this._common.stringToDate(this._customer.CnicExpiry), [Validators.required]],
      CustomerName: [this._customer.CustomerName, [Validators.required]],
      FatherName: [this._customer.FatherName, [Validators.required]],
      CurrentAddress: [this._customer.CurrentAddress, [Validators.required]],
      Gender: [this._customer.Gender, [Validators.required]]
    });

  }


  hasError(controlName: string, errorName: string): boolean {
    return this.customerInfo.controls[controlName].hasError(errorName);
  }


  get f(): any {
    return this.customerInfo.controls;
  }


  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 220 + 'px';
  }



  getTitle() {
    let result = 'Check Eligibility';

    if (this.BioMetricCapture == true) {
      result = 'Biometric Credentials';
    }
    if (this.BiometricCredentials == true) {
      result = 'CWR';
    }

    return result;
  }





  onAlertClose($event) {
    this.hasFormErrors = false;
  }

}

