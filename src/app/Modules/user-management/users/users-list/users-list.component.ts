// Material
import { SelectionModel } from '@angular/cdk/collections';
// Angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
// RXJS
import { finalize } from 'rxjs/operators';
// Models
import { User, UserDeleted } from '../../../../../core/auth';
//import { ExportUserModel } from '../../../../../core/auth/_models/export.user';
//import { UserType } from '../../../../../core/auth/_models/user-type.model';
//import { UserService } from '../../../../../core/auth/_services/user.service';
import { AppState } from '../../../../../core/reducers';
// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import { UserService } from '../../../../../core/auth/_services/user.service';
//import { DefaultDatatableColumnModel } from '../../../../../core/_base/crud/models/_table-column.model';
//import { ExcelUtilsService } from '../../../../../core/_base/crud/utils/excel-utils.service';
//import { AE } from '../../../../../core/_base/enums/audit.enum';
//import { PagesEnum } from '../../../../../core/_base/enums/pages.enum';
import { BaseComponentPage } from '../../../base-component.component';
import { GeofencingEditComponent } from '../geofencing-edit/geofencing-edit.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserUtilsService } from '../../../../../core/_base/crud/utils/user-utils.service';
import { Activity } from '../../../../../core/auth/_models/activity.model';
import {CreateUserComponent} from '../create-user/create-user.component';


@Component({
  selector: 'kt-users-list',
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [

  ]
})
export class UsersListComponent extends BaseComponentPage implements OnInit {

  dataSource = new MatTableDataSource();
  //dataSource: UsersDataSource;
  displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName','UserCircles', 'actions'];
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  //@ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<User>(true, []);
  usersResult: User[] = [];
  // userTypes: UserType[] = [];
  userTypeId: number;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  //tempExportUsers: ExportUserModel[] = [];
  // exportUsers: ExportUserModel[] = [];
  gridHeight: string;
  _currentActivity: Activity = new Activity();

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private _userService: UserService,
    // private excelService: ExcelUtilsService,
    // private authService: AuthorizationService,
    // private auditService: AuditTrailService,

    private cdr: ChangeDetectorRef) {
    super();
  }


  ngOnInit() {
    debugger;
    var userUtilsService = new UserUtilsService();
    this._currentActivity = userUtilsService.getActivity('Users');
    if (this._currentActivity.U == false) {
      var len = this.displayedColumns.length-1;
      this.displayedColumns.splice(len, 1);
    }

    console.log(this._currentActivity);
    this.loadUsersList();
  }





  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToExcel() {
    //this.exportUsers = [];
    //Object.assign(this.tempExportUsers, this.dataSource.data);
    //this.tempExportUsers.forEach((o, i) => {
    //  this.exportUsers.push({
    //    userName: o.userName,
    //    userCode: o.userCode,
    //    emailAddress: o.emailAddress,
    //    mobileNo: o.mobileNo,
    //    regionName: o.regionName,
    //    profileName: o.profileName
    //  });
    //});
    //this.excelService.exportAsExcelFile(this.exportUsers, 'users');

    //this.auditService.create(PagesEnum.usersUrl, 'Export Users', AE.Export, true);
  }

  rowClicked(row: any): void {
    console.log(row);
  }

  loadUsersList() {
    this.loading = true;
    debugger;
    this._userService.getAllUsers()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success)
          this.dataSource.data = baseResponse.Users;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }






  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 230 + 'px';
  }




  editUser(user: User) {
    const dialogRef = this.dialog.open(UserEditComponent, { data: { user: user }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      debugger;
      if (!res) {
        return;
      }

      this.loadUsersList();
    });
  }
  createUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      debugger;
      if (!res) {
        return;
      }

      this.loadUsersList();
    });
  }
}
