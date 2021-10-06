// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../../../core/reducers';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { CustomerService } from '../../../../core/auth/_services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaskEnum, errorMessages, regExps, LovConfigurationKey, Lov } from '../../../../core/auth/_models/lov.class';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { CustomerLandRelation } from '../../../../core/auth/_models/customer-land-relation.model';
import { LandService } from '../../../../core/auth/_services/land.service';
import { CircleService } from '../../../../core/auth/_services/circle.service';
import { Zone } from '../../../../core/auth/_models/zone.model';
import { Branch } from '../../../../core/auth/_models/branch.model';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { forEach } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'kt-cust-land-list',
  templateUrl: './cust-land-list.component.html'
})
export class CustLandListComponent implements OnInit {
  Math: any;
  dataSource = new MatTableDataSource();
  matTableLenght: any;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  displayedColumns = ['BranchCode', 'PassbookNO', 'Cnic', 'CustomerName', 'FatherName', 'IsRedeem', 'StatusDesc', 'View'];

  gridHeight: string;

  OffSet: number;
  ShowViewMore: boolean;
  landSearch: FormGroup;
  myDate = new Date().toLocaleDateString();

  public CustomerLandRelation = new CustomerLandRelation();


  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public LandStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();
  public Zone = new Zone();
  public Branch = new Branch();
  Zones: any = [];
  SelectedZones: any = [];
  Branches: any = [];
  SelectedBranches: any = [];
  isUserAdmin: boolean = false;
  isZoneUser: boolean = false;
  loggedInUserDetails: any;

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private router: Router,
    private _landService: LandService,
    private _customerService: CustomerService,
    private _lovService: LovService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private spinner: NgxSpinnerService,
    private _cdf: ChangeDetectorRef,
    private userUtilsService: UserUtilsService
  ) { this.Math = Math;}


  ngOnInit() {

    this.matTableLenght = false;  
    this.LoadLovs();
    this.ShowViewMore = false;
    this.createForm();
    //var u = new UserUtilsService();
    var userDetails = this.userUtilsService.getUserDetails();
    this.loggedInUserDetails = userDetails;
    debugger;
    //if (userDetails.Branch.BranchCode == "All")
    if (userDetails.User.AccessToData == "1") {
      //admin user
      this.isUserAdmin = true;
      this.GetZones();
    }
    else if (userDetails.User.AccessToData == "2") {
      //zone user
      this.isZoneUser = true;

      this.landSearch.value.ZoneId = userDetails.Zone.ZoneId;
      this.Zone.ZoneName = userDetails.Zone.ZoneName;
      this.GetBranches(userDetails.Zone.ZoneId);
    }
    else {
      //branch
      this.Zone.ZoneName = userDetails.Zone.ZoneName;
      this.Branch.Name = userDetails.Branch.Name;
    }

    debugger;
    //this.FilterForm.controls["StartDate"].setValue(this.myDate);
    //this.FilterForm.controls["EndDate"].setValue(this.myDate);


  }


  createForm() {
    debugger;
    this.landSearch = this.filterFB.group({
      PassbookNO: [this.CustomerLandRelation.PassbookNO],
      Cnic: [this.CustomerLandRelation.Cnic, [Validators.pattern(regExps.cnic)]],
      Status: [this.CustomerLandRelation.Status],
      ZoneId: [this.Zone.ZoneId],
      BranchId: [this.Branch.BranchCode]
    });
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
          this.SelectedZones = baseResponse.Zones;

          //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
          //this.GetBranches(this.Zones[0].ZoneId);
          this.loading = false;
          this._cdf.detectChanges();
        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });

  }

  SetBranches(branchId) {
    debugger;
    this.Branch.BranchCode = branchId.value;

  }


  GetBranches(ZoneId) {
    this.loading = true;
    this.dataSource.data = [];
    this.Branches = [];
    debugger;
    if (ZoneId.value === undefined)
      this.Zone.ZoneId = ZoneId;
    else
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

          //baseResponse.Branches.forEach(function (value) {
          //  value.Name = value.Name.split("-")[1];
          //})

          this.Branches = baseResponse.Branches;
          this.SelectedBranches = baseResponse.Branches;
          //this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
          this._cdf.detectChanges();
        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });



  }


  searchBranch(branchId) {
    branchId = branchId.toLowerCase();
    if (branchId != null && branchId != undefined && branchId != "")
      this.SelectedBranches = this.Branches.filter(x => x.Name.toLowerCase().indexOf(branchId) > -1);
    else
      this.SelectedBranches = this.Branches;
  }
  validateBranchOnFocusOut() {
    if (this.SelectedBranches.length == 0)
      this.SelectedBranches = this.Branches;
  }




  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 380 + 'px';
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.landSearch.controls[controlName].hasError(errorName);
  }

  searchLand() {

    this.OffSet = 0;
    this.pageIndex = 0;
    this.dataSource.data = [];
    this.SearchLandData();

  }

  searchZone(zoneId) {
    debugger;
    zoneId = zoneId.toLowerCase();
    if (zoneId != null && zoneId != undefined && zoneId != "")
      this.SelectedZones = this.Zones.filter(x => x.ZoneName.toLowerCase().indexOf(zoneId) > -1);
    else
      this.SelectedZones = this.Zones;
  }

  validateZoneOnFocusOut() {
    if (this.SelectedZones.length == 0)
      this.SelectedZones = this.Zones;
  }


  viewMore() {

    this.OffSet = this.OffSet + 1;
    this.SearchLandData();
  }

  //pagination
  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  SearchLandData() {
    debugger;
    this.spinner.show();
    this.CustomerLandRelation.Offset = this.OffSet.toString();
    this.CustomerLandRelation.Limit = this.itemsPerPage.toString();
    //this.landSearch.controls["ZoneId"].setValue(this.Zone.ZoneId);
    //this.landSearch.controls["BranchId"].setValue(this.Branch.BranchCode);

    this.CustomerLandRelation = Object.assign(this.CustomerLandRelation, this.landSearch.value);

    this._landService.searchLand(this.CustomerLandRelation, this.isUserAdmin, this.isZoneUser)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          console.log(baseResponse)
          this.loading = false;
          debugger;
          this.dataSource.data = baseResponse.searchLandData;

          if (this.dataSource.data.length > 0)
            this.matTableLenght = true;
          else
            this.matTableLenght = false;
          //if (this.dataSource.data.length == 0) {
          //  this.dataSource.data = baseResponse.searchLandData;
          //  this.ShowViewMore = true;
          //}
          //else {
          //  for (var i = 0; i < baseResponse.searchLandData.length; i++) {

          //    this.dataSource.data.push(baseResponse.searchLandData[i]);
          //  }
          //  this.dataSource._updateChangeSubscription();
          //}
          //pagination
          this.dv = this.dataSource.data;
          //this.dataSource = new MatTableDataSource(data);
          debugger;
          this.totalItems = baseResponse.searchLandData[0].TotalCount;
          //this.paginate(this.pageIndex) //calling paginate function
          this.OffSet = this.pageIndex;
          this.dataSource = this.dv.slice(0, this.itemsPerPage);
        }
        else {

          this.matTableLenght = false;

          this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
          //this.dataSource.data = [];
          //this._cdf.detectChanges();
          this.OffSet = 1;
          this.pageIndex = 1;
          this.dv = this.dv.slice(1,0);
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }
          
        this.loading = false;
      });
  }


  paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    this.itemsPerPage = pageSize;
    this.pageIndex = pageIndex;
    this.OffSet = pageIndex;
    this.SearchLandData();
    //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
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


  CheckEidtStatusOld(Status: any) {

    if (Status == "1" || Status == "4") {
      return true
    }
    else {
      return false
    }

  }

  CheckViewStatusOld(Status: any) {


    if (Status != "1" && Status != "4") {
      return true
    }
    else {
      return false
    }

  }


  CheckEidtStatus(land: any) {

  
    if (land.Status == "1" || land.Status == "4") {
      if (land.EnteredBy == this.loggedInUserDetails.User.UserId) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }

  }

  CheckViewStatus(land: any) {

   
    if (land.Status != "1" && land.Status != "4") {
      return true
    }
    else {
      if (land.EnteredBy == this.loggedInUserDetails.User.UserId) {
        return false
      }
      else {
        return true
      }
    }

  }



  ngOnDestroy() {
  }



  masterToggle() {

  }

  editland(Land: any) {
    debugger;
    //if (this.isUserAdmin) {
    //  console.log(this.CustomerLandRelation.ZoneId)
    //  console.log(this.CustomerLandRelation.BranchId)
    //}

    Land.Branch = this.Branches.filter(x => x.BranchId == Land.BranchId);
    Land.Zone = this.Zones.filter(x => x.ZoneId == Land.ZoneID);
    localStorage.setItem('SearchLandData', JSON.stringify(Land));
    localStorage.setItem('EditLandData', '1');
    this.router.navigate(['../land-info-add', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }


  async LoadLovs() {

    //this.ngxService.start();

    this.LandStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LandStatus })


    debugger;
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

    // this.ngxService.stop();

  }

}
