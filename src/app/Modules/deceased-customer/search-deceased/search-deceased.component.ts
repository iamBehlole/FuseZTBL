import { MatTableDataSource,MatSort ,MatPaginator} from '@angular/material';
import { Component, OnInit, ViewChild,ChangeDetectorRef,ElementRef ,Input} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import { DeceasedCustomerService } from "../../../../core/auth/_services/deceased-customer.service";
import { LovService } from '../../../../core/auth/_services/lov.service';
import { MaskEnum, errorMessages, regExps, LovConfigurationKey, Lov } from '../../../../core/auth/_models/lov.class';
import { Zone } from '../../../../core/auth/_models/zone.model';
import { Branch } from '../../../../core/auth/_models/branch.model';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { CircleService } from '../../../../core/auth/_services/circle.service';
import { Customer } from '../../../../core/auth/_models/deceased-customer.model';
import { ReportFilters } from '../../../../core/auth/_models/report-filters.model';
import {delay} from 'rxjs/operators'

@Component({
  selector: 'kt-search-deceased',
  templateUrl: './search-deceased.component.html',
  styleUrls: ['./search-deceased.component.scss']
})
export class SearchDeceasedComponent implements OnInit {

  // public Customer = new Customer();

  @Input() isDialog: any = false;
  reportFilter: ReportFilters = new ReportFilters();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public _apiNameWidth = "350px";
  public _dateWidth = "200px";
  public _IdWidth = "100px";
  gridHeight: string;

  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  // public LandStatusLov: any;
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
  OffSet: number;
  public Customer = new Customer();
  ShowViewMore: boolean;
  deceasedCustomerSearch: FormGroup;
  loading: boolean;
  matTableLenght: any;
  //displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir'];
  displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address','branch_code', 'certificate_verified', 'legal_heir'];

  // dataSource : MatTableDataSource<DeceasedCustomer>

  dataSource = new MatTableDataSource();

  constructor(
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private _deceasedCustomer: DeceasedCustomerService,    
    private _lovService: LovService,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private filterFB: FormBuilder,
  ) { }

  ngOnInit() {
    debugger
    //this.SearchDeceasedCustomer();
    if (this.isDialog)
    //this.displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir']
    this.displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'branch_code', 'certificate_verified', 'legal_heir']

    this.matTableLenght = false;  
    
    this.ShowViewMore = false;

    this.LoadLovs();
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

      this.deceasedCustomerSearch.value.ZoneId = userDetails.Zone.ZoneId;
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

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
  }

  SearchDeceasedCustomer(){
    debugger
    this.spinner.show()
    this.Customer = Object.assign(this.Customer, this.deceasedCustomerSearch.value);
    
    this._deceasedCustomer
    .SearchDeceasedCustomer(this.Customer, this.isUserAdmin, this.isZoneUser)
    // .SearchDeceasedCustomer()
    .pipe(finalize(() => { 
      this.spinner.hide();
    }))
    .subscribe((baseResponse) => {
      if (baseResponse.Success) {
        debugger
        this.dataSource.data = baseResponse.DeceasedCustomer.DeceasedCustomerInfoList;
        console.log(this.dataSource.data)

      } else {
        debugger;
        this.layoutUtilsService.alertElement(
          "",
          baseResponse.Message,
        );
      }
    });
  }

  
  //pagination
  itemsPerPage = 10; //you could use your specified
  totalItems: number | any;
  pageIndex = 1;
  dv: number | any; //use later

  SearchLandData() {
    debugger;
    this.spinner.show();
    // this.CustomerLandRelation.Offset = this.OffSet.toString();
    // this.CustomerLandRelation.Limit = this.itemsPerPage.toString();
    //this.landSearch.controls["ZoneId"].setValue(this.Zone.ZoneId);
    //this.landSearch.controls["BranchId"].setValue(this.Branch.BranchCode);

    this.Customer = Object.assign(this.Customer, this.deceasedCustomerSearch.value);

    this._deceasedCustomer.SearchDeceasedCustomer(this.Customer, this.isUserAdmin, this.isZoneUser)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
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
          this.layoutUtilsService.alertElement("", baseResponse.Message);
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


  createForm() {
    debugger;
    this.deceasedCustomerSearch = this.filterFB.group({
      CustomerName: [this.Customer.CustomerName],
      FatherName: [this.Customer.FatherName],
      // Cnic: [this.Customer.Cnic, [Validators.pattern(regExps.cnic)]],
      Cnic: [this.Customer.Cnic,Validators.pattern("^[0-9]{5}[0-9]{7}[0-9]$")],
      // Validators.pattern("^[0-9]*$"),
      CustomerStatus: [this.Customer.CustomerStatus],
      ZoneId: [this.Zone.ZoneId],
      BranchId: [this.Branch.BranchCode]
    });

   
  } 

  // hasError(controlName: string, errorName: string): boolean {
  //   return this.deceasedCustomerSearch.controls[controlName].hasError(errorName);
  // } 

  async LoadLovs() {
  
    //this.ngxService.start();
  
    this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.DeceasedCustomerStatus })
    debugger;
    this.CustomerStatusLov = this.CustomerStatusLov.LOVs;
    console.log(this.CustomerStatusLov);
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })
  
    // this.ngxService.stop();
  
  } 
}



export interface DeceasedCustomer{
  CustomerName: string;
  FatherName: string;
  DeathDate: string;
  Cnic: string;
  Address: string;
  PermanentAddress: string;
  Status : string;
  BranchCode: string;
  IsCertificateVerified: string;
  LegalHeairHasIncome: string
}
