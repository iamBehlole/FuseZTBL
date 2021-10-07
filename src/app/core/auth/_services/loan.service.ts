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
    SearchLoan,
    LoanDbr,
    SearchLoanDbr
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

@Injectable({
    providedIn: 'root'
})
export class LoanService {

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

    saveLoanApplicationPurpose(loanReq: LoanApplicationPurpose, tranId: number): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.LoanApplicationpurpose = loanReq;

        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Branch = userInfo.Branch;
        this.request.Zone = userInfo.Zone;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/SaveLoanApplicationpurpose`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    generateNewAutoLc(branch: Branch) {

        this.request = new BaseRequestModel();
        this.request.Branch = branch;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/GenrateNewLc`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getCustomerLand(loanAppId) {
        this.request = new BaseRequestModel();
        this.request.Loan = new Loan();
        this.request.Loan.ApplicationHeader = new LoanApplicationHeader();
        this.request.Loan.ApplicationHeader.LoanAppID = loanAppId;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/GetLoanLand`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );


    }

    saveLoanSecurities(securitiesReq: LoanSecurities, tranId: number) {
        this.request = new BaseRequestModel();
        const loanInfo = new Loan();

        const userInfo = this.userUtilsService.getUserDetails();


        loanInfo.LoanSecurities = securitiesReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;

        const a = userInfo.User.UserId;
        loanInfo.LoanSecurities.EnteredBy = a;

        let selectedCircleId = '';
        loanInfo.LoanSecurities.OrgUnitID = userInfo.Branch.BranchId;

        if (userInfo.UserCircleMappings.length > 0) {
            userInfo.UserCircleMappings.forEach((value, key) => {
                if (userInfo.UserCircleMappings.length === (key + 1)) {
                    selectedCircleId += value.CircleId;
                } else {
                    selectedCircleId += value.CircleId + ',';
                }
            });
        }
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Circle = {

            'CircleIds': selectedCircleId

        };

        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/SaveLoanSecurities`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    saveCustomerWithLoanApp(customerLoanReq: CustomersLoanApp, tranId: number) {
        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.CustomersLoanApp = customerLoanReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveCustomerWithLoanApp`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    saveLoanApplicationLegalHeirs(legalheirsReq: LoanApplicationLegalHeirs, tranId: number, loanId: number) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.LoanApplicationLegalHeirs = legalheirsReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Loan.LoanApplicationLegalHeirs.UserID = userInfo.User.UserId;
        this.request.Loan.LoanApplicationLegalHeirs.LoanAppID = loanId;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/SaveLoanApplicationLegalheirs`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    saveUpdatePersonalSureties(personalSureties: PersonalSureties, tranId: number) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.PersonalSureties = personalSureties;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/SaveUpdatePersonalSureties`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    saveUpdateCorporateSurety(corporateSurety: CorporateSurety, tranId: number) {
        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.CorporateSurety = corporateSurety;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/Saveupdatecorporatesurety`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    saveUpdateReferences(loanRefrences: LoanRefrences, tranId: number) {
        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.LoanRefrences = loanRefrences;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/SaveupdateReferences`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    SaveUpdateWitnesses(loanWitness: LoanWitness, tranId: number) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.LoanWitness = loanWitness;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Loan/SaveupdateWitnesses`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    SaveUpdatePastPaidLoans(loanPastPaid: LoanPastPaid, tranId: number) {
        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.LoanPastPaid = loanPastPaid;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveupdatePastPaidLoans`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    getDocumentNo(TranId: any) {
        this.request = new BaseRequestModel();
        this.request.TranId = TranId;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/GetDocumentNo`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    getCheckList(loanReq: LoanApplicationHeader, tranId: number) {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.ApplicationHeader = loanReq;

        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/GetCheckList`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    saveCheckList(loanReq: LoanDocumentCheckList[], tranId: number) {

        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.LoanDocumentCheckList = loanReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/SaveCheckList`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    submitLoanApplication(loanReq: LoanApplicationHeader, tranId: number) {

        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.ApplicationHeader = loanReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/SubmitLoanApplication`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    saveUpdateCurrentLoans(loanReq: CurrentLoans, tranId: number) {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.CurrentLoans = loanReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveupdateCurrentLoans`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    attachCustomersLand(customerLandList: CustomersLoanLand[], tranId: number) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.CustomersLoanLands = customerLandList;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/AttachCustomersLand`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    SearchGLCode(loanReq: GlConfigrationsDetail) {


        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.GlConfigrationsDetail = loanReq;
        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/SearchGLCode`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    addCropDetail(cropProd: CropProduction, tranId: number) {

        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.CropProduction = cropProd;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/AddCropDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    addAppraisalProposed(appraisalList: AppraisalProposed[], tranId: number) {

        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.AppraisalProposedList = appraisalList;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/AddAppraisalProposed`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    getORRDropDownByAppID(loanAppID: string) {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        const oRR = new ORR();
        oRR.LoanAppID = 2016727529;
        loanInfo.ORR = oRR;
        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/GetORRDropDownByAppID`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    deleteAppraisalItemDetail(appraisal: AppraisalProposed, tranId: number) {

        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.AppraisalProposed = appraisal;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/DeleteAppraisalItemDetail`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    documentUpload(loanDoc: LoanDocuments, tranId: number, loanCaseNo: string) {
        tranId = 12121;
        const formData = new FormData();
        const loanInfo = new Loan();

        const userInfo = this.userUtilsService.getUserDetails();

        loanDoc.DocumentId = 1;

        formData.append('Description', loanDoc.Description);

        formData.append('PageNumber', loanDoc.PageNumber.toString());

        formData.append('ReferenceNo', loanDoc.DocumentRefNo.toString());

        formData.append('OwnerName', userInfo.User.UserName);

        formData.append('LoanCaseID', loanCaseNo);

        formData.append('ParentDocId', loanDoc.ParentDocId.toString());

        formData.append('CreatedUpdatedBy', userInfo.User.UserName);

        formData.append('EnteredBy', userInfo.User.UserName);

        formData.append('file', loanDoc.file);


        console.log('File Data', formData.get('file'));
        console.log('RefrenceNo data', formData.get('ReferenceNo'));
        console.log('Description data', formData.get('Description'));
        console.log('Page number data', formData.get('PageNumber'));
        console.log('Owner Name', formData.get('OwnerName'));
        console.log('Loan case id', formData.get('LoanCaseID'));
        console.log('Parent Doc Id ', formData.get('ParentDocId'));
        console.log('Created updated by', formData.get('CreatedUpdatedBy'));
        console.log('Entered by', formData.get('EnteredBy'));

        return this.http.post<any>(`${environment.apiUrl}/Loan/DocumentUpload`, formData,
        ).pipe(
            map((res: BaseResponseModel) => res)
        );


    }

    GetViewLoanDocument(app) {
        this.request = new BaseRequestModel();
        const userInfo = this.userUtilsService.getUserDetails();
        let selectedCircleId = '';

        if (userInfo.UserCircleMappings.length > 0) {
            userInfo.UserCircleMappings.forEach((value, key) => {

                if (userInfo.UserCircleMappings.length === (key + 1)) {
                    selectedCircleId += value.CircleId;
                } else {
                    selectedCircleId += value.CircleId + ',';
                }
            });
        }

        this.request.Circle = {
            CircleIds: selectedCircleId
        };
        this.request.TranId = 0;
        this.activity.ActivityID = 1;
        this.request.ViewDocumnets =
            {
                ID: app,
                Type: '2'
            };
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);
        return this.http.post(`${environment.apiUrl}/Recovery/GetViewLoanDocument`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    searchLoanApplication(loanFilter: SearchLoan) {

        const userInfo = this.userUtilsService.getUserDetails();
        let selectedCircleId = '';

        if (userInfo.UserCircleMappings.length > 0) {
            userInfo.UserCircleMappings.forEach((value, key) => {

                if (userInfo.UserCircleMappings.length === (key + 1)) {
                    selectedCircleId += value.CircleId;
                } else {
                    selectedCircleId += value.CircleId + ',';
                }
            });
        }


        this.activity.ActivityID = 1;
        const selectedZone = {
            Id: 0,
            ZoneId: loanFilter.ZoneId,
            ZoneName: ''
        };

        const selectedBranch = {
            BranchId: loanFilter.BranchId,
            Id: 0,
            Name: '',
            WorkingDate: ''
        };
        const selectedCircle = {
            CircleIds: selectedCircleId
        };
        const request = {
            Loan: loanFilter,
            TranId: 0,
            User: userInfo.User,
            Zone: selectedZone,
            Activity: this.activity,
            Branch: userInfo.Branch,
            Circle: selectedCircle
        };


        const req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/Loan/SearchLoanApplication`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    getORRDropDowns() {
        this.request = new BaseRequestModel();

        this.request.TranId = 0;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/GetORRDropDowns`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    saveOrr(orrRequest: any) {
        this.request = new BaseRequestModel();

        const loanInfo = new Loan();
        loanInfo.ORR = orrRequest;
        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/SaveORR`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    getLoanDetails(LcNo: any, LoanAppID) {

        const userInfo = this.userUtilsService.getUserDetails();
        const branch = {
            BranchId: userInfo.Branch.BranchId
        };
        const loan = {
            LcNo: LcNo,
            ApplicationHeader: {
                LoanAppID: LoanAppID
            }
        };

        const request = {
            Branch: userInfo.Branch,
            Loan: loan
        };

        const req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/Loan/GetLoanDetails`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    saveLoanDbr(dbrReq: LoanDbr, tranId: number) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.DBR = dbrReq;
        this.request.Loan = loanInfo;
        this.request.TranId = tranId;
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/SaveDBR`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    searchLoanDbr(loanFilter: SearchLoanDbr) {

        const userInfo = this.userUtilsService.getUserDetails();
        let selectedCircleId = '';

        if (userInfo.UserCircleMappings.length > 0) {
            userInfo.UserCircleMappings.forEach((value, key) => {
                if (userInfo.UserCircleMappings.length === (key + 1)) {
                    selectedCircleId += value.CircleId;
                } else {
                    selectedCircleId += value.CircleId + ',';
                }
            });
        }


        this.activity.ActivityID = 1;
        const loanDBR = {
            DBR: loanFilter
        };

        const selectedCircle = {
            CircleIds: selectedCircleId
        };
        const request = {
            Loan: loanDBR,
            TranId: 0,
            User: userInfo.User,
            Zone: userInfo.Zone,
            Activity: this.activity,
            Branch: userInfo.Branch,
            Circle: selectedCircle
        };

        const req = JSON.stringify(request);

        return this.http.post(`${environment.apiUrl}/Loan/GetDBR`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }


    deleteCustomerLoanApplication(custLoanAppId) {
        this.request = new BaseRequestModel();
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const loanInfo = new Loan();
        loanInfo.CustomersLoanApp = new CustomersLoanApp();
        loanInfo.CustomersLoanApp.CustLoanAppID = custLoanAppId;

        this.request.Loan = loanInfo;

        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/DeleteCustomerLoanApplication`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    deletePurposeLoanApplication(custLoanAppId) {
        this.request = new BaseRequestModel();
        const userInfo = this.userUtilsService.getUserDetails();
        this.request.User = userInfo.User;
        this.request.Zone = userInfo.Zone;
        this.request.Branch = userInfo.Branch;
        this.activity.ActivityID = 1;
        this.request.Activity = this.activity;
        const loanInfo = new Loan();
        loanInfo.CustomersLoanApp = new CustomersLoanApp();
        loanInfo.CustomersLoanApp.CustLoanAppID = custLoanAppId;

        this.request.Loan = loanInfo;

        const req = JSON.stringify(this.request);


        return this.http.post(`${environment.apiUrl}/Loan/DeleteLoanpurpose`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    documentDelete(docId) {
        const req;
        return this.http.post(`${environment.apiUrl}/Loan/DocumentDelete`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );

    }

    deleteLegalHeirs(legalId, loan) {

        this.request = new BaseRequestModel();
        const loanInfo = new Loan();
        loanInfo.LoanApplicationLegalHeirs = new LoanApplicationLegalHeirs();

        loanInfo.LoanApplicationLegalHeirs.LoanAppID = loan;
        loanInfo.LoanApplicationLegalHeirs.ID = legalId;
        this.request.Loan = loanInfo;
        this.request.TranId = 0;
        const req = JSON.stringify(this.request);

        return this.http.post(`${environment.apiUrl}/Loan/DeleteLegalHeirs`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    deletePurpose(purposeId) {

        const req;
        return this.http.post(`${environment.apiUrl}/Loan/DeleteLoanpurpose`, req,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }
}
