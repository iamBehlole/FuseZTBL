// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {errorMessages, Lov, LovConfigurationKey, MaskEnum} from 'app/core/auth/_models/lov.class';
import { CreateCustomer } from 'app/core/auth/_models/customer.model';
import { LoanUtilizationSearch } from 'app/core/auth/_models/loan-utilization.model';
import { Zone } from 'app/core/auth/_models/zone.model';
import {AppState} from '../../../core/reducers';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {LoanUtilizationService} from '../../../core/auth/_services/loan-utilization.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {LovService} from '../../../core/auth/_services/lov.service';
import { UserUtilsService } from 'app/core/_base/crud/utils/user-utils.service';
import { Branch } from 'app/core/auth/_models/branch.model';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
// Services


@Component({
  selector: 'kt-search-utilization',
  templateUrl: './search-utilization.component.html'
})
export class SearchUtilizationComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @Input() isDialog: any = false;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];
 
  displayedColumns = ["LoanCaseNo",
  // "GlCode",
  "Status",
  "Remarks",
  "Lng",
  "Lat",
  "Actions",]
  userInfo;
  gridHeight: string;
  loanutilizationSearch: FormGroup;
  myDate = new Date().toLocaleDateString();
  isMCO:boolean=false;
  isBM:boolean=false;
  circle;
  circleNo;
  loggedInUser: any;
  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();
  _loanUtilizationSearch = new LoanUtilizationSearch; 
  public Zone = new Zone();
  public Branch = new Branch();
  Zones: any = [];
  SelectedZones: any = [];
  Branches: any = [];
  SelectedBranches: any = [];
  isUserAdmin: boolean = false;
  isZoneUser: boolean = false;
  loggedInUserDetails: any;
  loanutilizationStatusLov;

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _loanutilizationService: LoanUtilizationService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private userUtilsService: UserUtilsService  ) { this.loggedInUser = userUtilsService.getUserDetails(); }

  ngOnInit() {

    this.setUsers()
    if (this.isDialog)
      this.displayedColumns = ["LoanCaseNo",
      // "GlCode",
      "Status",
      "Remarks",
      "Lng",
      "Lat",
      "Actions",]
    //else
    //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

    this.LoadLovs();
    this.createForm();
    this.setCircles();
    var userDetails = this.userUtilsService.getUserDetails();
    this.loggedInUserDetails = userDetails;
    debugger;
    //if (userDetails.Branch.BranchCode == "All")
    // if (userDetails.User.AccessToData == "1") {
    //   //admin user
    //   this.isUserAdmin = true;
    //   this.GetZones();
    // }
    // else if (userDetails.User.AccessToData == "2") {
    //   //zone user
    //   this.isZoneUser = true;
    //   this.loanutilizationSearch.value.ZoneId = userDetails.Zone.ZoneId;
    //   this.Zone = userDetails.Zone;
    //   this.GetBranches(userDetails.Zone.ZoneId);
    // }
    // else {
    //   //branch
    //   this.Zone = userDetails.Zone;
    //   this.Branch = userDetails.Branch;
    // }
    debugger;
    //this.FilterForm.controls["StartDate"].setValue(this.myDate);
    //this.FilterForm.controls["EndDate"].setValue(this.myDate);
  }

  setUsers(){
    var userInfo = this.userUtilsService.getUserDetails();
    this.userInfo  = this.userUtilsService.getUserDetails();
    // console.log(userInfo);
    //MCO User
    if(userInfo.User.userGroup[0].ProfileID=="56"){
      this.isMCO=true;
    }

    if(userInfo.User.userGroup[0].ProfileID=="57"){
      this.isBM=true;
    }
    
    if (this.isUserAdmin || this.isZoneUser) {
      userInfo.Branch = {};
      if (this.Branch.BranchCode != undefined)
        userInfo.Branch.BranchId = this.Branch.BranchCode;
      else
        userInfo.Branch.BranchId = 0;
    }
    if (this.isUserAdmin) {
      userInfo.Zone = {};
      if (this.Zone.ZoneId != undefined)
        userInfo.Zone.ZoneId = this.Zone.ZoneId
      else
        userInfo.Zone.ZoneId = 0;
    }
    //BM User
    // if(userInfo.User.userGroup[0].ProfileID=="56"){
    //   this.isMCO=true;
    // }else{
    //   this.isMCO=false;
    // }

  }
  setCircles(){
    debugger;
    this._circleService.GetCircleByBranchId()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        console.log(baseResponse);
        if (baseResponse.Success) {
          this.circle = baseResponse.Circles;
    debugger
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
    debugger;
    //var userInfo = this.userUtilsService.getUserDetails();
    //this.loanutilizationSearch.controls['Zone'].setValue(userInfo.Zone.ZoneName);
    //this.loanutilizationSearch.controls['Branch'].setValue(userInfo.Branch.Name);
  }

  // CheckEditStatus(loanUtilization: any) {
  //   debugger
    
  //   if () {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  CheckEditStatus(loanUtilization: any) {
    this.loggedInUserDetails.User.UserId
    if(this.isMCO){
      if (loanUtilization.Status == "P" || loanUtilization.Status == "R") {
        if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
          return true
        }
        else {
          return false
        }
      }else{
        return false;
      }
    }
    else if(this.isBM){
      if (loanUtilization.Status == "S") {
           return true
      }
    }else{
      return false
    }
  }

  CheckViewStatus(loanUtilization: any) {
    if(this.isMCO){
      if (loanUtilization.Status == "C" || loanUtilization.Status == "S" || loanUtilization.Status == "A") {
        if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
          return true
        }
        else {
          return false
        }
      }else{
        return false;
      }
    }
    else if(this.isBM){
      if (loanUtilization.Status == "C" || loanUtilization.Status == "P" || loanUtilization.Status == "R" || loanUtilization.Status == "A") {
           return true
      }
    }else{
      return false
    }

  }

  


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  createForm() {
    var userInfo = this.userUtilsService.getUserDetails();
    this.loanutilizationSearch = this.filterFB.group({
      Zone: [userInfo.Zone.ZoneName],
      Branch: [userInfo.Branch.Name],
      LoanCaseNo: [""],
      Status: ["",Validators.required],
      CircleId:[]
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
          this.layoutUtilsService.alertElement("", baseResponse.Message);

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
          this.layoutUtilsService.alertElement("", baseResponse.Message);
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


  hasError(controlName: string, errorName: string): boolean {
    return this.loanutilizationSearch.controls[controlName].hasError(errorName);
  }

  searchloanutilization() {
    debugger;
    
    this.spinner.show();
    // this._customer.clear();
    // console.log(this.loanutilizationSearch.controls["Status"].value);
    if(!this.loanutilizationSearch.controls["Status"].value){
      this.loanutilizationSearch.controls["Status"].setValue("All")
    }
    this._loanUtilizationSearch = Object.assign(this.loanutilizationSearch.value);
    this._loanutilizationService.searchUtilization(this._loanUtilizationSearch, this.userInfo)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        
        debugger;
        console.log(baseResponse);
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.LoanUtilization["Utilizations"];
          console.log(this.dataSource.data)
debugger
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.dataSource.data = []
        }
      });
  }


  getStatus(status:string) {

    if (status == 'P') {
      return "Submit";
    }
    else if (status == 'N') {
      return "Pending";
    }
    else if (status == 'A') {
      return "Authorized";
    }
    else if (status == 'R') {
      return "Refer Back";
    }
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
  }

  masterToggle() {

  }

  
  editloanutilization(utilization: any){
    console.log(utilization);
    // this.router.navigate(['other']);
    // console.log(this.loanutilizationSearch.controls["Status"].value)
    // utilization = {Status:this.loanutilizationSearch.controls["Status"].value}
    this.router.navigate(['../loan-uti'], {
      state: { example: utilization},
      relativeTo: this.activatedRoute
    });
  }


  viewloanutilization(utilization: any){
    // this.router.navigate(['other']);
    console.log(utilization);
    utilization.view = "1";
    // console.log(this.loanutilizationSearch.controls["Status"].value)
    // utilization = {Status:this.loanutilizationSearch.controls["Status"].value}
    this.router.navigate(['../loan-uti'], {
      state: { example: utilization},
      relativeTo: this.activatedRoute
    });
  }

  async LoadLovs() {

    //this.ngxService.start();

    this.loanutilizationStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.UtilizationTypes })
    // console.log(this.CustomerStatusLov.LOVs);
    this.loanutilizationStatusLov.LOVs.forEach(function (value) {
      if (!value.Value)
        value.Value = "All";
    });

    debugger;
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

    // this.ngxService.stop();

  }

}
