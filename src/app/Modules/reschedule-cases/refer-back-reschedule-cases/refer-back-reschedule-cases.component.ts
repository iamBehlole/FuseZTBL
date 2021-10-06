import { ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { ReschedulingService } from "../../../../core/auth/_services/rescheduling.service";
import { BaseResponseModel } from "../../../../core/_base/crud/models/_base.response.model";
import { finalize } from "rxjs/operators";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { LovService } from "../../../../core/auth/_services/lov.service";
import {
  Lov,
  LovConfigurationKey,
} from "../../../../core/auth/_models/lov.class";
import { ActivatedRoute, Router } from "@angular/router";
import { Loan } from "../../../../core/auth/_models/loan-application-header.model";

@Component({
  selector: "kt-refer-back-reschedule-cases",
  templateUrl: "./refer-back-reschedule-cases.component.html",
  styleUrls: ["./refer-back-reschedule-cases.component.scss"],
})
export class ReferBackRescheduleCasesComponent implements OnInit {
  displayedColumns = [
    "TransactionDate",
    "LoanApp",
    "GlDescription",
    "Status",
    "Scheme",
    "OldDate",
    "AcStatus",
    "View",
    "Submit",
  ];
  dataSource: MatTableDataSource<ReferBack>;
  LoggedInUserInfo: BaseResponseModel;
  ELEMENT_DATA: ReferBack[] = [];
  Mydata: any;
  loanResch: any;
  //Loan Status inventory
  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];
  public LovCall = new Lov();
  public search = new Loan();
  LoanTypes: any = [];

  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  OffSet: any;

  matTableLenght: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private _reschedulingService: ReschedulingService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // this.getLoanStatus();
  }

  ngOnInit() {
    // this.getLoanStatus();

    debugger;
    this.spinner.show();
    debugger;
    this.loadData();
    this.spinner.hide();
  }

  getRow(rob) {
    //console.log(rob);
    this.loanResch = rob;
    console.log(this.loanResch);
  }

  //-------------------------------Loan Status Functions-------------------------------//
  // async getLoanStatus() {
  //   this.LoanStatus = await this._lovService.CallLovAPI(
  //     (this.LovCall = { TagName: LovConfigurationKey.LoanStatus })
  //   );
  //   this.SelectedLoanStatus = this.LoanStatus.LOVs;
  //   console.log(this.SelectedLoanStatus);
  // }

  editRefer(updateLoan) {
    debugger;
    console.log(updateLoan);
    this.router.navigate(
      [
        "../make-reschedule",
        {
          LnTransactionID: updateLoan.loanApp,
          loanReschID: updateLoan.LoanReschID,
        },
      ],
      { relativeTo: this.activatedRoute }
    );
  }

  loadData() {
    this.search.LcNo = "";
    this.search.Appdt = "";
    this.search.Status = "4";
    this._reschedulingService
      .RescheduleSearch(this.search)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.Mydata = baseResponse.Loan.ReschedulingSearch;
          console.log(baseResponse)
          debugger;
          // var status;
          // if (
          //   (this.Mydata[0].OrgUnitName != null,
          //   this.Mydata[0].OrgUnitName != undefined)
          // ) {
          //   var devProdFlag = this.LoanTypes.LOVs.filter((x) => x.Name == this.Mydata[0].OrgUnitName ); //[0].Id;
          //   if (devProdFlag.length > 0) {
          //     status = devProdFlag[0].Id;
          //   }
          // }
          for (let data in this.Mydata) {
            this.ELEMENT_DATA.push({
              transactionDate: this.Mydata[data].OrgUnitName,
              loanApp: this.Mydata[data].LoanCaseNo,
              glDescription: this.Mydata[data].GlDesc,
              status: this.Mydata[data].StatusName,
              scheme: this.Mydata[data].SchemeCode,
              oldDate: this.Mydata[data].LastDueDate,
              acStatus: this.Mydata[data].DisbStatusName,
              LoanReschID: this.Mydata[data].LoanReshID,
              remarks: this.Mydata[data].Remarks,
            });
          }
        

          debugger;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          console.log(this.dataSource)

          if (this.dataSource.data.length > 0) this.matTableLenght = true;
          else this.matTableLenght = false;

          this.dv = this.dataSource.filteredData;
          debugger;
          this.totalItems = this.dataSource.filteredData.length;
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);

        } else {
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
        }
      });
  }

  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    //this.SearchJvData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(
      pageIndex * this.itemsPerPage - this.itemsPerPage,
      pageIndex * this.itemsPerPage
    ); //slice is used to get limited amount of data from APi
  }

  SubmitData() {
    this.spinner.show();

    debugger;
    this._reschedulingService
      .SubmitRescheduleData(this.loanResch)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          this.router.navigateByUrl("/journal-voucher/form");
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

interface ReferBack {
  // branch: string;
  transactionDate: string;
  loanApp: string;
  glDescription: string;
  status: string;
  scheme: string;
  oldDate: string;
  acStatus: string;
  // submit: boolean;
  LoanReschID: string;
  remarks: string;
}
