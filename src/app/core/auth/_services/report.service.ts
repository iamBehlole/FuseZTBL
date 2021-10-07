import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {CashrequestModule} from '../_models/cashrequest.module';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {HttpUtilsService} from '../../_base/crud';
import {ReportFilters} from '../_models/report-filters.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {

    }


    getAllAPILogs(reportFilter: ReportFilters): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetAPILogs`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAPIRequestResponse(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetAPIRequestResponse`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAllErrorLogs(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetErrorLogs`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetMcoRecoveryCounts(reportFilter: ReportFilters): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetMcoRecoveryCounts`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAllUsersNotifications(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetUsersNotifications`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getUserHistory(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetUserHistory`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getErrorLogDetails(reportFilter: ReportFilters): Observable<BaseResponseModel> {


        this.request = new BaseRequestModel();
        this.request.ReportFilters = reportFilter;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Report/GetErrorLogDetails`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getDashboardNotification(): Observable<BaseResponseModel> {

        return this.http.post(`${environment.apiUrl}/Report/GetTopNotificationWithUnreadCount`,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getEcibQeue() {

        this.request = new BaseRequestModel();

        const req = JSON.stringify(this.request);


        const hello = this.http.post(`${environment.apiUrl}/Report/GetEcibQeueAll`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

        return hello;
    }


}




