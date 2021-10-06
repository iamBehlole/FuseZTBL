// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
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
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { CircleService } from '../../../../core/auth/_services/circle.service';
import { Zone } from '../../../../core/auth/_models/zone.model';
import { Branch } from '../../../../core/auth/_models/branch.model';
// Services


@Component({
  selector: 'kt-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @Input() isDialog: any = false;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob','CustomerStatus', 'View'];
 
  displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

  gridHeight: string;
  customerSearch: FormGroup;
  myDate = new Date().toLocaleDateString();


  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
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
    private _customerService: CustomerService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private userUtilsService: UserUtilsService  ) { }

  ngOnInit() {


    if (this.isDialog)
      this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus']
    //else
    //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

    this.LoadLovs();

    this.createForm();

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

      this.customerSearch.value.ZoneId = userDetails.Zone.ZoneId;
      this.Zone = userDetails.Zone;
      this.GetBranches(userDetails.Zone.ZoneId);
    }
    else {
      //branch
      this.Zone = userDetails.Zone;
      this.Branch = userDetails.Branch;
    }
    debugger;
    //this.FilterForm.controls["StartDate"].setValue(this.myDate);
    //this.FilterForm.controls["EndDate"].setValue(this.myDate);
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
    debugger;
    //var userInfo = this.userUtilsService.getUserDetails();
    //this.customerSearch.controls['Zone'].setValue(userInfo.Zone.ZoneName);
    //this.customerSearch.controls['Branch'].setValue(userInfo.Branch.Name);
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  createForm() {
    var userInfo = this.userUtilsService.getUserDetails();
    this.customerSearch = this.filterFB.group({
      Zone: [userInfo.Zone.ZoneName],
      Branch: [userInfo.Branch.Name],
      CustomerName: [this._customer.CustomerName, [Validators.required]],
      Cnic: [this._customer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
      FatherName: [this._customer.FatherName, [Validators.required]],
      CustomerStatus: [this._customer.CustomerStatus, [Validators.required]]
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
    return this.customerSearch.controls[controlName].hasError(errorName);
  }

  searchCustomer() {
    debugger;
    this._customer.clear();

    this._customer = Object.assign(this._customer, this.customerSearch.value);

    const controlsCust = this.customerSearch.controls;

    if ((this._customer.CustomerName == null || this._customer.CustomerName == "") && (this._customer.Cnic == null || this._customer.Cnic == "") && (this._customer.FatherName == null || this._customer.FatherName == "") && (this._customer.CustomerStatus == null || this._customer.CustomerStatus == "")) {

      Object.keys(controlsCust).forEach(controlName =>
        controlsCust[controlName].markAsTouched()
      );

      return;

    }
    else {
      Object.keys(controlsCust).forEach(controlName =>
        controlsCust[controlName].markAsUntouched()
      );
    }
    if (this._customer.CustomerStatus == "All")
      this._customer.CustomerStatus = "";
    //adding branch zone in request
    var userInfo = this.userUtilsService.getUserDetails();
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

    this._customerService.searchCustomer(this._customer, userInfo)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.Customers;
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

  editCustomer(Customer: any) {

    debugger;
    localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));


    localStorage.setItem('CreateCustomerBit', '2');






    // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
    this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });

  }

  async LoadLovs() {

    //this.ngxService.start();

    this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus })
    console.log(this.CustomerStatusLov.LOVs);
    this.CustomerStatusLov.LOVs.forEach(function (value) {
      if (!value.Value)
        value.Value = "All";
    });
    debugger;
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

    // this.ngxService.stop();

  }

}
