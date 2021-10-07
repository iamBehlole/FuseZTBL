import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpUtilsService} from '../../_base/crud';
import {CreateCustomer} from '../_models/customer.model';
import {Observable} from 'rxjs';
import {BaseResponseModel} from '../../_base/crud/models/_base.response.model';
import {BaseRequestModel} from '../../_base/crud/models/_base.request.model';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {UserUtilsService} from '../../_base/crud/utils/user-utils.service';
import {LandInfo} from '../_models/land-info.model';
import {LandInfoDetails} from '../_models/land-info-details.model';
import {LandChargeCreation} from '../_models/land-charge-creation.model';
import {Activity} from '../_models/activity.model';
import {RecoveryDataModel} from '../_models/recovery.model';

@Injectable({
    providedIn: 'root'
})
export class RecoveryService {

    public request = new BaseRequestModel();
    public activity = new Activity();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) {
    }


    saveCustomerLandInfo(landInfo: LandInfo): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();


        this.activity.ActivityID = 1;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfo = landInfo;
        this.request.Activity = this.activity;

        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfo`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    saveCustomerLandInfoDetail(landInfoDetails: any): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        this.activity.ActivityID = 1;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.request.LandInfoDetailsList = landInfoDetails;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Land/SaveCustomerLandInfoDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    SaveChargeCreation(request: BaseRequestModel): Observable<BaseResponseModel> {

        const req = JSON.stringify(request);


        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreation`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    SaveChargeCreationDetail(): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Land/SaveChargeCreationDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    SubmitLandInfo(): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Land/SubmitLandInfo`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanTransaction(transactionDate: string, voucherNo: string, instrumentNO: string, recoveryType, lcno: string, status: string, currentIndex: string, count: string): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        console.log('user info');
        console.log(userInfo);
        const recoveryData = {RecoveryType: recoveryType};
        const recovery = {
            TransactionDate: transactionDate,
            VoucherNo: voucherNo,
            InstrumentNO: instrumentNO,
            Lcno: lcno,
            Status: status,
            CurrentIndex: currentIndex,
            Count: count,
            WorkingDate: userInfo.Branch.WorkingDate,
            RecoveryData: recoveryData
        };
        const request = {
            Zone: userInfo.Zone,
            Branch: userInfo.Branch,
            doPerformOTP: false,
            TranId: 0,
            DeviceLocation: {},
            Recovery: recovery
        };

        console.log('getLoanTransaction request');
        console.log(request);
        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanTransaction`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getTransactiondetailByID(lnTransactionID: string, lcno: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const req = JSON.stringify(this.request);

        const branch = {BranchID: userInfo.Branch.BranchId};
        const recovery = {
            LnTransactionID: lnTransactionID, Lcno: lcno, RecoveryData: {}
        };
        const request = {Branch: branch, Recovery: recovery};
        const req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/Recovery/GetTransactiondetailByID`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    getAccountDetails(LoanDisbID: string, type: string, recoveryType: string, effectiveDate: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;


        const branch = {BranchId: userInfo.Branch.BranchId, WorkingDate: userInfo.Branch.WorkingDate};
        const recovery = {
            Type: type,
            DisbursementGL: {LoanDisbID: LoanDisbID},
            RecoveryData: {RecoveryType: recoveryType, EffectiveDate: effectiveDate}
        };
        const request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetAccountDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getSubProposalGL(TransactionType: string, ForInterBranch: boolean, ForSBs: boolean, LoanCaseNo: string, circleID: string, contraBranchCode, mode: number): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const req = JSON.stringify(this.request);

        const branch = {BranchId: userInfo.Branch.BranchId};
        const recovery = {
            RecoveryData: {ContraBranchCode: contraBranchCode},
            SubProposalGL: {
                ForInterBranch: ForInterBranch,
                ForSBs: ForSBs,
                TransactionType: TransactionType,
                LoanCaseNo: LoanCaseNo,
                CircleID: circleID,
                Mode: mode
            }
        };
        const request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetSubProposalGL`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getDisbursementByGL(SanctionID: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const recovery = {DisbursementGL: {SanctionID: SanctionID}};
        const request = {Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetDisbursementByGL`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getCoordinatorsByID(RecoveryThroughType: string, LoanCaseNo: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const req = JSON.stringify(this.request);

        const recovery = {RecoveryData: {RecoveryThroughType: RecoveryThroughType, LoanCaseNo: LoanCaseNo}};
        const request = {Branch: userInfo.Branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetcoordinatorsByID`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    saveRecoveryData(RecoveryData: RecoveryDataModel): Observable<BaseResponseModel> {

        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        RecoveryData.UserID = userInfo.User.UserId;


        const activity = {ActivityID: 1};
        const recovery = {RecoveryData: RecoveryData};

        const request = {
            Activity: activity,
            Branch: userInfo.Branch,
            DeviceLocation: {
                BtsId: '0',
                BtsLoc: '',
                Lat: '0.000000000000000',
                Long: '0.000000000000000',
                Src: 'GPS'
            },
            doPerformOTP: false,
            Recovery: recovery,
            TranId: 0,
            User: userInfo.User,
            Zone: userInfo.Zone
        };


        const req = JSON.stringify(request);
        console.log('saveRecoveryData request packet');
        console.log(request);

        return this.http.post(`${environment.apiUrl}/Recovery/SaveRecoveryData`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    submitRecovery(transactionID: string, remarks: string, disbursementID: string, recoveryType: string, tranDate: string): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;

        const user = {UserId: userInfo.User.UserId};
        const recovery = {
            RecoveryData: {
                DisbursementID: disbursementID,
                TransactionID: transactionID,
                Remarks: remarks,
                RecoveryType: recoveryType,
                TranDate: tranDate
            }
        };
        const request = {Branch: userInfo.Branch, User: user, Recovery: recovery};
        console.log('SubmitRecovery request packet');
        console.log(request);
        return this.http.post(`${environment.apiUrl}/Recovery/SubmitRecovery`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deleteRecovery(transactionID: string, recoveryType: string): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        const recovery = {RecoveryData: {TransactionID: transactionID, RecoveryType: recoveryType}};
        const request = {User: userInfo.User, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/DeleteRecovery`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanApplicationsInquiry(lcNo: string, LnTransactionID: string): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        const branch = {BranchId: userInfo.Branch.BranchId};
        const recovery = {Lcno: lcNo, LnTransactionID: LnTransactionID};
        const request = {Branch: branch, Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiry`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getLoanApplicationsInquiryDisbursment(LnTransactionID: string): Observable<BaseResponseModel> {


        const recovery = {LnTransactionID: LnTransactionID};
        const request = {Recovery: recovery};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiryDisbursment`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getViewLoanDocument(documentType: string, documentId: string): Observable<BaseResponseModel> {

        const ViewDocumnets = {ID: documentId, Type: documentType};
        const request = {ViewDocumnets: ViewDocumnets};

        return this.http.post(`${environment.apiUrl}/Recovery/GetLoanApplicationsInquiryDisbursment`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getCircles(): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        const request = {Branch: userInfo.Branch, TranId: 0};

        return this.http.post(`${environment.apiUrl}/Recovery/GetCircles`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getReceiptDetail(recoveryData): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            User: userInfo.User, Branch:
            userInfo.Branch,
            Recovery: {
                RecoveryData: {
                    TransactionID: recoveryData.TransactionID,
                    DisbursementID: recoveryData.DisbursementID,
                    BranchWorkingDate: recoveryData.BranchWorkingDate,
                    ReceiptNo: recoveryData.ReceiptId
                }
            }
        };
        // var req = JSON.stringify(request)
        // console.log(req)

        return this.http.post(`${environment.apiUrl}/Recovery/GetReceiptDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getReceiptDetailSubmit(recoveryData): Observable<BaseResponseModel> {

        const userInfo = this.userUtilsService.getUserDetails();
        const request = {
            User: userInfo.User, Branch:
            userInfo.Branch,
            Recovery: {
                RecoveryData: {
                    TransactionID: recoveryData.TransactionID,
                    DisbursementID: recoveryData.DisbursementID,
                    BranchWorkingDate: recoveryData.BranchWorkingDate,
                    ReceiptNo: recoveryData.ReceiptId
                }
            }
        };
        // var req = JSON.stringify(request)
        // console.log(req)

        return this.http.post(`${environment.apiUrl}/Recovery/GetReceiptDetail`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    updateSignature(file, TransactionID: string, ReceiptId: string): Observable<BaseResponseModel> {

        const request = {ParentDocId: TransactionID, ImageBase64: file, ReferenceNo: ReceiptId};
        return this.http.post(`${environment.apiUrl}/Recovery/UploadSignaturePortal`, request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );


    }
}
