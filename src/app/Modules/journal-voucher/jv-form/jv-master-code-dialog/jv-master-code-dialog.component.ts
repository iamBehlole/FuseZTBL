import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { LovService } from '../../../../../core/auth/_services/lov.service';
import { CommonService } from '../../../../../core/auth/_services/common.service';
import { CircleService } from '../../../../../core/auth/_services/circle.service';
import { LovConfigurationKey, DateFormats, Lov } from '../../../../../core/auth/_models/lov.class';
import { BaseResponseModel } from '../../../../../core/_base/crud/models/_base.response.model';
import { RecoveryService } from '../../../../../core/auth/_services/recovery.service';
import { JournalVoucherService } from '../../../../../core/auth/_services/journal-voucher.service';


@Component({
  selector: 'kt-jv-master-code-dialog',
  templateUrl: './jv-master-code-dialog.component.html',
  styles: [],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class JvMasterCodeDialogComponent implements OnInit {

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
  submitted = false;
  dataFetched = false;
  detailDataFetched = false;
  JvSearchForm: FormGroup;
  sanctionedAmount: number = 0;
  tranId: string;
  public recoveryTypes: any[] = [];
  public MasterCodeList: any[] = [];
  public MasterCodeListDetail: any[] = [];
  maxDate = new Date();
  Zones: any = [];
  SelectedZones: any = [];
  public LovCall = new Lov();
  //public recoveryData = new RecoveryDataModel();
  onDetailCall :boolean = false;
  tf :boolean = false;


  rowClicked;
  sRowClicked;

  JVCategories: any;

  findButton = "Find";
  requiryTypeRequired = false;

  itemsPerPage= 10; //you could use your specified
  totalItems : number | any;
  pageIndex = 1;
  codeDetail :any;

  newDynamic: any = {};

  constructor(
    public dialogRef: MatDialogRef<JvMasterCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private _common: CommonService,
    private spinner: NgxSpinnerService,
    private _circleService: CircleService,
    private _journalVoucherService: JournalVoucherService,
  ) { }

  ngOnInit() {
   
    this.createForm();
    this.loadLOV();
    debugger;
    if (this.data) {
      this.JvSearchForm.controls.code.setValue(this.data.TransactionMasterID);
    }
    this.getMasterCode();
  }

  getKeys(obj: any) { return Object.keys(obj); }

  async loadLOV() {

    this.JVCategories = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.JVCategory });
    
    var fi : any = []
    fi.Value = "";
    fi.Name = "PLEASE SELECT---";
    fi.LovId = "12389"
    fi.Id="0";
    fi.Description="PLEASE SELECT---"
    console.log(fi)

    // var arr = fi.concat(this.JVCategories.LOVs)
    // console.log(arr)

    
    this.JVCategories.LOVs.push(fi)
    //this.JVCategories.LOVs.splice(0, fi)
    this.JVCategories = this.JVCategories.LOVs;
    //console.log(this.JVCategories)
    debugger;

    console.log('JVCategories');
    console.log(this.JVCategories);

    this.cdRef.detectChanges();

  }

  createForm() {
    this.JvSearchForm = this.formBuilder.group({
      category: [''],
      code: [''],
    });
  }

  selectedRow(){
    var index, table = document.getElementById("codeTable");
    console.log(table)
    //for(var i = 1; i < table.rows.length){}
  }

  getMasterCode(){
    var category = this.JvSearchForm.controls.category.value;
    var code = this.JvSearchForm.controls.code.value;
    console.log(category);
    debugger;

    this.submitted = true;
    this.MasterCodeList = [];
    this.spinner.show();
    this._journalVoucherService
      .getJVMasterCodes(category, code)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.dataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          this.MasterCodeList = baseResponse.JournalVoucher.JvMasterCodesList;
          console.log(this.MasterCodeList);
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      });
  }

  find() {
    var category = this.JvSearchForm.controls.category.value;
    var code = this.JvSearchForm.controls.code.value;
    console.log(category);
    debugger;

    this.submitted = true;
    this.MasterCodeList = [];
    this.spinner.show();
    this._journalVoucherService
      .getJVMasterCodes(category, code)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.dataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          debugger
          this.MasterCodeList = baseResponse.JournalVoucher.JvMasterCodesList;
          this.MasterCodeListDetail = [];
          console.log('getJVMasterCodes output');
          this.rowClicked = null;
          this.sRowClicked = null;
          var index = null;
          this.changeTableRowColor(index);
          this.changeSecondTableRowColor(index);
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
          this.MasterCodeListDetail = [];
        }

      });
  }

 


  findDetail(code :string, index: any) {

    //var code = this.JvSearchForm.controls.code.value;
    
    debugger;    
    
    this.MasterCodeListDetail = [];
    this.spinner.show();
    this._journalVoucherService
      .getJVMasterCodesDetail(code)
      .pipe(
        finalize(() => {
          this.detailDataFetched = true;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.MasterCodeListDetail = baseResponse.JournalVoucher.JvMasterCodeDetailList;
          this.codeDetail = this.MasterCodeListDetail;
          this.totalItems = this.MasterCodeListDetail.length; 
          this.paginate(this.pageIndex);
          console.log(this.codeDetail)
          console.log('getJVMasterCodesDetail output');
          this.cdRef.detectChanges();
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      },
        (error) => {
          debugger;
          this.layoutUtilsService.alertElementSuccess("", "Error Occured While Processing Request", "500");
          console.log(error)
        });

        if(this.rowClicked == null || this.rowClicked != index){
          debugger
          this.changeTableRowColor(index);
          this.sRowClicked = null;
        }  
  }

  detailCall(index:any){
    debugger
    this.onDetailCall = true;
    
    
    if(this.sRowClicked == null || this.sRowClicked != index){
      this.changeSecondTableRowColor(index);
    }  
    //this.tf = true;
  }

  changeTableRowColor(idx: any) { 
    if(idx != null){
      if(this.rowClicked === idx) this.rowClicked = -1;
      else this.rowClicked = idx;
    }
    
  }

  changeSecondTableRowColor(idx: any) {
    if(idx != null){
      if(this.sRowClicked === idx) this.sRowClicked = -1;
      else this.sRowClicked = idx;  
    } 
    
  }

  paginate(event){
    debugger
    this.pageIndex = event;
    this.MasterCodeListDetail = this.codeDetail.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
  }

  editLoadTransaction(LnTransactionID: string, Lcno: string, ViewOnly: boolean) {
    this.router.navigate(['../fa-branch', { LnTransactionID: LnTransactionID, Lcno: Lcno, ViewOnly: ViewOnly }], { relativeTo: this.activatedRoute });
    //this.router.navigate(['/loan-recovery/fa-branch'], { queryParams: { transactionID: LnTransactionID, lcno: Lcno } });    
  }

  isShowEditIcon(status: string, maker: string) {
    debugger;
    //var userInfo = this.userUtilsService.getUserDetails();
    //if (userInfo.User.UserId == maker && (status == "P"))
    //  return true;

    //return false;
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.JvSearchForm.controls[controlName].hasError(errorName);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  close(result: any): void {
    this.dialogRef.close(result);
  }

  clearForm() {
    this.JvSearchForm.reset();
  }

}
