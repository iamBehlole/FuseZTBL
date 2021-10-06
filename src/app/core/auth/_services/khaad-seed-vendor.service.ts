import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpUtilsService } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Activity } from '../_models/activity.model';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model'; 
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';
import { Branch } from '../_models/branch.model';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class KhaadSeedVendorService {

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

  userDetail = this.userUtilsService.getUserDetails();

  getTypeLov(userInfo){
    //debugger
    var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      User: userInfo.User
    }
    
    return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendorTypes`, request,)
      .pipe(
        map((res: BaseResponseModel) => res)
        );
      
  }

  addNewVendor(vendor, file: File) {
    debugger
    var formData = new FormData();
    var userInfo = this.userUtilsService.getUserDetails();

    if(vendor.Id != null || vendor.Id != undefined){
      
      formData.append('Id', vendor.Id);
    }
    formData.append('Name', vendor.Name);
    formData.append('Type', vendor.Type);
    formData.append('Address', vendor.Address);
    formData.append('PhoneNumber', vendor.PhoneNumber);
    formData.append('Description', vendor.Description);
    formData.append('UserId', userInfo.User.UserId);
    formData.append('UserPPNO', userInfo.User.UserName);
    formData.append('Lat', vendor.Lat);
    formData.append('ZoneId', vendor.ZoneId);
    formData.append('BranchCode', vendor.BranchCode);
    formData.append('CircleId', vendor.CircleId);
    formData.append('Lng', vendor.Lng);
    formData.append('File', file);


    debugger
    if(formData.append){

      return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/AddUpdateVendor`, formData,)
      .pipe(
        map((res: BaseResponseModel) => res)
        );
      }

   }

  searchVendors(limit, offSet, vendor, user) {
    debugger

     var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
          Limit: limit,
          Offset: offSet,
          VendorDetail : vendor
      },      
       User: this.userDetail.User,
       Circle: {
         Id: user.CircleId
       },
       Zone: {
         ZoneId: user.ZoneId
       },
       Branch: {
         BranchCode: user.BranchCode
       }       
     }
     var req = JSON.stringify(request);
     console.log(req)

     debugger;
     return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, req,)
       .pipe(
        map((res: BaseResponseModel) => res)
        );
   }

   searchRadius(vendor, user){
    debugger
    vendor.Radius = Number(vendor.Radius)
    var request = {
     DeviceLocation: {
       BtsId: "0",
       BtsLoc: "",
       Lat: "33.659578333333336",
       Long: "73.05676333333334",
       Src: "GPS"
     },
     SeedKhadVendor:{
      //Radius: vendor.Radius,
      //Type: vendor.Type,
      // Name: vendor.Name
      VendorDetail: vendor
     },      
      User: this.userDetail.User,
      Circle: {
        Id: user.CircleId
      },
      Zone: {
        ZoneId: user.ZoneId
      },
      Branch: {
        BranchCode: user.BranchCode
      }
    }
    //var req = JSON.stringify(request);
    //console.log(req)

    debugger;
    return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, request,)
      .pipe(
       map((res: BaseResponseModel) => res)
       );
  }

   getVendor(vendor, user){
     debugger
     vendor.Id = Number(vendor.Id)
    var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
        VendorDetail:vendor
      },      
      User: this.userDetail.User,
      Circle: {
        Id: user.CircleId
      },
      Zone: {
        ZoneId: user.ZoneId
      },
      Branch: {
        BranchCode: user.BranchCode
      }
     }
     var req = JSON.stringify(request)
     return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/GetVendors`, req,)
       .pipe(
        map((res: BaseResponseModel) => res)
        );   
   }
   
   deleteVendor(vendor, user){
    var request = {
      DeviceLocation: {
        BtsId: "0",
        BtsLoc: "",
        Lat: "0.0",
        Long: "0.0",
        Src: "GPS"
      },
      SeedKhadVendor:{
        VendorDetail:vendor
      },      
      User: this.userDetail.User,
      Circle: {
        Id: user.CircleId
      },
      Zone: {
        ZoneId: user.ZoneId
      },
      Branch: {
        BranchCode: user.BranchCode
      }
     }
     return this.http.post<any>(`${environment.apiUrl}/SeedKhadVendor/DeleteVendor`, request,)
       .pipe(
        map((res: BaseResponseModel) => res)
        );
   }
   
}
