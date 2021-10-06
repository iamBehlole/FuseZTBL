import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Lov, LovConfigurationKey, LovData, MaskEnum, regExps, errorMessages, DateFormats } from '../../../../core/auth/_models/lov.class';
import { SearchLoan } from '../../../../core/auth/_models/loan-application-header.model';
import { LoanService } from '../../../../core/auth/_services/loan.service';
import { finalize } from 'rxjs/operators';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'kt-orr-list',
  templateUrl: './orr-list.component.html',
  styles: [],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ]
})
export class OrrListComponent implements OnInit {

  
  loanSearch: FormGroup;
  loanFilter = new SearchLoan()
  LoggedInUserInfo: BaseResponseModel;
  dataSource = new MatTableDataSource();

  public LovCall = new Lov();

  //Loan Status inventory
  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];

  circle : any = [];

  loggedInUserIsAdmin: boolean = false;

  displayedColumns = ['BranchName', 'AppDate', 'AppNumberManual', 'LoanCaseNo', 'ApplicationTitle', 'DevAmount', 'ProdAmount', 'StatusName','Action'];

  gridHeight: string;


  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private filterFB: FormBuilder,
    private _loanService: LoanService,
    private layoutUtilsService: LayoutUtilsService,
    private userUtilsService: UserUtilsService,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    if (this.LoggedInUserInfo.Branch.BranchCode == "All")
      this.loggedInUserIsAdmin = true;

    this.createForm();
    this.getLoanStatus(); 
  }


  createForm() {
    this.loanSearch = this.filterFB.group({
      LcNo: [this.loanFilter.LcNo],
      AppNo: [this.loanFilter.AppNo],
      Appdt: [this.loanFilter.Appdt],
      Status: [this.loanFilter.Status, [Validators.required]]
    });
  }

  //-------------------------------Loan Status Functions-------------------------------//
  async getLoanStatus() {
    this.LoanStatus = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LoanStatus })
    this.SelectedLoanStatus = this.LoanStatus.LOVs;
    console.log(this.SelectedLoanStatus)
  }
  searchLoanStatus(loanStatusId) {
    loanStatusId = loanStatusId.toLowerCase();
    if (loanStatusId != null && loanStatusId != undefined && loanStatusId != "")
      this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(x => x.Name.toLowerCase().indexOf(loanStatusId) > -1);
    else
      this.SelectedLoanStatus = this.LoanStatus.LOVs;
  }
  validateLoanStatusOnFocusOut() {
    if (this.SelectedLoanStatus.length == 0)
      this.SelectedLoanStatus = this.LoanStatus;
  }


  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 300 + 'px';
  }




  searchLoan() {
    debugger;

    const controls = this.loanSearch.controls;

    if (this.loanSearch.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    Object.keys(controls).forEach(controlName =>
      controls[controlName].value == undefined || controls[controlName].value == null ? controls[controlName].setValue("") : controls[controlName].value
    );

    this.loanFilter = Object.assign(this.loanFilter, this.loanSearch.getRawValue());

    if (!this.loggedInUserIsAdmin) {
      this.loanFilter.ZoneId = this.LoggedInUserInfo.Zone.ZoneId;
      this.loanFilter.BranchId = this.LoggedInUserInfo.Branch.BranchId;
     // this.circle = this.LoggedInUserInfo.UserCircleMappings;
    }

    this.spinner.show()
    this._loanService.searchLoanApplication(this.loanFilter)
      .pipe(
        finalize(() => {
        
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.Loan.ApplicationHeaderList;
        }
        else {
          this.dataSource.data = []
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
      });

  }

  editLoan(updateLoan) {
    debugger
    console.log(updateLoan)
    this.router.navigate(['../create', { LnTransactionID: updateLoan.LoanAppID, Lcno: updateLoan.LoanCaseNo }], { relativeTo: this.activatedRoute });
  }
}
