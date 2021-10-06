import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { CircleService } from './../../../../core/auth/_services/circle.service';
import { finalize } from 'rxjs/operators';
import { LayoutUtilsService } from './../../../../core/_base/crud';
import { Circle } from './../../../../../app/core/auth/_models/circle.model';
import { KhaadSeedVendorService } from "../../../../core/auth/_services/khaad-seed-vendor.service";
import { VendorDetail } from '../../../../core/auth/_models/khaad-seed-vendor.model';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Lov, LovConfigurationKey} from '../../../../core/auth/_models/lov.class';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Branch } from "../../../../core/auth/_models/branch.model";
import { Zone } from "../../../../core/auth/_models/zone.model";
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
//declare const google: any;

@Component({
  selector: 'kt-vendor-radius',
  templateUrl: './vendor-radius.component.html',
  styleUrls: ['./vendor-radius.component.scss']
})
export class VendorRadiusComponent implements OnInit {

  loading: boolean;
  getRadius: any;
  radiusInfo: any;
  ///////////////////
  lat = 30.375321;
  lng = 69.345116;
  zoom: number = 2;
  selectedArea = 0;
  fenceMarkers: any = [];
  vendorLocationMarker : any;
  //fenceLoacations: any;
  googleMap: any;
  selectedMarker: any = null;
  previousInfoWindow: any;
  vendorLov : any;

  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }
  ///////////////////

  
  radiusInitial : string;
  typeInitial : string;
  showViewAllBtn: boolean;
  Radius: any;
  public LovCall = new Lov();
  public vendor = new VendorDetail();

  radiusForm : FormGroup;

  selected_b;
  selected_z;

  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  user: any = {}
  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  LoggedInUserInfo:BaseResponseModel;
  
  constructor(
    private _circleService: CircleService,
    private _khaadSeedVendor: KhaadSeedVendorService,
    private layoutUtilsService: LayoutUtilsService,
    private _cdf: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _lovService: LovService
  ) {}

  countryRestriction = {
    latLngBounds: {
      north: 37.084107,
      east: 77.823171,
      south: 23.6345,
      west: 60.872972
    },
    strictBounds: true
  };



  ngOnInit() {
    
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    this.zoom = 0;
    
    this.createForm();
    this.GetRadius();
    //this.VendorName.setValue("Binod")


    if (this.LoggedInUserInfo.Zone != null) {
      debugger
      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;
      this.selected_z = this.SelectedZones.ZoneId
      this.radiusForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
    }
    
    if (this.LoggedInUserInfo.Branch != null) {
      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;
      this.selected_b = this.SelectedBranches.BranchCode
      this.radiusForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
    }
    
    if (this.LoggedInUserInfo.UserCircleMappings != null) {
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;
    }


    
  }

  createForm(){
    this.radiusForm = this.fb.group({
      ZoneId:[null],
      BranchCode: [null],
      CircleId: [null],
      Radius: [null],
      Type: [null],
      Name: [null]
    })
  }


  async GetRadius(){
    debugger
    this.Radius = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.FindVendorRadius });
    this.Radius = this.Radius.LOVs;

    this.radiusForm.controls["Radius"].setValue(this.Radius ? this.Radius[0].LovId : "")
    this.getRadius = this.radiusForm.controls.Radius.value;

    this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.VendorTypes });
    this.vendorLov = this.vendorLov.LOVs;
    this.radiusForm.controls["Type"].setValue(this.vendorLov ? this.vendorLov[0].LovId : "")
    //this.typeInitial = this.vendorLov ? this.vendorLov[0].LovId : "";

    console.log(this.Radius)
    console.log(this.vendorLov)
  }
  
  selectRadius(radius){
    this.getRadius = radius.value;
  }
  
  selectType(type){
    this.radiusForm.controls["Type"].setValue(type.value);
  }
  
  onSelect(){
    debugger
    this.spinner.show();
    
    this.user.ZoneId = this.radiusForm.controls.ZoneId.value;
    this.user.CircleId = this.radiusForm.controls.CircleId.value;
    if(this.user.CircleId == ""){
      this.user.CircleId = null
    }
    this.user.BranchCode = this.radiusForm.controls.BranchCode.value;

    this.vendor.Name = this.radiusForm.controls.Name.value;
    this.vendor.Radius = this.getRadius;
    this.vendor.Type = this.radiusForm.controls.Type.value;

    this._khaadSeedVendor.searchRadius(this.vendor,this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      //var lat,lng,name;
      if(baseResponse.Success === true){
        console.log(baseResponse)
        this.radiusInfo = baseResponse.SeedKhadVendor.VendorDetails;
            
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  // addMarker(lat, lng, name){
  //   debugger
  //   var myLatLng = { lat: Number(lat), lng: Number(lng) };
  //   this.vendorLocationMarker = new google.maps.Marker({
  //     position: myLatLng,
  //     title: name,
  //   });
  //   this.vendorLocationMarker.setMap(this.googleMap)
  // }

  getTitle(): string {
    return 'View Circle Fense';
  }


  ///////////////////Os Change Set Map
  onMapReady(map) {
    this.googleMap = map;
    //this.setCurrentLocation()    
  }


  clickedMarker(event ,index , infowindow) {
    debugger
    console.log(index)
    const dialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '600px',
      height: '600px',
      data: { id: this.radiusInfo[index].Id, circleId: this.radiusInfo[index].CircleId, zoneId: this.radiusInfo[index].ZoneId, branchCode: this.radiusInfo[index].BranchCode},
      disableClose: true
    });

    this.previousInfoWindow = infowindow;
  }


}
