import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { ReportFilters } from '../../../../../core/auth/_models/report-filters.model';
import { AppState } from '../../../../../core/reducers';
import { Store } from '@ngrx/store';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ReportService } from '../../../../../core/auth/_services/report.service';
import { finalize } from 'rxjs/operators';
import { ErrorLogDetails } from '../../../../../core/auth/_models/error-log-details.model';

@Component({
  selector: 'kt-exceptionlog-details',
  templateUrl: './exceptionlog-details.component.html'
})
export class ExceptionlogDetailsComponent implements OnInit {


  dataSource = new MatTableDataSource();
  reportFilter: ReportFilters = new ReportFilters();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  Request: string;
  Response: string;
  errorLogDetails: ErrorLogDetails = new ErrorLogDetails();
  displayedColumns = ['InputParameters', 'ErrorTrace','Message'];

  gridHeight: string;


  constructor(public dialogRef: MatDialogRef<ExceptionlogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    //private excelService: ExcelUtilsService,
    //private auditService: AuditTrailService,
    private _reportservice: ReportService) { }

  ngOnInit() {

    this.getErrorLogDetails();
  }


  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 390 + 'px';
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  LoadErrorLogDetailsPage() {
    this.getErrorLogDetails();
  }



  getErrorLogDetails() {

    debugger;

    this.reportFilter.clear();
    this.reportFilter.Id = this.data.reportFilter.Id;

    this._reportservice.getErrorLogDetails(this.reportFilter)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          debugger;
          this.errorLogDetails = baseResponse.ErrorLog;
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }




  exportToExcel() {
    //this.exportActivities = [];
    //Object.assign(this.tempExportActivities, this.dataSource.data);
    //this.tempExportActivities.forEach((o, i) => {
    //  this.exportActivities.push({
    //    activityName: o.activityName,
    //    activityURL: o.activityURL,
    //    parentActivityName: o.parentActivityName
    //  });
    //});
    //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.title = searchText;
    return filter;
  }



  ngOnDestroy() {
    //this.subscriptions.forEach(el => el.unsubscribe());
  }



  //isAllSelected(): boolean {
  //  //const numSelected = this.selection.selected.length;
  //  //const numRows = this.cashrequestsResult.length;
  //  //return numSelected === numRows;
  //}

  /**
   * Toggle selection
   */
  masterToggle() {
    //if (this.selection.selected.length === this.cashrequestsResult.length) {
    //  this.selection.clear();
    //} else {
    //  this.cashrequestsResult.forEach(row => this.selection.select(row));
    //}
  }
}
