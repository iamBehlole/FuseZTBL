
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model';
import { UserInfoModel } from '../../_base/crud/models/_userInfo.model';
import { User } from '../_models/user.model';
import { Circle } from '../_models/circle.model';
import { HttpUtilsService } from '../../_base/crud';
import { UserHistory } from '../_models/location-history.model';
import { Zone } from '../_models/zone.model';
import { Branch } from '../_models/branch.model';
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SetRolesService {

  public request = new BaseRequestModel();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    console.log(this.userUtilsService.getUserDetails())
   }


  getAllCircles(): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/GetCircles`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  GetCircleByBranchId(){
    debugger
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    var circle = userInfo.UserCircleMappings;
    var circleIds = [];
    
    circle.forEach(element => {
      circleIds.push(element.CircleId);
    });
    var _circles = JSON.stringify(circleIds)
    // this.request.LoanUtilization={"UtilizationDetail":{"LoanCaseNo":}}
    //this.request.TranId = 2830;
    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "33.65898",
      LONG: "73.057665",
      SRC: "GPS"
    },
    
    this.request.Circle={
      CircleIds: _circles
    },

    this.request.doPerformOTP = false;
    debugger
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/LoanUtilization/GetCircleByBranchId`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getCircleByBranchId(id, code){
    debugger
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    //var circle = userInfo.UserCircleMappings;
    this.request.doPerformOTP = false;
    debugger
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = {
      BranchId : id,
      BranchCode : code,
    };
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/LoanUtilization/GetCircleByBranchId`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getAllCirclesSinglePoints(branchId: string): Observable<BaseResponseModel> {
   
    this.request = new BaseRequestModel();
    if (branchId != null) {
      var branch = new Branch()
      branch.BranchCode = branchId
      this.request.Branch = branch
    }
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/GetCirclesPoints`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  getZones(): Observable<BaseResponseModel> {
    debugger
    this.request = new BaseRequestModel();
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Zone/GetZones`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  getBranchesByZone(zone:Zone): Observable<BaseResponseModel> {
    debugger
    this.request = new BaseRequestModel();
    this.request.Zone = zone;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Branch/GetBranchByZone`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getCircles(branch: Branch): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.Branch = branch;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/GetCirclesByBranchCode`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  CirclePoligonAdd(request: BaseRequestModel): Observable<BaseResponseModel> {

    //this.request = new BaseRequestModel();
    //this.request.Circle = circle;
    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonAdd`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  CirclePoligonUpdate(request: BaseRequestModel): Observable<BaseResponseModel> {

    //this.request = new BaseRequestModel();
    //this.request.Circle = circle;
    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonUpdate`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  CirclePoligonGet(circle: Circle): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.Circle = circle;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonGet`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
  DeleteCircleFence(circle: Circle): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Circle = circle;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/DeleteCirclePoligon`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  GetCirclesPolygon(circle: Circle): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.Circle = circle;

    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Circle/GetAllCirclesPoints`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }



  GetUserHistory(request: BaseRequestModel): Observable<BaseResponseModel> {
    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/Report/GetUserCircleLocation`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
  
  GetCricleFenceById(request: BaseRequestModel): Observable<BaseResponseModel> {

    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/Circle/CirclePoligonGetById`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }






}
