import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {KtDialogService} from '../../../core/_base/layout';
import {LandInfo} from '../../../core/auth/_models/land-info.model';
import {Zone} from '../../../core/auth/_models/zone.model';
import {LandService} from '../../../core/auth/_services/land.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {AppState} from '../../../core/reducers';
import {MatTableDataSource} from '@angular/material/table';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'kt-land-history',
  templateUrl: './land-history.component.html'
})
export class LandHistoryComponent implements OnInit {
  dataSource = new MatTableDataSource();
  loading: boolean;
  landHistoryList: any;
  LandHistory: any;
  loggedInUserDetails: any;
  Branches: any = [];
  Zones: any = [];
  public LandInfo = new LandInfo();
  public Zone = new Zone();
  displayedColumns = ['BranchCode', 'PassbookNO', 'Cnic', 'CustomerName', 'FatherName', 'IsRedeem', 'StatusDesc', 'View'];
  gridHeight: string;

  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private _landService: LandService,
    private userUtilsService: UserUtilsService,
    private _circleService: CircleService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {

    debugger;
    var u = new UserUtilsService();
    this.GetZones();
    var userDetails = u.getUserDetails();
    this.loggedInUserDetails = userDetails;
    //this.LandInfo = this.route.landInfo;
    this.LandInfo.Id = this.route.snapshot.params['lID'];
    this.GetLandHistoryData();
  }

  ngAfterViewInit() {
    this.gridHeight = window.innerHeight - 380 + 'px';
  }
  GetZones() {
    debugger;
    this.loading = true;
    this._circleService.getZones()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

          baseResponse.Zones.forEach(function (value) {
            value.ZoneName = value.ZoneName.split("-")[1];
          })
          this.Zones = baseResponse.Zones;
          //this.zoneLovAll = baseResponse.Zones;
        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

  }
  GetBranches(ZoneId:string) {
    this.loading = true;
    this.dataSource.data = [];
    this.Branches = [];
    debugger;
    this.Zone.ZoneId = parseInt(ZoneId);
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
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });



  }
  GetLandHistoryData() {
    debugger;
    this.loading = true;
    this._landService.GetLandHistory(this.LandInfo)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

          debugger;
          this.dataSource.data = baseResponse.searchLandData;
          //if (this.landHistoryList != undefined) {
          //  this.LandHistory = this.landHistoryList;
          //}
          //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {
          //this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        }
      });

  }

  editland(Land: any) {
    debugger;
    this.loading = true;
    this.Branches = [];
    this.Zone.ZoneId = parseInt(Land.ZoneID);
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
          Land.Branch = this.Branches.filter(x => x.BranchId == Land.BranchId);
          Land.Zone = this.Zones.filter(x => x.ZoneId == Land.ZoneID);
          localStorage.setItem('SearchLandData', JSON.stringify(Land));
          localStorage.setItem('EditLandData', '1');
          localStorage.setItem('HistoryLandInfoId', Land.ID);
          this.router.navigate(['/land-creation/land-info-add', { upFlag: "1" }], { relativeTo: this.activatedRoute });
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
    //let url = "/land-creation/land-info-add/" + 
    //this.router.navigateByUrl(url);
  }

}
