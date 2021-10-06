import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Activity} from '../_models/activity.model';
import {environment} from '../../../../environments/environment';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {User} from '../_models/user.model';
import {HttpUtilsService} from '../../_base/crud';
import {Configuration} from '../_models/configuration.model';
import {any} from 'codelyzer/util/function';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public request = new BaseRequestModel();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private utilService: UserUtilsService) {
  }


  AddConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
    debugger;
    this.request = new BaseRequestModel();
    this.request.Configuration = configuration;
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Configuration/AddConfiguration`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  UpdateConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Configuration = configuration;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/Configuration/UpdateConfiguration`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  DeleteConfiguration(configuration: Configuration): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Configuration = configuration;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Configuration/DeleteConfiguration`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  sam;

  GetConfigurations(): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.Configuration = {
      'Status': '1'
    };

    this.request.User = this.utilService.getUserDetails().User;

    var req = JSON.stringify(this.request);
    console.log(req);

    return this.http.post(`${environment.apiUrl}/Configuration/GetConfigurations`, req).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getParents() {
    this.request = new BaseRequestModel();
    this.request.User = this.utilService.getUserDetails().User;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Configuration/GetParents`, req);
  }
}
