import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
  MatDialog,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import {
  Lov,
  LovConfigurationKey,
  DateFormats,
} from "../../../../core/auth/_models/lov.class";
import {
  AccountDetailModel,
  DisbursementGLModel,
  MasterCodes,
  RecoveryDataModel,
  RecoveryLoanTransaction,
  SubProposalGLModel,
  RecoveryCustomer,
} from "../../../../core/auth/_models/recovery.model";
import { LovService } from "../../../../core/auth/_services/lov.service";
import { RecoveryService } from "../../../../core/auth/_services/recovery.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { BaseResponseModel } from "../../../../core/_base/crud/models/_base.response.model";
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";
import { KtDialogService } from "../../../../core/_base/layout";
import { CircleService } from "../../../../core/auth/_services/circle.service";
import { Zone } from "../../../../core/auth/_models/zone.model";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { CustomerService } from "../../../../core/auth/_services/customer.service";
import { JournalVoucherService } from "../../../../core/auth/_services/journal-voucher.service";
import { JournalVocherData } from "../../../../core/auth/_models/journal-voucher.model";
import { ReschedulingService } from "../../../../core/auth/_services/rescheduling.service";
import { Branch } from "../../../../core/auth/_models/branch.model";
import { Circle } from "../../../../core/auth/_models/circle.model";
import { I } from "@angular/cdk/keycodes";

import { MakeReschedule } from "../../../../core/auth/_models/loan-application-header.model";
import { NewGlCodeComponent } from "./new-gl-code/new-gl-code.component";

@Component({
  selector: "kt-make-reschedule",
  templateUrl: "./make-reschedule.component.html",
  styles: [],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats },
  ],
})
export class MakeRescheduleComponent implements OnInit {
  mrForm: FormGroup;

  public rescheduling = new MakeReschedule();

  LoggedInUserInfo: BaseResponseModel;

  errorShow: boolean;
  hasFormErrors = false;
  Table : boolean = false;
  expand: boolean = false;

  public LovCall = new Lov();

  SubProposalGLList: any = [];

  DisbursementGLList: any = [];

  //Request Category inventory
  RequestTypes: any = [];
  RequestType: any = [];
  SelectedRequestType: any = [];

  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Zone inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Circle();
  public LnAppSanctionID: string;
  loanReschID: string;

  public ReschedulingTypes: any;



  constructor(
    private _reschedulingService: ReschedulingService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private userUtilsService: UserUtilsService,
    private _lovService: LovService,
    private fb: FormBuilder,
    private dailog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,

  ) {
    router.events.subscribe((val: any) => {
      if (val.url == "/reschedule-cases/make-reschedule") {
      }
    });
  }
  ngAfterViewInit() {
    // this.GetDisbursement();
    if (this.route.snapshot.params["loanReschID"] != null) {
      this.GetReshTransaction();
    }
  }


  createForm() {
    this.mrForm = this.fb.group({
      Zone: ["", Validators.required],
      Branch: ["", Validators.required],
      TranDate: ["11012021"],
      Lcno: ["", Validators.required],
      LoanAppSanctionID: ["", Validators.required],
      LoanDisbID: ["", Validators.required],
      GlSubIDNew: ["", Validators.required],
      SchemeCode: [""], //
      CropCode: [""], //
      AmountPayableForReschPer: ["", Validators.required],
      ProposalID: ["0"], //
      OutSDMarkupWithIstInstPer: ["100"], //
      RescheduleTypeID: ["", Validators.required],
      Remarks: ["", Validators.required],
    });
  }

  hasError(controlName: string, errorName: string): boolean {
     return this.mrForm.controls[controlName].hasError(errorName);
   }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  ngOnInit() {
    debugger;
    
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    //-------------------------------Loading Zone-------------------------------//
    this.GetZones();
    this.LoadLovs();
    //-------------------------------Loading Circle-------------------------------//

    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      debugger;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }

    //-------------------------------Loading Request-------------------------------//

    this.getRequestTypes();

