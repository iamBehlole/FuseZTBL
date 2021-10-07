import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, Input, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Lov, LovConfigurationKey, DateFormats } from '../../../core/auth/_models/lov.class';
import { AccountDetailModel, DisbursementGLModel, MasterCodes, RecoveryDataModel, RecoveryLoanTransaction, SubProposalGLModel, RecoveryCustomer } from '../../../core/auth/_models/recovery.model';
import { CommonService } from '../../../core/auth/_services/common.service';
import { LovService } from '../../../core/auth/_services/lov.service';
import { RecoveryService } from '../../../core/auth/_services/recovery.service';
import { LayoutUtilsService } from '../../../core/_base/crud';
import { BaseResponseModel } from '../../../core/_base/crud/models/_base.response.model';
import { UserUtilsService } from '../../../core/_base/crud/utils/user-utils.service';
import { KtDialogService } from '../../../core/_base/layout';
import { CircleService } from '../../../core/auth/_services/circle.service';
import { Zone } from '../../../core/auth/_models/zone.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomerService } from '../../../core/auth/_services/customer.service';
import { JvMasterCodeDialogComponent } from './jv-master-code-dialog/jv-master-code-dialog.component';
import { JournalVoucherService } from '../../../core/auth/_services/journal-voucher.service';
import { JournalVocherData } from '../../../core/auth/_models/journal-voucher.model';
import { JvOrganizationalStructureComponent } from './jv-organizational-structure/jv-organizational-structure.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'kt-jv-form',
  templateUrl: './jv-form.component.html',
  styles: [],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class JvFormComponent implements OnInit, OnDestroy {

  @Input() RecoveryType: number;
  @Input() lcno: string;
  @Input() transactionID: string;
  @Input() viewOnly: boolean;

  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  ownerChecked = true;
  ShowTable: boolean = false;
  ShowError: boolean;
  AllowchargeCreation: boolean;
  SaveCustomer = false;
  remove: boolean;
  errorShow: boolean;
  accountDetailFetched = false;
  submitted = false;
  JvForm: FormGroup;
  sanctionedAmount: number = 0;
  tranId: string;
  remarksError = false;
  transactionEdit = false;
  gubSub = true;
  jvGl: any;
  jvMaster: any;
  seqIndex = '';
  maker : any;
  userInfo: any;
  disbDescription: any;

  deleteBtn: boolean = true;
  

  myPrevID : any = {};

  public recoveryData = new RecoveryDataModel();
  public accountDetail = new AccountDetailModel();
  public masterCodes: MasterCodes[] = [];
  public SubProposalGLList: SubProposalGLModel[] = [];
  public DisbursementGLList: DisbursementGLModel[] = [];
  public RecoveryLoanTransaction: RecoveryLoanTransaction[] = [];
  public customers: RecoveryCustomer[] = [];
  Glheads: any;
  JvRos: any;

  table = false;
  tf = true;

  InstrumentTypes: any;
  branchId: number;
  branchCode: number;
  minDate = new Date();
  maxDate = new Date();
  amountError = false;
  isEditMode : any;
  isViewMode : any;
  showInstrument = true;
  recoverySaved = false;
  receipt: any;
  UserCircleMappings: any;
  isSAMStatus = true;
  currentUrl : any;
  JvSearchData: any;
  isFormReadonly: boolean;
  loading: any;
  navigationSubscription;
  accNo: any;
  advNo: any;
  roCode: any;
  contBr: any;
  contDept: any;
  jvObject: any;


  public LovCall = new Lov();
 // public recoveryDataModel = new RecoveryDataModel();
  public journalVocherData = new JournalVocherData();

  public PostCodeLov: any;
  public LandingProcedureLov: any;
  public CustomerLov: any;
  public BranchLov: any;
  public ZoneLov: any;
  public selectedCustomerID: any;
  public errorMessage: any;
  public heads: any;
  myJvMaster: any;
    jvm : any = [];

  newDynamic: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private _recoveryService: RecoveryService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _journalVoucherService: JournalVoucherService

  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        //this.initialiseInvites();
      }
    });

    var CheckEdit = localStorage.getItem("EditJvData");
    if (CheckEdit == '0') {
      localStorage.setItem("SearchJvData", "");
    }

    // var CheckView = localStorage.getItem("ViewJvData");
    // if (CheckView == '0') {
    //   localStorage.setItem("SearchJvData", "");
    // }
  }

  ngOnInit() {
    debugger
      this.isEditMode = localStorage.getItem("EditJvData");
      if (this.isEditMode != "0") {
        this.JvSearchData = JSON.parse(localStorage.getItem("SearchJvData"));
        
        if(this.JvSearchData != null){
          this.jvObject = this.JvSearchData.obj;
        }

        
        //console.log(this.JvSearchData.obj)
        if(this.jvObject != undefined){
          this.viewOnly = true
        }else{
          this.viewOnly = false;
        }
      }
    
    if (this.viewOnly == undefined)
      this.transactionEdit = false;
    else if (this.viewOnly) {
      this.transactionEdit = true;
      this.viewOnly = this.viewOnly.toString() == "true" ? true : false;
    }

    this.AllowchargeCreation = false;
    this.ShowError = false;
    this.remove = false;

    this.createForm();

    this.userInfo = this.userUtilsService.getUserDetails();
    
    console.log(this.userInfo.Zone)
    this.branchId = parseInt(this.userInfo.Branch.BranchId);
    this.branchCode = parseInt(this.userInfo.Branch.BranchCode);
    this.JvForm.controls.ZoneId.setValue(this.userInfo.Zone.ZoneName);
    this.JvForm.controls.OrgUnitID.setValue(this.userInfo.Branch.Name);
    //this.JvForm.controls.BranchId.setValue(userInfo.Branch.Name);
    this.JvForm.controls.BranchWorkingDate.setValue(this.userInfo.Branch.WorkingDate);
  
    //console.log(userInfo.User.UserId);
    debugger
    let dateString = this.JvForm.controls.BranchWorkingDate.value;
    var day = parseInt(dateString.substring(0, 2));
    var month = parseInt(dateString.substring(2, 4));
    var year = parseInt(dateString.substring(4, 8));

    const branchWorkingDate = new Date(year, month - 1, day);
    this.JvForm.controls.EffectiveDate.setValue(branchWorkingDate);

    this.maxDate = new Date(year, month - 1, day);
    //this.minDate = new Date(year, month - 1, day - 1);


    this.loadLOV();
    //if (this.lcno != undefined && this.lcno != null && this.lcno != "")
    //  this.getTransactiondetailByID();

    // if(this.currentUrl === 'journal-voucher/form/:upFlag'){
    //   this.tf = false;
    //   this.table = true;
    // }
    

    var upFlag = this.route.snapshot.params['upFlag'];
    if(upFlag == "1" && this.isEditMode == "1"){
      debugger
      localStorage.setItem('EditJvData', '0');
      this.getJvInfo();
    }

    if(this.viewOnly == true){
      this.JvForm.get('TransactionMasterID').clearValidators();
      this.JvForm.get('TransactionMasterID').updateValueAndValidity();
      this.JvForm.get('GlSubID').clearValidators();
      this.JvForm.get('GlSubID').updateValueAndValidity();
      this.JvForm.get('Amount').clearValidators();
      this.JvForm.get('Amount').updateValueAndValidity();
    }

    // else if(upFlag == "2" && this.isViewMode == "2"){
    //   debugger
    //   localStorage.setItem('ViewJvData', '0');
    //   this.getJvInfo();
    // }

    console.log(this.maker)
    //if(this.maker)

  }


  async loadLOV() {
    this.heads = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Glhead });
    this.heads = this.heads.LOVs;

    this.JvRos = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.JvRo });
    this.JvRos = this.JvRos.LOVs;

    this.InstrumentTypes = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.JvInstrument });
    this.InstrumentTypes = this.InstrumentTypes.LOVs;


    this.cdRef.detectChanges();
    console.log('Glheads');
    console.log(this.heads);

    console.log('JvRos');
    console.log(this.JvRos);
  }

  createForm() {

    if (this.JvSearchData !== undefined && this.JvSearchData !== null && this.JvSearchData !== '' ) {
      this.journalVocherData.TransactionID = this.JvSearchData.TransactionID;
      this.journalVocherData.UserBranchID = this.JvSearchData.UserBranchID;

      if ((this.JvSearchData.TransactionStatus == 'P' || this.JvSearchData.TransactionStatus == 'R') && this.isEditMode == "1"  ) {

        this.isFormReadonly = true;


        localStorage.setItem("SearchJvData", '');
      }

      if (this.JvSearchData.TransactionStatus == 'A' || this.JvSearchData.TransactionStatus == 'S' || this.JvSearchData.TransactionStatus == 'C') {

        this.viewOnly = true;
            
        localStorage.setItem("SearchJvData", '');
      }
  

    }

    this.JvForm = this.formBuilder.group({
     
      ZoneId: ['', [Validators.required]],
      OrgUnitID: ['', [Validators.required]],
      BranchWorkingDate: ['', [Validators.required]],
      VoucherNo: ['0000', [Validators.required]],
      TransactionMasterID: ['', [Validators.required]],
      EffectiveDate: ['', [Validators.required]],     
      GlHead: ['', [Validators.required]],
      GlSubID:['', [Validators.required]],
      GlSub: [''],      
      Amount: ['', [Validators.required]],
      TrCode: ['00', [Validators.required]],
      RoCode: [' '],
      AdviceNo: [''],
      ContraBranchCode: [''],
      OrgDeptID: [''],
      LoanCaseID: [''],
      LoanDisbID: [''],
      DepositAccID: [''],
      ContraVoucherNo: [''],
      RecordNo: [''],
      CaCode: [''],
      InstrumentType: [''],
      InstrumentNO1: [''],
      InstrumentNO2: [''],
      EmpPPNo: [''],
      TransactionMasterCode: [''],
      Samlc: [''],
      Glsam: [''],
      Note: [''],
      Remarks: [''],
    });

    if (this.JvSearchData !== undefined && this.JvSearchData !== null && this.JvSearchData !== '' ) {
      debugger
      this.journalVocherData.TransactionID = this.JvSearchData.TransactionID;
      this.journalVocherData.UserBranchID = this.JvSearchData.UserBranchID;

    }

  }

  getJvInfo(){
    this.spinner.show();
    this._journalVoucherService.getTransactionByID(this.journalVocherData.TransactionID) .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      ).subscribe(baseResponse => {
        if (baseResponse.Success){
          console.log(baseResponse)
          this.tf = false;
          this.table = true;
          debugger
          this.jvGl = baseResponse.JournalVoucher.JVGLDetailList;
          this.jvMaster = baseResponse.JournalVoucher.JVMasterDetailList;

          this.jvMaster.forEach(element => {
            console.log(element)
            this.JvForm.controls['VoucherNo'].setValue(element.ManualVoucherNo);
            this.JvForm.controls['TransactionMasterID'].setValue(element.TransactionMasterCode);
            this.maker = element.MakerID;            
          });

        }
        });    
  }

  openJVMasterCodeDialog() {

    const dialogRef = this.dialog.open(JvMasterCodeDialogComponent, { width: "1400px", data: { TransactionMasterID: this.JvForm.controls.TransactionMasterID.value }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.JvForm.controls.TransactionMasterID.setValue(res);
    });

  }

  onSearchChange(totalAmount: string): void {

    if (this.accountDetail.TotalOutstand != undefined && this.accountDetail.TotalOutstand != null) {
      if (parseInt(totalAmount) > parseInt(this.accountDetail.TotalOutstand.toString())) {
        this.amountError = true;
      }
      else
        this.amountError = false;
    }
    this.cdRef.detectChanges();


  }

  isEnableReceipt(isTrCodeChange: boolean) {
    debugger
    var effectiveDate = this.JvForm.controls.EffectiveDate.value;
    if (effectiveDate._isAMomentObject == undefined) {
      try {
        var day = this.JvForm.controls.EffectiveDate.value.getDate();
        var month = this.JvForm.controls.EffectiveDate.value.getMonth() + 1;
        var year = this.JvForm.controls.EffectiveDate.value.getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        const branchWorkingDate = new Date(year, month - 1, day);
        this.JvForm.controls.EffectiveDate.setValue(branchWorkingDate);
      } catch (e) {

      }
    }
    else {
      try {
        var day = this.JvForm.controls.EffectiveDate.value.toDate().getDate();
        var month = this.JvForm.controls.EffectiveDate.value.toDate().getMonth() + 1;
        var year = this.JvForm.controls.EffectiveDate.value.toDate().getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        effectiveDate = day + "" + month + "" + year;
    
     
        const branchWorkingDate = new Date(year, month - 1, day);
        this.JvForm.controls.EffectiveDate.setValue(branchWorkingDate);
      } catch (e) {

      }
    }

    // try {
    
    //   //this.JvForm.controls["EffectiveDate"].setValue(this.datePipe.transform(new Date(), "ddMMyyyy"))
    //   var day = this.JvForm.controls.EffectiveDate.value.getDate();
    //   var month = this.JvForm.controls.EffectiveDate.value.getMonth() + 1;
    //   var year = this.JvForm.controls.EffectiveDate.value.getFullYear();
    //   if (month < 10) {
    //     month = "0" + month;
    //   }
    //   effectiveDate = day + "" + month + "" + year;
    // } catch (e) {

    // }

    // if (this.JvForm.controls.BranchWorkingDate.value != effectiveDate) {
    //   value = true;

    //   if (!isTrCodeChange)
    //     this.JvForm.controls.TrCode.setValue("15");
    // }
    // if (this.JvForm.controls.TrCode.value === "15") {
    //   value = true;
    // }


  }

  getDisbursementByGL() {
    var SanctionID = this.JvForm.controls.SubProposalID.value;
    this.JvForm.controls.LoanSanctionID.setValue(SanctionID);


    this.spinner.show();

    this._recoveryService
      .getDisbursementByGL(SanctionID)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
          //this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.DisbursementGLList = baseResponse.Recovery.DisbursementGLList;
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });
  }



  changeMasterCode() {

    var masterCode = this.masterCodes.filter(x => x.LnTransactionMasterID == this.JvForm.controls.MasterTrCode.value)[0];
    if (masterCode != undefined) {
      if (masterCode.ChequeReq == "Y") {
        this.showInstrument = true;

        this.JvForm.controls.InstrumentType.setValidators([Validators.required]);
        this.JvForm.controls.InstrumentType.updateValueAndValidity();

        this.JvForm.controls.InstrumentNO.setValidators([Validators.required]);
        this.JvForm.controls.InstrumentNO.updateValueAndValidity();

      }
      else {
        this.JvForm.controls.InstrumentType.setValidators([]);
        this.JvForm.controls.InstrumentType.updateValueAndValidity();

        this.JvForm.controls.InstrumentNO.setValidators([]);
        this.JvForm.controls.InstrumentNO.updateValueAndValidity();
        this.showInstrument = false;
      }
    }
  }

  searchLC() {
    debugger
    if(this.DisbursementGLList.length != 0){
      this.DisbursementGLList = []
    }

    var Lcno = this.JvForm.controls.LoanCaseID.value;
    this.spinner.show();
    this._journalVoucherService
      .getGLForLC(Lcno)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
    ).subscribe((baseResponse: BaseResponseModel) => {
      console.log(baseResponse);
      if (baseResponse.Success === true) {
        console.log(baseResponse)
        var listGL = baseResponse.JournalVoucher.GLforJVList;
        this.DisbursementGLList.splice(0, 0);
        listGL.forEach((part, index)=> {
          var tempDisbursementGLList = new DisbursementGLModel();
          tempDisbursementGLList.LoanDisbID = part.LoanDisbID;
          tempDisbursementGLList.Description = part.DisbDesc;
          this.DisbursementGLList.push(tempDisbursementGLList);
        }, listGL);
      }
    },
      (error) => {
        this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");
        console.log(error)
      });
  }

  viewLLCInquiryGL() {
    var Lcno = this.JvForm.controls.LoanCaseID.value;
    var LnTransactionID = this.JvForm.controls.LoanDisbID.value;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute })
    );
    window.open(url, '_blank');

    //this.router.navigate(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute });
  }
  viewLLCInquiry() {
    var Lcno = this.JvForm.controls.LoanCaseNo.value;
    var LnTransactionID = this.JvForm.controls.TransactionID.value;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute })
    );
    window.open(url, '_blank');

    //this.router.navigate(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute });
  }

  hasError(controlName: string, errorName: string): boolean {
    //debugger;
    return this.JvForm.controls[controlName].hasError(errorName);
  }

  save() {

    debugger

    this.errorShow = false;
    this.hasFormErrors = false;
    if (this.JvForm.invalid) {
      const controls = this.JvForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    this.journalVocherData = Object.assign(this.journalVocherData, this.JvForm.getRawValue());

    if(this.JvForm.controls.VoucherNo.value == "0000"){
      this.journalVocherData.TransactionFlag = "";
      this.journalVocherData.TransactionID = "";
      this.journalVocherData.TransactionDetailID = "";
     }
    
   var myjournalVocherData : any = {};
   myjournalVocherData.AccountID = this.JvForm.controls.DepositAccID.value;;
   myjournalVocherData.AdviceNo = this.JvForm.controls.AdviceNo.value;;
   myjournalVocherData.Amount = this.JvForm.controls.Amount.value;
   myjournalVocherData.CaCode =this.journalVocherData.CaCode;
   myjournalVocherData.ContraBranchId = this.JvForm.controls.ContraBranchCode.value;;
   myjournalVocherData.ContraVoucherNo =this.journalVocherData.ContraVoucherNo;
   myjournalVocherData.DdPoType = this.JvForm.controls.GlHead.value;
   myjournalVocherData.DdPono = '';
   myjournalVocherData.DepositAccID =this.journalVocherData.DepositAccID;
   myjournalVocherData.EmpPPNo =this.journalVocherData.EmpPPNo;
   myjournalVocherData.GlSubID = this.JvForm.controls.GlSubID.value;
   myjournalVocherData.Glsam = this.journalVocherData.Glsam;
   myjournalVocherData.InstrumentType = this.JvForm.controls.InstrumentType.value;
   myjournalVocherData.InstrumentNo1 = this.JvForm.controls.InstrumentNO1.value;
   myjournalVocherData.InstrumentNo2 = this.JvForm.controls.InstrumentNO2.value;
   myjournalVocherData.IsAutoVoucher = '';
   myjournalVocherData.LoanCaseID =this.JvForm.controls.LoanCaseID.value;
   myjournalVocherData.LoanDisbID = this.journalVocherData.LoanDisbID;
   myjournalVocherData.ManualVoucherNo = this.JvForm.controls.VoucherNo.value;
   myjournalVocherData.Nature = this.JvForm.controls.GlHead.value;
   myjournalVocherData.Note =this.journalVocherData.Note;
   myjournalVocherData.OrgDeptID = this.JvForm.controls.OrgDeptID.value;;
   myjournalVocherData.Prefix = '';
   myjournalVocherData.RecordNo =this.journalVocherData.RecordNo;
   myjournalVocherData.RoCode = this.JvForm.controls.RoCode.value;;
   myjournalVocherData.Samlc =this.journalVocherData.Samlc; 
   myjournalVocherData.TrCode =this.JvForm.controls.TrCode.value; 
   myjournalVocherData.TrMasterIDJv = this.journalVocherData.TransactionMasterID;
   myjournalVocherData.TransactionCode = '';
   myjournalVocherData.TransactionFlag = this.journalVocherData.TransactionFlag;
   myjournalVocherData.TransactionID = this.journalVocherData.TransactionID;
   myjournalVocherData.TransactionDetailID = this.journalVocherData.TransactionDetailID;
   myjournalVocherData.TransactionMasterCode = this.journalVocherData.TransactionMasterCode;
   myjournalVocherData.TransactionMasterID = this.journalVocherData.TransactionMasterID;
   myjournalVocherData.TransactionStatus = this.journalVocherData.TransactionStatus;

   var disb = this.DisbursementGLList;
   //myjournalVocherData.TransactionSeq = this.seqIndex;

   myjournalVocherData.EffectiveDate = this.JvForm.controls.EffectiveDate.value;
    if (myjournalVocherData.EffectiveDate._isAMomentObject == undefined) {
      debugger
      try {
        var day = this.JvForm.controls.EffectiveDate.value.getDate();
        var month = this.JvForm.controls.EffectiveDate.value.getMonth() + 1;
        var year = this.JvForm.controls.EffectiveDate.value.getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        myjournalVocherData.EffectiveDate = day + "" + month + "" + year;
        myjournalVocherData.WorkingDateTransDate = this.JvForm.controls.BranchWorkingDate.value;
        myjournalVocherData.TransactionDate = myjournalVocherData.EffectiveDate;
      } catch (e) {

      }
    }
    else {
      try {
        var day = this.JvForm.controls.EffectiveDate.value.toDate().getDate();
        var month = this.JvForm.controls.EffectiveDate.value.toDate().getMonth() + 1;
        var year = this.JvForm.controls.EffectiveDate.value.toDate().getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        this.journalVocherData.EffectiveDate = day + "" + month + "" + year;
      } catch (e) {

      }
    }
    var userInfo = this.userUtilsService.getUserDetails();
    myjournalVocherData.IpAddress = "192.168.232.2";
    myjournalVocherData.DrAmount = this.JvForm.controls.GlHead.value == "D" ? this.JvForm.controls.Amount.value : 0;
    myjournalVocherData.CRAMOUNT = this.JvForm.controls.GlHead.value == "C" ? this.JvForm.controls.Amount.value : 0;
    this.spinner.show();
    this.submitted = true;
    this._journalVoucherService
      .createJVTransaction(myjournalVocherData)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        this.lcno = this.JvForm.controls.LoanCaseID.value;
        this.accNo = this.JvForm.controls.DepositAccID.value;
        this.advNo = this.JvForm.controls.AdviceNo.value;
        this.roCode = this.JvForm.controls.RoCode.value;
        this.contBr = this.JvForm.controls.ContraBranchCode.value;
        this.contDept = this.JvForm.controls.OrgDeptID.value;

        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          
          this.table = true;
          this.tf = false;
          this.jvGl = baseResponse.JournalVoucher.JVGLDetailList;
          this.jvMaster = baseResponse.JournalVoucher.JVMasterDetailList;
          this.cdRef.detectChanges();

          this.jvMaster.forEach(element => {
            this.JvForm.controls['VoucherNo'].setValue(element.ManualVoucherNo);
            this.journalVocherData.TransactionID = element.TransactionID;
            this.journalVocherData.TransactionFlag = element.TransactionFlag;
            this.journalVocherData.TransactionStatus = element.TransactionStatus;
            //console.log(this.JvForm.controls.VoucherNo.value)TransactionDetailID
          });

          // this.jvGl.forEach(element => {
          //   this.journalVocherData.TransactionDetailID = element.TransactionDetailID;
          // });

          this.JvForm.controls["GlSubID"].setValue('');
          this.JvForm.controls["Amount"].setValue('');
          this.JvForm.controls["TransactionMasterID"].setValue('');
          //this.JvForm.controls["GlHead"].setValue('');
          //this.JvForm.controls["TrCode"].setValue('');
          this.JvForm.controls["GlSub"].setValue('');
          this.JvForm.controls["RoCode"].setValue('');
          this.JvForm.controls["AdviceNo"].setValue('');
          this.JvForm.controls["ContraBranchCode"].setValue('');
          this.JvForm.controls["OrgDeptID"].setValue('');
          this.JvForm.controls["LoanCaseID"].setValue('');
          this.JvForm.controls["LoanDisbID"].setValue('');
          this.JvForm.controls["DepositAccID"].setValue('');
          this.JvForm.controls["ContraVoucherNo"].setValue('');
          this.JvForm.controls["RecordNo"].setValue('');
          this.JvForm.controls["CaCode"].setValue('');
          this.JvForm.controls["InstrumentType"].setValue('');
          this.JvForm.controls["InstrumentNO1"].setValue('');
          this.JvForm.controls["InstrumentNO2"].setValue('');
          this.JvForm.controls["EmpPPNo"].setValue('');
          this.JvForm.controls["TransactionMasterCode"].setValue('');
          this.JvForm.controls["Samlc"].setValue('');
          this.JvForm.controls["Glsam"].setValue('');
          //this.JvForm.controls["Note"].setValue('');
          this.JvForm.controls["Remarks"].setValue('');

          this.JvForm.get('TransactionMasterID').markAsUntouched();
          this.JvForm.get('TransactionMasterID').markAsPristine();
          // this.JvForm.get('GlHead').markAsUntouched();
          // this.JvForm.get('GlHead').markAsPristine();
          this.JvForm.get('GlSubID').markAsUntouched();
          this.JvForm.get('GlSubID').markAsPristine();
          this.JvForm.get('Amount').markAsUntouched();
          this.JvForm.get('Amount').markAsPristine();
          // this.JvForm.get('TrCode').markAsUntouched();
          // this.JvForm.get('TrCode').markAsPristine();
          
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.cdRef.detectChanges();


        }

      });

      console.log(myjournalVocherData);
      this.myPrevID.TrMasterIDJv = myjournalVocherData.TrMasterIDJv
    }

    backToList(){
      this.router.navigateByUrl('journal-voucher/search-pending');
    }

    findJv(){
      var tempArr = []
      this.jvGl.forEach(element => {
        if(this.JvForm.controls["GlSubID"].value == element.GlSubCode){
          tempArr.push(element)
        }
      });
      this.jvGl = tempArr
    }



  submitJv() {
    debugger
    var transactionID;
    var remarks = this.JvForm.controls.Remarks.value;
    var status = "S";
    this.jvGl.forEach(element => {
      transactionID = element.TransactionID;
      //status = element.TransactionStatus;
    });

    if(this.jvGl.length == 0){
      this.jvMaster.forEach(element => {
        transactionID = element.TransactionID;
        //status = element.TransactionStatus;
      });
    }

    //console.log(transactionID)
    //var transactionID = this.JvForm.controls.TransactionID.value;

    this.spinner.show();
    this.submitted = true;
    this._journalVoucherService
      .getChangeTransactionStatusJV(transactionID, status, remarks)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      ).subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          this.router.navigateByUrl("/journal-voucher/search-pending");
        }
        else {
          console.log(baseResponse)
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.cdRef.detectChanges();
        }

      });
 
  }

  deleteRow(trow){

    debugger
    //console.log(trow.TransactionDetailID)
    // var transactionDetailID;
    let status = trow.TransactionStatus;
    let responseDetail;
       this.spinner.show();
       this._journalVoucherService
      .deleteJv(trow.TransactionDetailID)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          responseDetail = baseResponse.JournalVoucher.JournalVoucherData;
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          trow=[]
          console.log(trow)
          this.cdRef.detectChanges();
          this.getJvInfo();
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });

      // if(status == "P"){
      //   this.router.navigateByUrl('journal-voucher/search-pending')
      // }
      // else{
      //   this.router.navigateByUrl('journal-voucher/search-refer-back')
      // }
  }

  editRow(hi){
    console.log(hi)
    
    debugger
    var transactionID;
    let rowValue;
    this.jvGl.forEach(element => {
      console.log(element)
      transactionID = element.TransactionID;
    });
    this.spinner.show();
    this._journalVoucherService
      .bindGridWithTrDetail(transactionID)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          debugger
          
          rowValue = baseResponse.JournalVoucher.JournalVoucherDataList;
          for(var a= 0 ; this.jvGl.length> a; a++)
          {
            if(rowValue[a].TransactionSeq == hi){
              debugger
              
              if(this.DisbursementGLList.length >= 1){
                this.DisbursementGLList = []
              }

              console.log(rowValue[a])
              this.JvForm.controls['VoucherNo'].setValue(rowValue[a].ManualVoucherNo);
              this.JvForm.controls['TransactionMasterID'].setValue(rowValue[a].TransactionMasterCode); 
              this.JvForm.controls['GlSubID'].setValue(rowValue[a].MasterDesc);
              this.JvForm.controls['GlSubID'].setValue(rowValue[a].GlSubCode);
              this.JvForm.controls['GlSub'].setValue(rowValue[a].GlSubName);
              this.JvForm.controls['LoanCaseID'].setValue(rowValue[a].LoanCaseNo);
              this.JvForm.controls['RoCode'].setValue(rowValue[a].RoCode);
              this.JvForm.controls['ContraBranchCode'].setValue(rowValue[a].ContraBranchCode);
              this.JvForm.controls['EmpPPNo'].setValue(rowValue[a].EmpPPNo);
              this.JvForm.controls['AdviceNo'].setValue(rowValue[a].AdviceNo);
              this.JvForm.controls['RecordNo'].setValue(rowValue[a].RecordNo);
              this.JvForm.controls['DepositAccID'].setValue(rowValue[a].DepositAccID);
              this.JvForm.controls['CaCode'].setValue(rowValue[a].CaCode);
              this.JvForm.controls['ContraVoucherNo'].setValue(rowValue[a].ContraVoucherNo);
              this.JvForm.controls['InstrumentType'].setValue(rowValue[a].InstrumentType);
              this.JvForm.controls['InstrumentNO1'].setValue(rowValue[a].InstrumentNo1);
              this.JvForm.controls['InstrumentNO2'].setValue(rowValue[a].InstrumentNo2);
              this.JvForm.controls['Samlc'].setValue(rowValue[a].Samlc);
              this.JvForm.controls['Glsam'].setValue(rowValue[a].Glsam);
              this.JvForm.controls['Note'].setValue(rowValue[a].Note);
              this.JvForm.controls['Remarks'].setValue(rowValue[a].Remarks);
              //this.JvForm.controls['LoanDisbID'].setValue(rowValue[a].RoCode);
              if(rowValue[a].LoanCaseNo != undefined){
                var Lcno = rowValue[a].LoanCaseNo;
                this._journalVoucherService
                .getGLForLC(Lcno)
                .pipe(
                  finalize(() => {
                    this.submitted = false;
                  })
              ).subscribe((baseResponse: BaseResponseModel) => {
                console.log(baseResponse);
                if (baseResponse.Success === true) {
                  debugger
                  var listGL = baseResponse.JournalVoucher.GLforJVList;                  
                  this.DisbursementGLList.splice(0, 0);
                  console.log(listGL)
                  
                  
                  listGL.forEach((part, index)=> {
                    var tempDisbursementGLList = new DisbursementGLModel();
                    tempDisbursementGLList.LoanDisbID = part.LoanDisbID;
                    tempDisbursementGLList.Description = part.DisbDesc;
                    this.DisbursementGLList.push(tempDisbursementGLList);
                  }, listGL);

                  this.JvForm.controls['LoanDisbID'].setValue(this.DisbursementGLList[0]);

                }
              },
                (error) => {
                  this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");
                  console.log(error)
                });
              }
              
              this.JvForm.controls['TrCode'].setValue(rowValue[a].TrCode);
              this.seqIndex = rowValue[a].TransactionSeq;
              this.journalVocherData.TransactionDetailID = rowValue[a].TransactionDetailID;

              if(rowValue[a].CrAmount != undefined){
                this.JvForm.controls['GlHead'].setValue("C");
                this.JvForm.controls['Amount'].setValue(rowValue[a].CrAmount);
              }else{
                this.JvForm.controls['GlHead'].setValue("D");
                this.JvForm.controls['Amount'].setValue(rowValue[a].DrAmount);
              }
              //console.log(rowValue[a].CrAmount)
            }
          }
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

       });
  }

  len ;
  isEmpty;

  changed(value){
    this.len = value.target.value;
    if(this.len.length <= 13)
    {
      //this.customerForm.reset();
      this.isEmpty = false;
      this.DisbursementGLList = []
      this.JvForm.markAsUntouched();
      this.JvForm.markAsPristine();
    }
  }

  deleteJv() {
    debugger
    var transactionID;
    var remarks = this.JvForm.controls.Remarks.value;
    var status = "C";
    this.jvGl.forEach(element => {
      //console.log(element)
      transactionID = element.TransactionID;
    });

    if(this.jvGl.length == 0){
      this.jvMaster.forEach(element => {
        transactionID = element.TransactionID;
        //status = element.TransactionStatus;
      });
    }

    this.spinner.show();
    this._journalVoucherService
      .getChangeTransactionStatusJV(transactionID, status, remarks)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          this.router.navigateByUrl("/journal-voucher/search-pending");

        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  openJvOrganizationDialog(){
   const dialogRef = this.dialog.open(JvOrganizationalStructureComponent, { width: "800px", data: { OrgDeptID: this.JvForm.controls.OrgDeptID.value }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.JvForm.controls.OrgDeptID.setValue(res);
    });
  }

  clearForm() {
    
    // this.router.navigateByUrl("/journal-voucher/form");
    // //location.reload(true);
    // return;
   // this.hasFormErrors = false;

   this.JvForm.controls["GlSubID"].reset();
   this.JvForm.controls["Amount"].reset();
   this.JvForm.controls["TransactionMasterID"].reset();
   this.JvForm.controls["GlHead"].reset();
   this.JvForm.controls["TrCode"].reset();
   this.JvForm.controls["RoCode"].reset();
   this.JvForm.controls["AdviceNo"].reset();
   this.JvForm.controls["ContraBranchCode"].reset();
   this.JvForm.controls["OrgDeptID"].reset();
   this.JvForm.controls["LoanCaseID"].reset();
   this.JvForm.controls["LoanDisbID"].reset();
   this.JvForm.controls["DepositAccID"].reset();
   this.JvForm.controls["ContraVoucherNo"].reset();
   this.JvForm.controls["RecordNo"].reset();
   this.JvForm.controls["CaCode"].reset();
   this.JvForm.controls["InstrumentType"].reset();
   this.JvForm.controls["InstrumentNO1"].reset();
   this.JvForm.controls["InstrumentNO2"].reset();
   this.JvForm.controls["EmpPPNo"].reset();
   this.JvForm.controls["TransactionMasterCode"].reset();
   this.JvForm.controls["Samlc"].reset();
   this.JvForm.controls["Glsam"].reset();
   this.JvForm.controls["Note"].reset();
   this.JvForm.controls["Remarks"].reset();

   this.DisbursementGLList = [];
   this.jvMaster = [];
   this.jvGl = [];

   this.JvForm.get('TransactionMasterID').markAsUntouched();
   this.JvForm.get('TransactionMasterID').markAsPristine();
   this.JvForm.get('GlHead').markAsUntouched();
   this.JvForm.get('GlHead').markAsPristine();
   this.JvForm.get('GlSubID').markAsUntouched();
   this.JvForm.get('GlSubID').markAsPristine();
   this.JvForm.get('Amount').markAsUntouched();
   this.JvForm.get('Amount').markAsPristine();
    
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
