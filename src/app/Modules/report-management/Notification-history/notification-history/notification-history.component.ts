// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
// Material
// RXJS
import {finalize} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import {MatTableDataSource} from '@angular/material/table';
import {ReportFilters} from '../../../../core/auth/_models/report-filters.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserHistory} from '../../../../core/auth/_models/location-history.model';
import {AppState} from '../../../../core/reducers';
import {MatDialog} from '@angular/material/dialog/dialog';
import {NotificationDetailsComponent} from '../notification-details/notification-details.component';
import {ReportService} from '../../../../core/auth/_services/report.service';
import {LayoutUtilsService} from '../../../../core/_base/crud';
import {MatSnackBar} from '@angular/material/snack-bar/snack-bar';
// Services
// Models

@Component({
    selector: 'kt-notification-history',
    templateUrl: './notification-history.component.html'
})
export class NotificationHistoryComponent implements OnInit {

    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['NotificationType', 'CreateDateTime', 'CreatedBy', 'View'];

    gridHeight: string;
    FilterForm: FormGroup;
    StartDate: Date;
    EndDate: Date;
    locationHistory: UserHistory = new UserHistory();
    myDate = new Date().toLocaleDateString();


    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        //private excelService: ExcelUtilsService,
        //private auditService: AuditTrailService,
        private _reportservice: ReportService) {
    }

    ngOnInit() {
        this.createForm();
        this.loadAllUsersNotifications();

        debugger;
        //this.FilterForm.controls["StartDate"].setValue(this.myDate);
        //this.FilterForm.controls["EndDate"].setValue(this.myDate);
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

    loadAllUsersNotificationsPage() {
        this.loadAllUsersNotifications();
    }


    createForm() {
        this.StartDate = new Date();
        this.FilterForm = this.filterFB.group({
            StartDate: [new Date(), [Validators.required]],
            EndDate: [new Date(), [Validators.required]]
        });
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.FilterForm.controls[controlName].hasError(errorName);
    }

    loadAllUsersNotifications() {

        //this.reportFilter.clear();
        //this.reportFilter.StartDate = "2021-01-01T14:22:17.960Z";
        //this.reportFilter.EndDate = "2021-01-27T14:22:17.960Z";
        this.reportFilter = Object.assign(this.reportFilter, this.FilterForm.value);

        debugger
        this._reportservice.getAllUsersNotifications(this.reportFilter)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                debugger;
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.Notifications;
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }

            });
    }


    comparisonEnddateValidator(): any {
        let ldStartDate = this.FilterForm.value['StartDate'];
        let ldEndDate = this.FilterForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.FilterForm.controls['EndDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = startnew;
        this.FilterForm.controls['StartDate'].reset();
        this.FilterForm.controls['StartDate'].patchValue(oldvalue);
        return this.FilterForm.controls['StartDate'].setErrors({'invaliddaterange': false});
    }

    comparisonStartdateValidator(): any {
        let ldStartDate = this.FilterForm.value['StartDate'];
        let ldEndDate = this.FilterForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.FilterForm.controls['StartDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = endnew;
        this.FilterForm.controls['EndDate'].reset();
        this.FilterForm.controls['EndDate'].patchValue(oldvalue);
        return this.FilterForm.controls['EndDate'].setErrors({'invaliddaterange': false});
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


    viewNotificationLocationDetails(Notification: object) {

        const dialogRef = this.dialog.open(NotificationDetailsComponent, {
            data: {Notification: Notification},
            disableClose: false,
            panelClass: ['full-screen-modal']
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.loadAllUsersNotificationsPage();
        });
    }

}
