// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
import { RoleDeleted } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { ActivityDataSource } from '../../../../../core/auth/_data-sources/activity.datasource';
import { BaseComponentPage } from '../../../base-component.component';
import { CashrequestModule } from '../../../../../core/auth/_models/cashrequest.module';
import { ReportService } from '../../../../../core/auth/_services/report.service';
import { ReportFilters } from '../../../../../core/auth/_models/report-filters.model';
import { ApilogDetailComponent } from '../../apilog-detail/apilog-detail.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'kt-location-history-list',
  templateUrl: './location-history-list.component.html'
})
export class LocationHistoryListComponent implements OnInit {

  dataSource = new MatTableDataSource();
  reportFilter: ReportFilters = new ReportFilters();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;

  displayedColumns = ['UserId', 'Created', 'LastAction', 'Remarks'];

  gridHeight: string;
  FilterForm: FormGroup;
  StartDate: Date;
  hasFormErrors = false;
  EndDate: Date;





  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private _reportservice: ReportService) { }

  ngOnInit() {

    this.createForm();
  }

  createForm() {
    this.FilterForm = this.filterFB.group({
      StartDate: [new Date()],
      EndDate: [new Date()],
      PPNumber: [this.reportFilter.PPNumber, [Validators.required]]
    });
  }


  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  loadUserHistoryPage() {
    this.dataSource.data = [];
    this.loadUserHistory();
  }



  keyPress(event: any) {
    debugger;
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }





  hasError(controlName: string, errorName: string): boolean {
    return this.FilterForm.controls[controlName].hasError(errorName);
  }


  get f(): any {
    return this.FilterForm.controls;
  }



  loadUserHistory() {

    debugger;
    this.hasFormErrors = false;
    this.reportFilter = Object.assign(this.reportFilter, this.FilterForm.value);

    if (this.reportFilter.PPNumber == null || this.reportFilter.PPNumber.toString() == "") {
      const controls = this.FilterForm.controls;

      if (this.FilterForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        return;
      }

    }
    else {

      debugger
      this._reportservice.getUserHistory(this.reportFilter)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(baseResponse => {
          debugger;
          if (baseResponse.Success)
            this.dataSource.data = baseResponse.UserHistories;
          else
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });

    }
  }


  comparisonEnddateValidator(): any {
    let ldStartDate = this.FilterForm.value['StartDate'];
    let ldEndDate = this.FilterForm.value['EndDate'];

    let startnew = new Date(ldStartDate);
    let endnew = new Date(ldEndDate);
    if (startnew > endnew) {
      return this.FilterForm.controls['EndDate'].setErrors({ 'invaliddaterange': true });
    }

    let oldvalue = startnew;
    this.FilterForm.controls['StartDate'].reset();
    this.FilterForm.controls['StartDate'].patchValue(oldvalue);
    return this.FilterForm.controls['StartDate'].setErrors({ 'invaliddaterange': false });
  }

  comparisonStartdateValidator(): any {
    let ldStartDate = this.FilterForm.value['StartDate'];
    let ldEndDate = this.FilterForm.value['EndDate'];

    let startnew = new Date(ldStartDate);
    let endnew = new Date(ldEndDate);
    if (startnew > endnew) {
      return this.FilterForm.controls['StartDate'].setErrors({ 'invaliddaterange': true });
    }

    let oldvalue = endnew;
    this.FilterForm.controls['EndDate'].reset();
    this.FilterForm.controls['EndDate'].patchValue(oldvalue);
    return this.FilterForm.controls['EndDate'].setErrors({ 'invaliddaterange': false });
  }








  exportToExcel() {

  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.title = searchText;
    return filter;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  ngOnDestroy() {

  }


  masterToggle() {

  }


}
