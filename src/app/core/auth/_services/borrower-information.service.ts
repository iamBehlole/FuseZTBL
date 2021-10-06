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
export class BorrowerInformationService {

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

  userDetail = this.userUtilsService.getUserDetails();

  getBorrowerInformation(limit, offset, cnic, circle){
    var userInfo = this.userDetail;
    var circle = userInfo.UserCircleMappings;
    var circleIds = [];
    
    circle.forEach(element => {
      circleIds.push(element.CircleId);
    });
    var _circles = JSON.stringify(circleIds)

    var request = {
      Circle:{
        CircleIds: _circles 
      },
      BorrowerInfo: {
        Limit: limit,
        Offset: offset,
        Cnic: cnic,
        Circle: circle
      },
      TranId: 0,
      Branch: userInfo.Branch,
      User: userInfo.User,
      Zone: userInfo.Zone
  };
  debugger;
    return this.http.post(`${environment.apiUrl}/Customer/Gettotalnumberofborrowersdetails`, request,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

     
}
