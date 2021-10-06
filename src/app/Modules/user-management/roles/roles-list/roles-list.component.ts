// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from '@angular/core';
// Material
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource} from '@angular/material';
// RXJS
import {finalize} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// Services
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
// Models
import {RoleDeleted} from '../../../../../core/auth';
import {AppState} from '../../../../../core/reducers';
import {BaseResponseModel} from '../../../../../core/_base/crud/models/_base.response.model';
import {QueryParamsModel} from '../../../../../core/_base/crud';
import {ActivityDataSource} from '../../../../../core/auth/_data-sources/activity.datasource';
import {BaseComponentPage} from '../../../base-component.component';
import {Activity} from '../../../../../core/auth/_models/activity.model';
import {ActivityService} from '../../../../../core/auth/_services/activity.service';
import {RoleEditDialogComponent} from '../role-edit/role-edit.dialog.component';
import {ProfileService} from '../../../../../core/auth/_services/profile.service';
import {Profile} from '../../../../../core/auth/_models/profile.model';
// import { ActivityFormDialogComponent } from '../activity-edit/activity-form.dialog.component';
//import { BaseComponentPage } from '../../../base-component.component';

@Component({
  selector: 'kt-roles-list',
  templateUrl: './roles-list.component.html',
  styles: []
})
export class RolesListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loading: boolean;
  displayedColumns = ['name', 'GroupName', 'Description', 'actions'];

  // Selection
  selection = new SelectionModel<Activity>(true, []);
  activitiesResult: Activity[] = [];
  baseActivities: Activity[] = [];
  activities: Activity[] = [];
  gridHeight: string;
  profiles: any[];
  public activity = new Activity();

  constructor(
    private store: Store<AppState>,
    private _profileService: ProfileService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private _cdf: ChangeDetectorRef,
    //private excelService: ExcelUtilsService,
    //private auditService: AuditTrailService,
    private _activityService: ActivityService) {
    //super("Activities");
  }

  ngOnInit() {

    this.loadActivityList();
    this.GetAllProfiles();

  }

  GetAllProfiles() {
    // this.spinner.show();
    this._profileService.getAllProfiles()
      .pipe(
        finalize(() => {
          this.loading = false;
          //   this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          //this.dataSource.data = baseResponse.Profiles;
          this.profiles = baseResponse.Profiles;
          this.dataSource.data = this.profiles;
          console.log(this.profiles);
          this._cdf.detectChanges();
        } else {
          this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        }
      });
  }


  loadActivityList() {
    this.loading = true;

    this.activity = new Activity();
    this._activityService.getActivitiesList()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
      debugger;
      if (baseResponse.Success) {
        this.activities = baseResponse.Activities;
        this.dataSource.data = baseResponse.Activities;


        this.activities.forEach((o, i) => {
          o.C = false;
          o.R = false;
          o.U = false;
          o.D = false;
        });

        this.getBaseActivity();
      } else {
        this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
      }

    });
  }

  getBaseActivity() {
    debugger;
    this._activityService.getActivitiesList().subscribe((response: BaseResponseModel) => {
      this.baseActivities = response.Activities;

      this.activities.forEach((o, i) => {

        this.baseActivities.forEach((oo, i) => {

          if (o.ActivityID == oo.ActivityID) {

            o.C = oo.C;
            o.D = oo.D;
            o.U = oo.U;
            o.R = oo.R;
            o.IsParent = oo.IsParent == '1' ? 1 : 0;
          }

        });
      });
      this._cdf.detectChanges();

    });
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


  loadActivitiesPage() {
    this.loadActivityList();
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

  deleteActivity(_item: Activity) {
    const _title = 'Activity';
    const _description = 'Are you sure to permanently delete this activity?';
    const _waitDesciption = 'Activity is deleting...';
    const _deleteMessage = `Activity has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.activity = new Activity();
      this.activity.ActivityID = _item.ActivityID;

      this._activityService.deleteActivity(this.activity).pipe(
        finalize(() => {

        })
      ).subscribe((x) => {
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadActivitiesPage();
        console.log('output');
        console.log(x);
      });

    });
  }

  addRole() {
    const newActivity = new Profile();
    // newActivity.clear(); // Set all defaults fields
    this.editRole(newActivity);
  }

  editRole(profile: Profile) {

    const _saveMessage = profile.ProfileID ? 'New activity successfully has been added.' : 'Activity successfully has been updated.';
    const _messageType = profile.ProfileID ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(RoleEditDialogComponent, {data: {profile: profile}, disableClose: true});
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

      this.loadActivitiesPage();
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.activitiesResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.activitiesResult.length) {
      this.selection.clear();
    } else {
      this.activitiesResult.forEach(row => this.selection.select(row));
    }
  }

}
