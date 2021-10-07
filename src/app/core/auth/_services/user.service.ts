import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {User} from '../_models/user.model';
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
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/User/AddAdminUser`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    updateUser(user: User): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.User = user;
        this.request.UserInfo = user;

        const req = JSON.stringify(this.request);

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
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/User/GetUserById`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetUserLovs(): Observable<BaseResponseModel> {

        return this.http.post(`${environment.apiUrl}/User/GetLovs`,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    blockUser(request: BaseRequestModel): Observable<BaseResponseModel> {
        const userInfo = this.userUtilsService.getUserDetails();

        request.User = userInfo.User;
        const req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/User/BlockUser`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    unBlockUser(user: User): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.UserInfo = user;
        const userInfo = this.userUtilsService.getUserDetails();

        this.request.User = userInfo.User;

        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/User/UnBlockUser`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    public getPDF(): Observable<Blob> {

        const uri = `${environment.apiUrl}/User/GeneratePDFSample`;


        return this.http.get(uri, {responseType: 'blob'});


    }


}