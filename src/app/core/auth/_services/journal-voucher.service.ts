import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpUtilsService} from '../../_base/crud';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Activity} from '../_models/activity.model';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';
import {
    LoanApplicationLegalHeirs,
    PersonalSureties,
    CorporateSurety,
    LoanRefrences,
    LoanWitness,
    LoanPastPaid,
    LoanDocumentCheckList,
    CurrentLoans,
    GlConfigrationsDetail,
    ORR,
    CropProduction,
    AppraisalProposed,
    LoanDocuments,
    SearchLoan
} from '../_models/loan-application-header.model';

import {
    CustomersLoanApp,
    Loan,
    LoanApplicationPurpose,
    LoanSecurities,
    LoanApplicationHeader,
    CustomersLoanLand
} from '../_models/loan-application-header.model';
import {Branch} from '../_models/branch.model';
import {JournalVocherData} from '../_models/journal-voucher.model';
import {Circle} from '../_models/circle.model';

@Injectable({
    providedIn: 'root'
})
export class JournalVoucherService {
    pageIndex = 1;
    size = 10;
    public request = new BaseRequestModel();
    public activity = new Activity();


    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }

    saveApplicationHeader(loanReq: LoanApplicationHeader): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.ApplicationHeader = loanReq;

        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveApplicationHeader`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    createJVTransaction(jv: JournalVocherData): Observable<BaseResponseModel> {
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        const activity = {ActivityID: 1};
        this.activity.ActivityID = 1;

        const request = {
            Activity: activity,
            Branch: userInfo.Branch,
            DeviceLocation: {
                BtsId: '0',
                BtsLoc: '',
                Lat: '0.000000000000000',
                Long: '0.000000000000000',
                // Lat: "33.703988333333335",
                // Long: "73.06844500000001",
                Src: 'GPS'
            },
            doPerformOTP: false,
            JournalVoucher: {
                JournalVoucherData: jv
            },
            TranId: 10043,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        const req = JSON.stringify(request);
        console.log(req);


        return this.http.post(`${environment.apiUrl}/JournalVoucher/CreateJVTransaction`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getJVMasterCodes(category: number, code: string) {

        const request = {
            JournalVoucher: {
                JvMasterCodes: {
                    JvCategory: category,
                    Code: code
                }
            },
            TranId: 0
        };
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetJVMasterCodes`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getJVMasterCodesDetail(code: string) {
        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JvMasterCodes: {
                    Code: code
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetJVCodeDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deleteJv(trDId: string) {
        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionDetailID: trDId,

                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/DeleteTransactionDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getGLForLC(code: string) {

        const userInfo = this.userUtilsService.getUserDetails();
        const circle = userInfo.UserCircleMappings;
        const circleIds = [];

        circle.forEach(element => {
            circleIds.push(element.CircleId);
        });
        const _circles = JSON.stringify(circleIds);
        const request = {
            JournalVoucher: {
                GLforJV: {
                    LCNo: code
                }
            },
            Circle: {
                CircleIds: _circles
            },
            TranId: 0,
            Branch: userInfo.Branch,
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetGLForJv`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    async getChildNodesWithCode(code: string) {

        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JvMasterCodeDetail: {
                    ParentDetailId: code
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        const response = await this.http.post(`${environment.apiUrl}/JournalVoucher/GetChildNodesWithCode`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).toPromise();
        return response;
    }

    getSearchJvTransactions(category: string, nature: string, manualVoucher: string, trDate: string) {

        const userInfo = this.userUtilsService.getUserDetails();

        const request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionStatus: category,
                    Nature: nature,
                    ManualVoucherNo: manualVoucher,
                    TransactionDate: trDate
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/SearchJvTransactions?page=${this.pageIndex}&size=${this.size}`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getChangeTransactionStatusJV(trId: string, status: string, remarks: string) {


        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionStatus: status,
                    TransactionID: trId,
                    Remarks: remarks
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/ChangeTransactionStatusJV`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    bindGridWithTrDetail(trId: string) {


        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionID: trId,
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        return this.http.post(`${environment.apiUrl}/JournalVoucher/BindGridWithTrDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTransactionByID(trId: string) {

        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            JournalVoucher: {
                JournalVoucherData: {
                    TransactionID: trId,
                }
            },
            TranId: 0,
            Branch: userInfo.Branch,
            User: userInfo.User,
            Zone: userInfo.Zone
        };

        return this.http.post(`${environment.apiUrl}/JournalVoucher/GetTransactionByID`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

}
