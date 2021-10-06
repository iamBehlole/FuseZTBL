import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpUtilsService } from '../../_base/crud';
import { CreateCustomer } from '../_models/customer.model';
import { Observable } from 'rxjs';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';
import { LandInfo } from '../_models/land-info.model';
import { LandInfoDetails } from '../_models/land-info-details.model';
import { LandChargeCreation } from '../_models/land-charge-creation.model';
import { Activity } from '../_models/activity.model';
import { CustomerLandRelation } from '../_models/customer-land-relation.model';
import { UploadDocuments } from '../_models/upload-documents.model';

@Injectable({
  providedIn: 'root'
})
export class LandService {

  size = 10;
  pageIndex = 1;

  apiUrl = 'https://jsonplaceholder.typicode.com/photos';
  url2 = `https://jsonplaceholder.typicode.com/photos?page=${this.pageIndex}&size=${this.size}`; 


  public request = new BaseRequestModel();
  public activity = new Activity();
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

  saveCustomerLandInfo(landInfo: LandInfo): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();


    this.activity.ActivityID = 1;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    this.request.Zone = userInfo.Zone;
    this.request.LandInfo = landInfo;
    this.request.Activity = this.activity;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfo`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  saveCustomerLandInfoDetail(landInfoDetails: any, TrainId: any): Observable<BaseResponseModel> {

    debugger;
    this.request = new BaseRequestModel();

    this.activity.ActivityID = 1;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    this.request.Zone = userInfo.Zone;
    this.request.LandInfoDetailsList = landInfoDetails;
    this.request.Activity = this.activity;
    this.request.TranId = TrainId;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfoDetail`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  SaveChargeCreation(request: BaseRequestModel): Observable<BaseResponseModel> {

    var req = JSON.stringify(request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreation`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  SaveChargeCreationDetail(): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreationDetail`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  SubmitLandInfo(request: BaseRequestModel): Observable<BaseResponseModel> {
    var req = JSON.stringify(request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/SubmitLandInfo`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  searchLand(customerLandRelation: CustomerLandRelation, isUserAdmin: boolean, isZoneUser: boolean): Observable<BaseResponseModel> {
    debugger;
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    if (isUserAdmin || isZoneUser) {
      if (customerLandRelation.BranchId != undefined)
        userInfo.Branch.BranchId = customerLandRelation.BranchId;
      else
        userInfo.Branch.BranchId = 0;
    }
    if (isUserAdmin) {
      if (customerLandRelation.ZoneId != undefined)
        userInfo.Zone.ZoneId = customerLandRelation.ZoneId;
      else
        userInfo.Zone.ZoneId = 0;
    }
    this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    this.request.Zone = userInfo.Zone;
    this.request.CustomerLandRelation = customerLandRelation;
    var req = JSON.stringify(this.request);

 
    return this.http.post(`${environment.apiUrl}/Land/GetLandInformation`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  getCustomerAllLandInfo(landInfo: LandInfo): Observable<BaseResponseModel> {

    debugger;
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    userInfo.Branch.BranchId = landInfo.BranchId
    //this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    //this.request.Zone = userInfo.Zone;
    this.request.LandInfo = landInfo;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/GetLandInfoAll`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
  getLandHistoryDetail(landInfo: LandInfo, historyLandInfoId:string): Observable<BaseResponseModel> {

    debugger;
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    userInfo.Branch.BranchId = landInfo.BranchId
    //this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    //this.request.Zone = userInfo.Zone;
    landInfo.Id = parseInt(historyLandInfoId);
    this.request.LandInfo = landInfo;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/GetLandHistoryDetail`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }


  landDocumentsUpload(Image, Video, uploadDocuments: UploadDocuments): Observable<BaseResponseModel> {

    debugger;

    const formData = new FormData();
    formData.append('file', Image);
    formData.append('videofile', Video);
    formData.append('LandInfoId', uploadDocuments.LandInfoId.toString());
    formData.append('LandLatitude', uploadDocuments.LandLatitude);
    formData.append('LandLongitude', uploadDocuments.LandLongitude);
    formData.append('CreatedBy', "Test-test");


    return this.http.post<any>(`${environment.apiUrl}/Land/LandDataUpload`, formData,
    ).pipe(
      map((res: BaseResponseModel) => res)
    );

  }


  landDocumentsDelete(uploadDocuments: UploadDocuments): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    this.request.Branch = userInfo.Branch;
    this.request.Zone = userInfo.Zone;
    this.request.LandInfoData = uploadDocuments;
    this.request.Activity = this.activity;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/DeleteLandDataUpload`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }



  DeleteChargeCreationDetail(request: LandChargeCreation): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.ChargeCreation = request;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/DeleteChargeCreationDetail`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  GetLandHistory(landInfo: LandInfo): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();

    this.request.LandInfo = landInfo;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.request.User = userInfo.User;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/GetLandHistory`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }



  getData2() {
    return this.http.get(this.url2);        
  }



  deleteCustomerWithLand(landCustId) {
    
    var userInfo = this.userUtilsService.getUserDetails();

    //this.request.CustomerLandRelation = new CustomerLandRelation()
    //this.request.Zone = userInfo.Zone;
    //this.request.Branch = userInfo.Branch;
    //this.request.User = userInfo.User;

    var request = {
      CustomerLandRelation :{
        LandCustID: landCustId
      },
      Zone: userInfo.Zone,
      Branch : userInfo.Branch,
      User: userInfo.User,
      TranId : 0
    }

    var req = JSON.stringify(request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/DeleteCustomerWithLand`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


}
