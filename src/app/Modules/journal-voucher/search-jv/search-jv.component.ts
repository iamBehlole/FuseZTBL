import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelectChange, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Lov, LovConfigurationKey, DateFormats } from '../../../../core/auth/_models/lov.class';
import { CommonService } from '../../../../core/auth/_services/common.service';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { RecoveryService } from '../../../../core/auth/_services/recovery.service';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { KtDialogService } from '../../../../core/_base/layout';
import { CircleService } from '../../../../core/auth/_services/circle.service';
import { Zone } from '../../../../core/auth/_models/zone.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { JournalVoucherService } from '../../../../../app/core/auth/_services/journal-voucher.service';
import { JournalVocherData } from '../../../../core/auth/_models/journal-voucher.model'

@Component({
  selector: 'kt-search-jv',
  templateUrl: './search-jv.component.html',
  styles: [],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class SearchJvComponent implements OnInit {
  Math: any;

  displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status','View'];
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;

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
  JvSearchForm: FormGroup;
  sanctionedAmount: number = 0;
  tranId: string;
  public recoveryTypes: any[] = [];
  maxDate = new Date();
  Zones: any = [];
  Branches: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();
  LoggedInUserInfo: BaseResponseModel;
  loggedInUserDetails: any;

  OffSet:any;
  //pagination
  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  JvStatuses: any;
  Nature: any;
  JVCategories: any;
  public LovCall = new Lov();
  public JournalVoucher = new JournalVocherData();

  dataSource = new MatTableDataSource();
  matTableLenght: any;


  findButton = "Find";
  requiryTypeRequired = false;


  newDynamic: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private datePipe: DatePipe,
    private _common: CommonService,
    private _recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private _circleService: CircleService,
    private jv: JournalVoucherService
  ) { 
    this.Math = Math;
  }

  ngOnInit() {

    this.createForm();
    this.loadLOV();

    var userInfo = this.userUtilsService.getUserDetails();
    let dateString = userInfo.Branch.WorkingDate;
    var day = parseInt(dateString.substring(0, 2));
    var month = parseInt(dateString.substring(2, 4));
    var year = parseInt(dateString.substring(4, 8));

    const branchWorkingDate = new Date(year, month - 1, day);
    this.JvSearchForm.controls.TransactionDate.setValue(branchWorkingDate);
    this.JvSearchForm.controls.ZoneId.setValue(userInfo.Zone.ZoneName);
    this.JvSearchForm.controls.OrganizationUnit.setValue(userInfo.Branch.Name);
    //console.log(userInfo.Branch)
    this.maxDate = new Date(year, month - 1, day);

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
  }

  getKeys(obj: any) { return Object.keys(obj); }

  async loadLOV() {

    this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.JvStatus });
    debugger;
    this.JvStatuses = this.JvStatuses.LOVs;
    console.log(this.JvStatuses);

    this.Nature = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.JVCategory });
    debugger;
    this.Nature = this.Nature.LOVs;
    console.log(this.Nature);

    this.cdRef.detectChanges();

  }

  createForm() {
    this.JvSearchForm = this.formBuilder.group({
      ZoneId: [''],
      OrganizationUnit: [''],
      TransactionDate: [''],
      Nature: [''],
      VoucherNo: [''],
      Status: [''],
    });
  }

  
 
  validateZoneOnFocusOut() {
    if (this.SelectedZones.length == 0)
      this.SelectedZones = this.Zones;
  }



  


  find() {
    this.OffSet = 0;
    this.pageIndex = 0;
    this.dataSource.data = [];
    this.SearchJvData();  
  }

  SearchJvData(){
    debugger

    this.spinner.show();
    this.JournalVoucher.Offset = this.OffSet.toString();
    this.JournalVoucher.Limit = this.itemsPerPage.toString();

     var status = this.JvSearchForm.controls.Status.value;
     var nature = this.JvSearchForm.controls.Nature.value;
     var manualVoucher = this.JvSearchForm.controls.VoucherNo.value;
     var trDate = this.datePipe.transform(this.JvSearchForm.controls.TransactionDate.value, 'ddMMyyyy');
     
     console.log(trDate)
     if (status == ''){
      status = 'ALL';
    }

     if (nature == ''){
      nature = '1';
    }
    this.JournalVoucher = Object.assign(this.JournalVoucher, status);

    this.jv.getSearchJvTransactions(status, nature, manualVoucher, trDate)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        console.log(baseResponse)
        if (baseResponse.Success) {
          this.loading = false;
          debugger;
          this.dataSource.data = baseResponse.JournalVoucher.JournalVoucherDataList;

          if (this.dataSource.data.length > 0)
            this.matTableLenght = true;
          else
            this.matTableLenght = false;
          //if (this.dataSource.data.length == 0) {
          //  this.dataSource.data = baseResponse.searchLandData;
          //  this.ShowViewMore = true;
          //}
          //else {
          //  for (var i = 0; i < baseResponse.searchLandData.length; i++) {

          //    this.dataSource.data.push(baseResponse.searchLandData[i]);
          //  }
          //  this.dataSource._updateChangeSubscription();
          //}
          //pagination
          this.dv = this.dataSource.data;
          //this.dataSource = new MatTableDataSource(data);
          debugger;
          this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
          //this.paginate(this.pageIndex) //calling paginate function
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);
        }
        else {

          this.matTableLenght = false;

          this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
          //this.dataSource.data = [];
          //this._cdf.detectChanges();
          this.OffSet = 1;
          this.pageIndex = 1;
          this.dv = this.dv.slice(1,0);
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
          
        this.loading = false;
      });

  }

  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    //this.SearchJvData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
  }


  CheckEidtStatus(jv: any) {

  
    if (jv.Status == "2" || jv.Status == "5") {
      if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }

  }

  CheckViewStatus(jv: any) {

   
    if (jv.Status != "2" && jv.Status != "5") {
      return true
    }
    else {
      if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
        return false
      }
      else {
        return true
      }
    }

  }

  editJv(Jv: any) {
    debugger;
    //if (this.isUserAdmin) {
    //  console.log(this.CustomerLandRelation.ZoneId)
    //  console.log(this.CustomerLandRelation.BranchId)
    //}

    Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
    Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
    Jv.obj = "o";
    localStorage.setItem('SearchJvData', JSON.stringify(Jv));
    localStorage.setItem('EditJvData', '1');
    this.router.navigate(['../form', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }

  // viewJv(Jv: any){
  //   debugger
  //   Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
  //   Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
  //   localStorage.setItem('SearchJvData', JSON.stringify(Jv));
  //   localStorage.setItem('ViewJvData', '2');
  //   this.router.navigate(['../form', { upFlag : "2"}], { relativeTo: this.activatedRoute });
  // }

  isShowEditIcon(status: string, maker: string) {
    debugger;
    var userInfo = this.userUtilsService.getUserDetails();
    if (userInfo.User.UserId == maker && (status == "P"))
      return true;

    return false;
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.JvSearchForm.controls[controlName].hasError(errorName);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }


  clearForm() {

    this.JvSearchForm.reset();
  }

}
