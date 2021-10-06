import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserUtilsService } from "../../_base/crud/utils/user-utils.service";
import { HttpUtilsService } from '../../_base/crud';
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GeoFencingService {

  public request = new BaseRequestModel();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    console.log(this.userUtilsService.getUserDetails())
   }


  GetGeoFencing(): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();

    // this.request.LandInfo = landInfo;
    // this.request.Zone = userInfo.Zone;
    // this.request.Branch = userInfo.Branch;
    // this.request.User = userInfo.User;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Land/GetLandHistory`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
  }
