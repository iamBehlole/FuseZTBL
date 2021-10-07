// Angular
import {Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef} from '@angular/core';
// RxJS
import {Observable, of, Subscription, from} from 'rxjs';
// Lodash
import {each, find, some} from 'lodash';
// NGRX
import {Store, select} from '@ngrx/store';
// State
// Services and Models

import {delay, finalize} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {ReportFilters} from 'app/core/auth/_models/report-filters.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {RequestResponse} from 'app/core/auth/_models/request-response.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppState} from '../../../core/reducers';
import {MatDialog} from '@angular/material/dialog/dialog';
import {MatSnackBar} from '@angular/material/snack-bar/snack-bar';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {ReportService} from '../../../core/auth/_services/report.service';

@Component({
    selector: 'kt-apilog-detail',
    templateUrl: './apilog-detail.component.html'
})
export class ApilogDetailComponent implements OnInit {


    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    Request: string;
    Response: string;
    RequestResponse: RequestResponse = new RequestResponse();
    displayedColumns = ['Request', 'Response'];

    gridHeight: string;

    constructor(public dialogRef: MatDialogRef<ApilogDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private store: Store<AppState>,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private layoutUtilsService: LayoutUtilsService,
                //private excelService: ExcelUtilsService,
                //private auditService: AuditTrailService,
                private _reportservice: ReportService
    ) {
    }


    ngOnInit() {

        this.getAPIRequestResponse();
    }


    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 390 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    loadApiLogsPage() {
        this.getAPIRequestResponse();
    }


    getAPIRequestResponse() {

        debugger;

        this.reportFilter.clear();
        this.reportFilter.Id = this.data.reportFilter.Id;

        this._reportservice.getAPIRequestResponse(this.reportFilter)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                debugger;
                if (baseResponse.Success) {
                    debugger;
                    this.RequestResponse = baseResponse._3RdPartyAPILog;
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }

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
