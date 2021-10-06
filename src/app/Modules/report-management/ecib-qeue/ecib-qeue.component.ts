
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
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Models
import { RoleDeleted } from '../../../../core/auth';
import { AppState } from '../../../../core/reducers';
import { QueryParamsModel } from '../../../../core/_base/crud';
import { ActivityDataSource } from '../../../../core/auth/_data-sources/activity.datasource';
import { BaseComponentPage } from '../../base-component.component';
import { CashrequestModule } from '../../../../core/auth/_models/cashrequest.module';
import { ReportService } from '../../../../core/auth/_services/report.service';
import { ReportFilters } from '../../../../core/auth/_models/report-filters.model';
import { ApilogDetailComponent } from '../apilog-detail/apilog-detail.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'kt-ecib-qeue',
  templateUrl: './ecib-qeue.component.html'
})
export class EcibQeueComponent implements OnInit {

  dataSource = new MatTableDataSource();
  reportFilter: ReportFilters = new ReportFilters();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;

  displayedColumns = [ 'TransactionId', 'CREATED', 'CNIC', 'STATUS', 'NTN', 'NAME', 'PERMANENTADDRESS', 'BRANCH', 'DOB'];

  gridHeight: string;
  FilterForm: FormGroup;
  StartDate: Date;
  EndDate: Date;
  myDate = new Date().toLocaleDateString();
  constructor( //private datePipe: DatePipe,
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private _reportservice: ReportService

  ) { }

  ngOnInit() {
    this.loadApiLogs();

    debugger;

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 300 + 'px';
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  loadApiLogsPage() {
    this.loadApiLogs();
  }

  loadApiLogs() {


    debugger;
    this._reportservice.getEcibQeue()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success)
          this.dataSource.data = baseResponse.ecibListFull;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }

}