    this.createForm();

  }

  //-------------------------------Request Type Core Functions-------------------------------//
  async getRequestTypes() {
    this.RequestTypes = await this._lovService.CallLovAPI(
      (this.LovCall = { TagName: LovConfigurationKey.RequestCategory })
    );
    this.SelectedRequestType = this.RequestTypes.LOVs;
  }

  async LoadLovs() {
    var tempArray = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.ReschedulingTypes })
    this.ReschedulingTypes = tempArray.LOVs;
  }


  GetReshTransaction() {
    this.spinner.show();
    this.loanReschID = this.route.snapshot.params["loanReschID"];
    this.rescheduling.LoanReschID = parseInt( this.loanReschID)
    debugger;
    this._reschedulingService
      .GetReshTransactionByID(this.loanReschID)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;

        if (baseResponse.Success === true) {
          this.mrForm.controls["RescheduleTypeID"].setValue(
            baseResponse.Loan.MakeReschedule.RescheduleTypeID
          );
          this.mrForm.controls["TranDate"].setValue(
            baseResponse.Loan.MakeReschedule.EnteredDate
          );
          this.mrForm.controls["CropCode"].setValue(
            baseResponse.Loan.MakeReschedule.CropCode
          );
          this.mrForm.controls["SchemeCode"].setValue(
            baseResponse.Loan.MakeReschedule.SchemeCode
          );
          this.mrForm.controls["GlSubIDNew"].setValue(
            baseResponse.Loan.MakeReschedule.GlSubIDNew
          );
          this.mrForm.controls["AmountPayableForReschPer"].setValue(
            baseResponse.Loan.MakeReschedule.IstInstallmentDefferDays
          );
          this.mrForm.controls["Lcno"].setValue(
            baseResponse.Loan.MakeReschedule.LoanCaseNO
          );
          this.subProposal();
          this.mrForm.controls["OutSDMarkupWithIstInstPer"].setValue(
            baseResponse.Loan.MakeReschedule.OutSDMarkupWithIstInstPer
          );
          this.mrForm.controls["Remarks"].setValue(
            baseResponse.Loan.MakeReschedule.Remarks
          );
          this.mrForm.controls["GlSubIDNew"].setValue(
            baseResponse.Loan.MakeReschedule.GlSubIDNew
          );
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }


  newGlDialog() {
    debugger
    //this.dailog.open(NewGlCodeComponent, { width: "800px", data: { NGlC: this.mrForm.controls.NGlC.value }, disableClose: true });

    // const dialogRef = this.dailog.open(NewGlCodeComponent, { width: "1600px", data: { NGlC: this.mrForm.controls.GlSubIDNew.value }, disableClose: true });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    //   this.mrForm.controls.GlSubIDNew.setValue(res);
    // });
    
    this.dailog.open(NewGlCodeComponent,{
      width: "1600px",
      data: { NGlC: this.mrForm.controls.GlSubIDNew.value },
      disableClose: true
    });
  }

  GetZones() {
    this._circleService
      .getZones()
      .pipe(finalize(() => {}))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          baseResponse.Zones.forEach(function (value) {
            value.ZoneName = value.ZoneName.split("-")[1];
          });
          this.Zones = baseResponse.Zones;
          this.SelectedZones = this.Zones;
          console.log("zone loaded", this.SelectedZones);
          if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.mrForm.controls["Zone"].setValue(
              this.LoggedInUserInfo.Zone.ZoneName
            );
            console.log(
              "this.LoggedInUserInfo.Zone.ZoneId",
              this.LoggedInUserInfo.Zone.ZoneId
            );
            this.GetBranches(this.LoggedInUserInfo.Zone.ZoneId);
          }
          this.cdRef.detectChanges();
        } else
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
      });
  }

  GetBranches(ZoneId) {
    this.Branches = [];
    this.mrForm.controls["Branch"].setValue(null);
    this.Zone.ZoneId = ZoneId.value;
    this._circleService
      .getBranchesByZone(this.Zone)
      .pipe(finalize(() => {}))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          this.Branches = baseResponse.Branches;
          this.SelectedBranches = this.Branches;
          console.log("Branches loaded", this.SelectedBranches);

          if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.mrForm.controls["Branch"].setValue(
              this.LoggedInUserInfo.Branch.Name
            );
            console.log(
              "this.LoggedInUserInfo.Branch.BranchId",
              this.LoggedInUserInfo.Branch.BranchId,
              "this.LoggedInUserInfo.Branch.BranchCode",
              this.LoggedInUserInfo.Branch.BranchCode
            );

            debugger;
          }
          //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
          this.cdRef.detectChanges();
        }
      });
  }

  SaveData() {
    debugger
      //this.mrForm.controls["TranDate"].setValue(this.datePipe.transform(new Date(), "ddMMyyyy"))
    this.rescheduling = Object.assign(this.mrForm.getRawValue());
    this.spinner.show();
    this._reschedulingService
      .SaveMakeRescheduleLoan(this.rescheduling)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.rescheduling.LoanReschID = baseResponse.Loan.MakeReschedule.LoanReschID
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
          setTimeout(() => {
            this.router.navigate(['/reschedule-cases/pending-reschedule']);
          },
            2000);
            this.mrForm.controls["Lcno"].setValue('');
            this.mrForm.controls["LoanAppSanctionID"].setValue('');
            this.mrForm.controls["LoanDisbID"].setValue('');
            this.mrForm.controls["GlSubIDNew"].setValue('');
            this.mrForm.controls["SchemeCode"].setValue('');
            this.mrForm.controls["CropCode"].setValue('');
            this.mrForm.controls["AmountPayableForReschPer"].setValue('');
            this.mrForm.controls["RescheduleTypeID"].setValue('');
            this.mrForm.controls["Remarks"].setValue('');
        
            this.mrForm.get('Lcno').markAsPristine();
            this.mrForm.get('Lcno').markAsUntouched();
            //this.mrForm.get('Lcno').updateValueAndValidity();
            
            // const obj =     this.mrForm.get('Lcno');
            // console.log('obj', obj);
        
        
            this.mrForm.get('LoanAppSanctionID').markAsUntouched();
             this.mrForm.get('LoanAppSanctionID').markAsPristine();
             this.mrForm.get('LoanDisbID').markAsUntouched();
             this.mrForm.get('LoanDisbID').markAsPristine();
             this.mrForm.get('GlSubIDNew').markAsUntouched();
             this.mrForm.get('GlSubIDNew').markAsPristine();
             this.mrForm.get('SchemeCode').markAsUntouched();
             this.mrForm.get('SchemeCode').markAsPristine();
             this.mrForm.get('CropCode').markAsUntouched();
             this.mrForm.get('CropCode').markAsPristine();
             this.mrForm.get('AmountPayableForReschPer').markAsUntouched();
             this.mrForm.get('AmountPayableForReschPer').markAsPristine();
             this.mrForm.get('RescheduleTypeID').markAsUntouched();
             this.mrForm.get('RescheduleTypeID').markAsPristine();
             this.mrForm.get('Remarks').markAsUntouched();
             this.mrForm.get('Remarks').markAsPristine();
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }

  subProposal() {
    var lCNo;
    this.spinner.show();
    lCNo = this.mrForm.controls["Lcno"].value;
    debugger;
    this._reschedulingService
      .GetSubProposalGL(lCNo)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;

        if (baseResponse.Success === true) {
          this.SubProposalGLList = baseResponse.Loan.SubProposalGLList;
          if (this.SubProposalGLList.length == 1) {
            this.mrForm.controls["LoanAppSanctionID"].setValue(
              this.SubProposalGLList[0].LoanAppSanctionID
            );
            this.Disbursement(this.mrForm.controls["LoanAppSanctionID"].value);
          }
          console.log(this.mrForm.value)
          this.expand = true;
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }

  Disbursement(id) {
    debugger;
    var dis = id;
    if (dis != undefined && dis != null) {
      debugger;
      this.spinner.show();

      debugger;
      this._reschedulingService
        .GetDisbursementByGl(dis)
        .pipe(
          finalize(() => {
            this.spinner.hide();

            this.cdRef.detectChanges();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {
          debugger;
          if (baseResponse.Success === true) {
            debugger;
            this.DisbursementGLList = baseResponse.Loan.DisbursementGLList;
            if (this.DisbursementGLList.length == 1) {
              this.mrForm.controls["LoanDisbID"].setValue(
                this.DisbursementGLList[0].LoanDisbID
              );
              console.log(this.DisbursementGLList)
            }
          } else {
            this.layoutUtilsService.alertElement(
              "",
              baseResponse.Message,
              baseResponse.Code
            );
          }
        });
    }
  }

  SubmitData(){
    this.spinner.show();
    
    debugger;
    this._reschedulingService
      .SubmitRescheduleData(this.rescheduling)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }

  clear(){
    //this.mrForm.reset();
    // debugger
  

     this.mrForm.controls["Lcno"].reset();
    this.mrForm.controls["LoanAppSanctionID"].reset();
    this.mrForm.controls["LoanDisbID"].reset();
    this.mrForm.controls["GlSubIDNew"].reset();
    this.mrForm.controls["SchemeCode"].reset();
    this.mrForm.controls["CropCode"].reset();
    this.mrForm.controls["AmountPayableForReschPer"].reset();
    this.mrForm.controls["RescheduleTypeID"].reset();
    this.mrForm.controls["Remarks"].reset();

    this.mrForm.get('Lcno').markAsPristine();
    this.mrForm.get('Lcno').markAsUntouched();
    //this.mrForm.get('Lcno').updateValueAndValidity();
    
    // const obj =     this.mrForm.get('Lcno');
    // console.log('obj', obj);


    this.mrForm.get('LoanAppSanctionID').markAsUntouched();
     this.mrForm.get('LoanAppSanctionID').markAsPristine();
     this.mrForm.get('LoanDisbID').markAsUntouched();
     this.mrForm.get('LoanDisbID').markAsPristine();
     this.mrForm.get('GlSubIDNew').markAsUntouched();
     this.mrForm.get('GlSubIDNew').markAsPristine();
     this.mrForm.get('SchemeCode').markAsUntouched();
     this.mrForm.get('SchemeCode').markAsPristine();
     this.mrForm.get('CropCode').markAsUntouched();
     this.mrForm.get('CropCode').markAsPristine();
     this.mrForm.get('AmountPayableForReschPer').markAsUntouched();
     this.mrForm.get('AmountPayableForReschPer').markAsPristine();
     this.mrForm.get('RescheduleTypeID').markAsUntouched();
     this.mrForm.get('RescheduleTypeID').markAsPristine();
     this.mrForm.get('Remarks').markAsUntouched();
     this.mrForm.get('Remarks').markAsPristine();
       

  }


  cancelTransaction(){
    this.spinner.show();
    debugger;
    this._reschedulingService
      .CancelRescheduleData(this.rescheduling)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
          setTimeout(() => {
            this.router.navigate(['/reschedule-cases/pending-reschedule']);
          },
            2000);
          this.mrForm.reset();          
        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }
  viewLCInquiry(){
    var Lcno = this.mrForm.controls.Lcno.value;
    var LnTransactionID = this.mrForm.controls.LoanDisbID.value;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.route })
    );
    window.open(url, '_blank');   
  }
}
