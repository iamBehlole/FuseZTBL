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
import { Circle } from '../_models/circle.model';

@Injectable({
    providedIn: 'root'
})
export class TourDiaryService {

    public request = new BaseRequestModel();
    public activity = new Activity();


    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

    userInfo = this.userUtilsService.getUserDetails();
    createTourPlan(tourPlan) {
        var circle = this.userInfo.UserCircleMappings;
        var circleIds = [];
        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        var _circles = JSON.stringify(circleIds)
        var request = {
            Circle: {
                CircleIds: _circles
            },
            TourPlanAndDiaryDto: {
                CreateOrEditTourPlan: {
                    TourPlanId: tourPlan.TourPlanId,
                    CircleId: tourPlan.CircleId,
                    VisitedDate: tourPlan.VisitedDate,
                    PurposeDisplayName: tourPlan.VisitedDate,
                    Remaks: tourPlan.Remaks,
                    CurrentStatus: tourPlan.CurrentStatus
                }
            },
            TranId: 0,
            Branch: this.userInfo.Branch,
            User: this.userInfo.User,
            Zone: this.userInfo.Zone
        };
        return this.http.post(`${environment.apiUrl}/TourPlanAndDiary/CreateUpdateTourPlan`, request,
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
                map((res: BaseResponseModel) => res)
            );
    }
}
