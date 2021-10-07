import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {HttpUtilsService} from '../../_base/crud';
import {Profile} from '../_models/profile.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';
import {C} from '@angular/cdk/keycodes';

@Injectable({providedIn: 'root'})
export class ProfileService {
  public request = new BaseRequestModel();

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private userUtilsService: UserUtilsService,) {
  }


  updateProfile(profile, profileID = -1): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Activities = profile;
    this.request.Profile = {
      ProfileID: profileID
    };
    this.request.User = this.userUtilsService.getUserDetails().User;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Activity/AddPagesWithRoleMapping`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getRoleGroups() {
    this.request = new BaseRequestModel();
    this.request.TranId = 2830;
    this.request.DEVICELOCATION = {
      BTSID: '0',
      BTSLOC: '',
      LAT: '33.65898',
      LONG: '73.057665',
      SRC: 'GPS'
    },

      this.request.Circle = {
        CircleIds: '53444,53443,53442,53441'
      },

      this.request.doPerformOTP = false;

    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;

    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Profile/GetRoleGroups`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );

  }

  createProfile(profile: Profile): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Profile = profile;

    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Profile/AddProfile`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  deleteProfile(profile: Profile): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Profile = profile;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Profile/DeleteProfile`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getAllProfiles(): Observable<BaseResponseModel> {

    return this.http.post(`${environment.apiUrl}/Profile/GetProfile`,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  getProfileByID(profile: Profile): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.Profile = profile;
    this.request.Branch = {
      'BranchId': '102',
      'BranchCode': '20238',
      'Name': 'NOORPUR TOWN',
      'WorkingDate': '11012021',
      'Id': 0
    };
    this.request.doPerformOTP = false;
    this.request.TranId = 2830;
    this.request.DEVICELOCATION = {
      BTSID: '0',
      BTSLOC: '',
      LAT: '33.65898',
      LONG: '73.057665',
      SRC: 'GPS'
    }, this.request.Circle = {
      CircleIds: '53444,53443,53442,53441'
    };
    var req = JSON.stringify(this.request);
    this.request.User = this.userUtilsService.getUserDetails().User;
    this.request.Zone = {
      Id: 0,
      ZoneId: '50055',
      ZoneName: 'SAHIWAL'
    };
    return this.http.post(`${environment.apiUrl}/Activity/GetAllPagesByRoleID`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  AddNewRole(profile: Profile): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.Profile = profile;
    this.request.Profile['IsActive'] = 1;
    this.request.Profile['AccessToData'] = 1;
    this.request.Profile['Status'] = 0;

    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Profile/AddRole`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  UpdateRole(profile: Profile): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Profile = profile;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Profile/UpdateRole`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  DeleteRole(profile: Profile): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Profile = profile;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Profile/DeleteRole`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }
}
