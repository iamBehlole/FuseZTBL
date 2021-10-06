import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Activity} from '../_models/activity.model';
import {environment} from '../../../../environments/environment';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {UserInfoModel} from '../../_base/crud/models/_userInfo.model';
import {User} from '../_models/user.model';
import {Branch} from '../_models/branch.model';
import {HttpUtilsService} from '../../_base/crud';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public request = new BaseRequestModel();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
  }


  createUser(user: User, profileId = -1): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.User = this.userUtilsService.getUserDetails().User;
    this.request.UserInfo = user;
    this.request.Profile = {
      ProfileId: profileId
    };
    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/User/AddAdminUser`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  updateUser(user: User): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.User = user;
    this.request.UserInfo = user;

    var req = JSON.stringify(this.request);

    debugger;
    return this.http.post(`${environment.apiUrl}/User/UpdateUser`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  getAllUsers(): Observable<BaseResponseModel> {

    return this.http.post(`${environment.apiUrl}/User/GetUsers`,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  getUserById(user: User): Observable<BaseResponseModel> {

    this.request = new BaseRequestModel();
    this.request.User = user;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/User/GetUserById`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  GetUserLovs(): Observable<BaseResponseModel> {
    debugger;
    return this.http.post(`${environment.apiUrl}/User/GetLovs`,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  blockUser(request: BaseRequestModel): Observable<BaseResponseModel> {
    debugger;
    var userInfo = this.userUtilsService.getUserDetails();
    //this.request = new BaseRequestModel();
    request.User = userInfo.User;
    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/User/BlockUser`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  unBlockUser(user: User): Observable<BaseResponseModel> {
    debugger;

    this.request = new BaseRequestModel();
    this.request.UserInfo = user;
    var userInfo = this.userUtilsService.getUserDetails();
    //this.request = new BaseRequestModel();
    this.request.User = userInfo.User;

    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/User/UnBlockUser`, req,
      {headers: this.httpUtils.getHTTPHeaders()}).pipe(
      map((res: BaseResponseModel) => res)
    );
  }


  public getPDF(): Observable<Blob> {

    //const options = { responseType: 'blob' }; there is no use of this
    let uri = `${environment.apiUrl}/User/GeneratePDFSample`;
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    //return this.http.get(uri, { responseType: 'blob' });

    return this.http.get(uri, {responseType: 'blob'});

    //return this.http.post<Blob>(uri,
    //   { headers: this.httpUtils.getHTTPHeaders(), responseType: 'blob' });


  }


}//end of service


//DownloadFile(): Observable<any> {


//  return this.httpp.post(`${environment.apiUrl}/User/DownloadFile`,
//    { responseType: ResponseContentType.Blob })
//    .map(
//      (res) => {
//        var blob = new Blob([res.blob()])
//        return blob;
//      });
//}


//}


// public getPDF(): Observable < Blob > {

//  //const options = { responseType: 'blob' }; there is no use of this
//  let uri = `${environment.apiUrl}/User/GeneratePDFSample`;
//  // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
//  //return this.http.get(uri, { responseType: 'blob' });

//  return this.http.get(uri, { responseType: 'blob' });

//  //return this.http.post<Blob>(uri,
//  //   { headers: this.httpUtils.getHTTPHeaders(), responseType: 'blob' });


//}
