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
import { LoanApplicationLegalHeirs, PersonalSureties, CorporateSurety, LoanRefrences, LoanWitness, LoanPastPaid, LoanDocumentCheckList, CurrentLoans, GlConfigrationsDetail, ORR, CropProduction, AppraisalProposed, LoanDocuments, SearchLoan } from '../_models/loan-application-header.model';
import { Branch } from '../_models/branch.model';
import { JournalVocherData } from '../_models/journal-voucher.model';
import { DEVICELOCATION, OTP, Circle } from '../_models/default.model';

@Injectable({
    providedIn: 'root'
})
export class TourPlanService {

    public request = new BaseRequestModel();
    public activity = new Activity();
    public deviceLocation = new DEVICELOCATION;
    public circle = new Circle;
    public OTP = new OTP;

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

    userInfo = this.userUtilsService.getUserDetails();

    createTourPlan(TourPlan) {
        this.request = new BaseRequestModel();
        this.request.DEVICELOCATION = this.deviceLocation;
        this.request.TranId = 2830;
        this.request.doPerformOTP = false;
        this.request.Zone = this.userInfo.Zone;
        this.request.Branch = this.userInfo.Branch;
        this.request.Circle = this.circle;
        this.request.User = this.userInfo.User;
        this.request.TourPlan = TourPlan;
        var v = JSON.stringify(this.request)
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/CreateUpdateTourPlan`, this.request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    ChanageTourStatus(tourPlan) {
        var request = {
            TourPlanAndDiaryDto: {
                ChangesTourPlanStatusDto: { tourPlan }
            },
            User: this.userInfo.User,
        };
        var v = JSON.stringify(this.request)
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/ChanageTourStatus`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    GetTourPlanDetail(tourPlan) {
        var circle = this.userInfo.UserCircleMappings;
        var request = {
            TourPlanAndDiaryDto: {
                TourPlan: { tourPlan }
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };
        var v = JSON.stringify(this.request)
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanDetail`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    GetTourPlanForApprovel(tourPlan) {
        var circle = this.userInfo.UserCircleMappings;
        var request = {
            TourPlanAndDiaryDto: {
                TourPlan: { tourPlan }
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };
        var v = JSON.stringify(this.request)
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/GetTourPlanForApprovel`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

    SearchTourPlan(tourPlan) {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.TourPlan = tourPlan;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        var req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/SearchTourPlan`, req,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }

}
