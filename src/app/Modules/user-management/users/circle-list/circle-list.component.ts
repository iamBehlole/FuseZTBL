
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
// Material
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
// Services
import { GeofencingEditComponent } from '../geofencing-edit/geofencing-edit.component';
import { Router, ActivatedRoute } from '@angular/router';
import {LayoutUtilsService} from '../../../../core/_base/crud';
import {Branch} from '../../../../core/auth/_models/branch.model';
import {Zone} from '../../../../core/auth/_models/zone.model';
import {UserUtilsService} from '../../../../core/_base/crud/utils/user-utils.service';
import {Activity} from '../../../../core/auth/_models/activity.model';
import {DataService} from '../../../../core/auth/_models/data-service.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Circle } from 'app/core/auth/_models/circle.model';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CircleService} from '../../../../core/auth/_services/circle.service';

@Component({
  selector: 'kt-circle-list',
  templateUrl: './circle-list.component.html'
})
export class CircleListComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  loadingdata: boolean;
  BMUser: boolean;
  displayedColumns = ['circleId', 'circleCode', 'actions'];



  gridHeight: string;
  branchCode: string;
  fieldsHide: boolean;
  public Circle = new Circle();
  _currentActivity: Activity = new Activity();
  public Zone = new Zone();
  public Branch = new Branch();


  Zones: any = [];
  Branches: any = [];




  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public DataService: DataService,
    private _cdf: ChangeDetectorRef
    //private excelService: ExcelUtilsService,
    //private auditService: AuditTrailService,
  ) {
    //super("Activities");
  }

  ngOnInit() {
    debugger;
    this.BMUser = false;

    this.fieldsHide = false;
    this.GetZones();
    var u = new UserUtilsService();
    this._currentActivity = u.getActivity('Create Fense');

    var userDetails = u.getUserDetails();

    this.branchCode = userDetails.Branch.BranchCode;

    if (this.branchCode == "All") {
      this.fieldsHide = true;
    }
    else {
      this.GetCircles(this.branchCode);
    }

  }

  GetZones() {

    this.loading = true;
    this._circleService.getZones()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.Zones = baseResponse.Zones;
          this.loading = false;
          this._cdf.detectChanges();
        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
    
  }



  GetBranches(ZoneId) {
    this.loading = true;
    this.dataSource.data = [];
    this.Branches = [];
    debugger;
    this.Zone.ZoneId = ZoneId.value;
    this._circleService.getBranchesByZone(this.Zone)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.loading = false;
          this.Branches = baseResponse.Branches;
          this._cdf.detectChanges();
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

 

  }



  GetCircles(branchCode) {
    debugger;
    this.loadingdata = true;
    this.dataSource.data = [];
    if (branchCode.value) {
      this.Branch.BranchCode = branchCode.value;
    } else {
      this.Branch.BranchCode = branchCode;
    }
    this._circleService.getCircles(this.Branch)
      .pipe(
        finalize(() => {
          this.loadingdata = false;
        })
      ).subscribe(baseResponse => {
        if (baseResponse.Success)
          this.dataSource.data = baseResponse.Circles;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

    //this._cdf.detectChanges();
  }

  /*
    loadCirclesList() {
      this.loading = true;
  
      this._circleService.getAllCircles()
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        ).subscribe(baseResponse => {
          debugger;
          if (baseResponse.Success)
            this.dataSource.data = baseResponse.Circles;
          else
            this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
  
        });
    }*/

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


  loadCirclesPage() {
    this.GetCircles(this.Branch.BranchCode)
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
    //this.DataService.Branch = this.Branch;
    //this.DataService.Zone = this.Zone;
  }


  editGeofencing(circle: Circle) {


    let dialogRef = this.dialog.open(GeofencingEditComponent, { data: { circle: circle, zone: this.Zone, branch: this.Branch }, disableClose: true, panelClass: ['full-screen-modal'] });
    dialogRef.afterClosed().subscribe(res => {
      dialogRef = null;
      //if (!res) {

      //  return;
      //}

      this.loadCirclesPage();
    });
  }

}
