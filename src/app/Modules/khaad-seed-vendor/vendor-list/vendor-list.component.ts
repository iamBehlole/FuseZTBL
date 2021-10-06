import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { KhaadSeedVendorService } from "../../../../core/auth/_services/khaad-seed-vendor.service";
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendorDetail } from '../../../../core/auth/_models/khaad-seed-vendor.model';
import { CircleService } from "../../../../core/auth/_services/circle.service";
import { Branch } from "../../../../core/auth/_models/branch.model";
import { Circle } from "../../../../core/auth/_models/circle.model";
import { Zone } from "../../../../core/auth/_models/zone.model";


@Component({
  selector: 'kt-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  displayedColumns = ['Name', 'bDescription', 'Address', 'Type', 'Phone','View', 'Edit', 'Delete'];
  constructor(
    private _khaadSeedVendor: KhaadSeedVendorService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private spinner: NgxSpinnerService
  ) { }

  itemsPerPage = 10;
  pageIndex = 1;
  offSet = 0;

  matTableLenght: boolean = false;
  loading: boolean;

  public vendor_obj = new VendorDetail();

  totalItems: number | any;
  dv: number | any; //use later

  vendor: any = {};

  //dataSource: MatTableDataSource<VendorList>
  dataSource = new MatTableDataSource()
  listForm : FormGroup

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Branch();

  selected_b;
  selected_z;
  selected_c;
  LoggedInUserInfo:BaseResponseModel;
  user : any = {};

  

  ngOnInit() {
    this.createForm();
    
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    this.initValues();

    this.searchVendor()

    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      this.selected_c = this.SelectedCircles.Id
      console.log(this.SelectedZones)
      this.listForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
      this.listForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
    }
  }

  initValues() {
    if (this.LoggedInUserInfo.Zone != undefined && this.LoggedInUserInfo.Branch != undefined) {
      this.user.ZoneId = this.LoggedInUserInfo.Zone.ZoneId;
      this.user.BranchCode = this.LoggedInUserInfo.Branch.BranchCode;
    }
  }

  createForm(){
    this.listForm = this.fb.group({
      ZoneId:[null],
      BranchCode:[null],
      CircleId:[null],
      VendorName:[null],
      PhoneNumber:[null]
    })
  }

  find(){
    this.searchVendor()
  }

  searchVendor() {
    var phone, name;

    if (this.listForm.controls.ZoneId.value != null && this.listForm.controls.BranchCode.value != null) {
      this.user.ZoneId = this.listForm.controls.ZoneId.value;
      this.user.CircleId = this.listForm.controls.CircleId.value;
      this.user.BranchCode = this.listForm.controls.BranchCode.value;
    }

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    name = this.listForm.controls.VendorName.value;
    phone = this.listForm.controls.PhoneNumber.value;
    
    debugger

    if (name != null || phone != null){
      this.offSet = 0;
      this.itemsPerPage = 10;
    }

    this.vendor_obj.Name = name;
    this.vendor_obj.PhoneNumber = phone;
    

    this.spinner.show();
    this._khaadSeedVendor.searchVendors(this.itemsPerPage, this.offSet, this.vendor_obj, this.user)
    .pipe(
      finalize(() => {
        this.loading = false;
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if (baseResponse.Success === true) {
        debugger
        this.dataSource.data = baseResponse.SeedKhadVendor.VendorDetails
        this.dv = this.dataSource;
        this.matTableLenght = true

        this.totalItems = baseResponse.SeedKhadVendor.VendorDetails[0].TotalRecords
      }
      else{
        this.matTableLenght = false;
        this.dataSource.data = null;
        this.offSet = 0;
        this.pageIndex = 1;
        this.layoutUtilsService.alertElement("", baseResponse.Message);        
      }
    })

  }
  paginate(pageIndex : any, pageSize: any = this.itemsPerPage){
    debugger
    this.itemsPerPage = pageSize;
      this.offSet = (pageIndex -1) * this.itemsPerPage;
    this.pageIndex = pageIndex;
    this.searchVendor();
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }
  
  editVendor(vendor: any){
    debugger;
    localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
    localStorage.setItem('EditVendorData', '1');
    this.router.navigate(['../add-vendor', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }

  viewVendor(vendor: any){
    debugger;
    vendor.obj= "v"
    localStorage.setItem('SearchVendorData', JSON.stringify(vendor));
    localStorage.setItem('EditVendorData', '1');
    this.router.navigate(['../add-vendor', { upFlag : "1"}], { relativeTo: this.activatedRoute });
  }

  deleteVendor(ind_vendor: any){
    this.vendor_obj.Id = ind_vendor.Id;

    this.user.ZoneId = ind_vendor.ZoneId
    this.user.BranchCode = ind_vendor.BranchCode
    this.user.CricleId = ind_vendor.CircleId

    debugger
    this.spinner.show();
    this._khaadSeedVendor.deleteVendor(this.vendor_obj, this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        window.location.reload();
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

}

interface VendorList{
  Name: string;
  Description: string;
  Address: string;
  Type: string;
  PhoneNumber: string;
}
