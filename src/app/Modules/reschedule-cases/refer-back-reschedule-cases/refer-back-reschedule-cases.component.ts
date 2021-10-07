import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReschedulingService } from '../../../core/auth/_services/rescheduling.service';
import { BaseResponseModel } from '../../../core/_base/crud/models/_base.response.model';
import { finalize } from 'rxjs/operators';
import { LayoutUtilsService } from '../../../core/_base/crud';
import { LovService } from '../../../core/auth/_services/lov.service';
import {
  Lov,
  LovConfigurationKey,
} from '../../../core/auth/_models/lov.class';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan } from '../../../core/auth/_models/loan-application-header.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'kt-refer-back-reschedule-cases',
  templateUrl: './refer-back-reschedule-cases.component.html',
  styleUrls: ['./refer-back-reschedule-cases.component.scss'],
})
export class ReferBackRescheduleCasesComponent implements OnInit {
  displayedColumns = [
    'TransactionDate',
    'LoanApp',
    'GlDescription',
    'Status',
    'Scheme',
    'OldDate',
    'AcStatus',
    'View',
    'Submit',
  ];
  dataSource: MatTableDataSource<ReferBack>;
  LoggedInUserInfo: BaseResponseModel;
  ELEMENT_DATA: ReferBack[] = [];
  Mydata: any;
  loanResch: any;
  // Loan Status inventory
  LoanStatus: any = [];
  loanStatus: any = [];
  SelectedLoanStatus: any = [];
  public LovCall = new Lov();
  public search = new Loan();
  LoanTypes: any = [];

  itemsPerPage = 10; // you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; // use later

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

  ngOnInit(): void{
    // this.getLoanStatus();

    this.spinner.show();
    this.loadData();
    this.spinner.hide();
  }

    // tslint:disable-next-line:typedef
  getRow(rob) {
    this.loanResch = rob;
    console.log(this.loanResch);
  }


    // tslint:disable-next-line:typedef
  editRefer(updateLoan) {
    console.log(updateLoan);
    this.router.navigate(
      [
        '../make-reschedule',
        {
          LnTransactionID: updateLoan.loanApp,
          loanReschID: updateLoan.LoanReschID,
        },
      ],
      { relativeTo: this.activatedRoute }
    );
  }

    // tslint:disable-next-line:typedef
  loadData() {
    this.search.LcNo = '';
    this.search.Appdt = '';
    this.search.Status = '4';
    this._reschedulingService
      .RescheduleSearch(this.search)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          this.Mydata = baseResponse.Loan.ReschedulingSearch;
          console.log(baseResponse);
            // tslint:disable-next-line:forin
          for (const data in this.Mydata) {
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
        

          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          console.log(this.dataSource);

          if (this.dataSource.data.length > 0) { this.matTableLenght = true; }
          else { this.matTableLenght = false; }

          this.dv = this.dataSource.filteredData;

          this.totalItems = this.dataSource.filteredData.length;
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);

        } else {
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message
          );
        }
      });
  }

    // tslint:disable-next-line:typedef
  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    this.dataSource = this.dv.slice(
      pageIndex * this.itemsPerPage - this.itemsPerPage,
      pageIndex * this.itemsPerPage
    ); // slice is used to get limited amount of data from APi
  }

    // tslint:disable-next-line:typedef
  SubmitData() {
    this.spinner.show();

    this._reschedulingService
      .SubmitRescheduleData(this.loanResch)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
          this.router.navigateByUrl('/journal-voucher/form');
        } else {
          this.layoutUtilsService.alertElement(
            '',
            baseResponse.Message
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
