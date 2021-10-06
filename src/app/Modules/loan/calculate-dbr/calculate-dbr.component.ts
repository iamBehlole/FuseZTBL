import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debug } from 'node:console';
import { finalize } from 'rxjs/operators';
import { LoanDbr, SearchLoanDbr } from '../../../../core/auth/_models/loan-application-header.model';
import { LoanService } from '../../../../core/auth/_services/loan.service';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';

@Component({
  selector: 'kt-calculate-dbr',
  templateUrl: './calculate-dbr.component.html',
  styleUrls: ['./calculate-dbr.component.scss']
})
export class CalculateDbrComponent implements OnInit {
  dataSource = new LoanDbr();
  public LnTransactionID: number;

  constructor(private route: ActivatedRoute,
    private _loanService: LoanService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    debugger;
    this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
    this.searchLoanDbr();
  }

  onIncomeChange(e) {
    let index = this.dataSource.DBRIncomeList.findIndex(inc => inc.ID === e.srcElement.id);
    this.dataSource.DBRIncomeList[index].Value = e.srcElement.value;
  }
  onLiabChange(e) {
    let index = this.dataSource.DBRLiabilitiesList.findIndex(inc => inc.ID === e.srcElement.id);
    this.dataSource.DBRLiabilitiesList[index].Value = e.srcElement.value;
  }

  //checkAdult(id) {
  //  return  >= 18;
  //}
  saveLoanDbr() {
    this.spinner.show();
    let loanDBR;
    let tranId=0;
    this._loanService
      .saveLoanDbr(this.dataSource, tranId)
      .pipe(
        finalize(() => {
          this.spinner.hide();

          this.cdRef.detectChanges();
        }))
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
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
        })
  }
  searchLoanDbr() {
    this.spinner.show();
    let loanFilter = new SearchLoanDbr();
    loanFilter.LoanAppID = this.LnTransactionID//20201642051;
    if (loanFilter.LoanAppID == undefined || loanFilter.LoanAppID == null)
      loanFilter.LoanAppID = 20201642051;


    this._loanService
      .searchLoanDbr(loanFilter)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          debugger;
          this.cdRef.detectChanges();
        }))
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        if (baseResponse.Success === true) {
          this.dataSource = baseResponse.Loan.DBR;
          this.dataSource.LoanAppID = 20201642051;
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
        })
    
  }

}
