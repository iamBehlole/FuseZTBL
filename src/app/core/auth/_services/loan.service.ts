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
import { LoanApplicationLegalHeirs, PersonalSureties, CorporateSurety, LoanRefrences, LoanWitness, LoanPastPaid, LoanDocumentCheckList, CurrentLoans, GlConfigrationsDetail, ORR, CropProduction, AppraisalProposed, LoanDocuments, SearchLoan, LoanDbr, SearchLoanDbr  } from '../_models/loan-application-header.model';

import { CustomersLoanApp, Loan, LoanApplicationPurpose, LoanSecurities, LoanApplicationHeader, CustomersLoanLand } from '../_models/loan-application-header.model';
import { Branch } from '../_models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  public request = new BaseRequestModel();
  public activity = new Activity();


  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private userUtilsService: UserUtilsService) { }

  saveApplicationHeader(loanReq: LoanApplicationHeader): Observable<BaseResponseModel>{
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.ApplicationHeader = loanReq;

    this.request.Loan = loanInfo;
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Loan/SaveApplicationHeader`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  saveLoanApplicationPurpose(loanReq: LoanApplicationPurpose, tranId: number): Observable<BaseResponseModel> {
    debugger
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.LoanApplicationpurpose = loanReq;

    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Branch = userInfo.Branch;
    this.request.Zone = userInfo.Zone;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/SaveLoanApplicationpurpose`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  generateNewAutoLc(branch: Branch) {

    this.request = new BaseRequestModel();
    this.request.Branch = branch;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Loan/GenrateNewLc`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getCustomerLand(loanAppId) {
    this.request = new BaseRequestModel();
    this.request.Loan = new Loan();
    this.request.Loan.ApplicationHeader = new LoanApplicationHeader();
    this.request.Loan.ApplicationHeader.LoanAppID = loanAppId;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Loan/GetLoanLand`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );


  }

  saveLoanSecurities(securitiesReq: LoanSecurities, tranId: number) {
    debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();

    var userInfo = this.userUtilsService.getUserDetails();


    loanInfo.LoanSecurities = securitiesReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    
    var a = userInfo.User.UserId
    loanInfo.LoanSecurities.EnteredBy = a
    
    var selectedCircleId = "";
    loanInfo.LoanSecurities.OrgUnitID = userInfo.Branch.BranchId

    if (userInfo.UserCircleMappings.length > 0) {
      userInfo.UserCircleMappings.forEach(function (value, key) {
        if (userInfo.UserCircleMappings.length == (key + 1)) {
          selectedCircleId += value.CircleId;
        }
        else {
          selectedCircleId += value.CircleId + ",";
        }
      })
    }
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Circle = {

      "CircleIds": selectedCircleId

    }

    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveLoanSecurities`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  saveCustomerWithLoanApp(customerLoanReq: CustomersLoanApp, tranId : number) {
     debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.CustomersLoanApp = customerLoanReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveCustomerWithLoanApp`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  saveLoanApplicationLegalHeirs(legalheirsReq: LoanApplicationLegalHeirs, tranId: number, loanId: number) {
     debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.LoanApplicationLegalHeirs = legalheirsReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Loan.LoanApplicationLegalHeirs.UserID = userInfo.User.UserId;
    this.request.Loan.LoanApplicationLegalHeirs.LoanAppID = loanId
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveLoanApplicationLegalheirs`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  saveUpdatePersonalSureties(personalSureties: PersonalSureties, tranId: number) {
     debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.PersonalSureties = personalSureties;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveUpdatePersonalSureties`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  saveUpdateCorporateSurety(corporateSurety: CorporateSurety, tranId: number) {
     debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.CorporateSurety = corporateSurety;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/Saveupdatecorporatesurety`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  saveUpdateReferences(loanRefrences: LoanRefrences, tranId: number) {
    debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.LoanRefrences = loanRefrences;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveupdateReferences`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  SaveUpdateWitnesses(loanWitness: LoanWitness, tranId: number) {
     debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.LoanWitness = loanWitness;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveupdateWitnesses`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }



  SaveUpdatePastPaidLoans(loanPastPaid: LoanPastPaid, tranId: number) {
    debugger
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.LoanPastPaid = loanPastPaid;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Loan/SaveupdatePastPaidLoans`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }




  getDocumentNo(TranId: any) {
    this.request = new BaseRequestModel();
    this.request.TranId = TranId;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Loan/GetDocumentNo`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }



  getCheckList(loanReq: LoanApplicationHeader, tranId: number) {
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.ApplicationHeader = loanReq;

    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/GetCheckList`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  saveCheckList(loanReq: LoanDocumentCheckList[], tranId: number) {
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.LoanDocumentCheckList = loanReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/SaveCheckList`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  submitLoanApplication(loanReq: LoanApplicationHeader, tranId: number) {
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.ApplicationHeader = loanReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/SubmitLoanApplication`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  saveUpdateCurrentLoans(loanReq: CurrentLoans, tranId: number) {
     debugger
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.CurrentLoans = loanReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger

    return this.http.post(`${environment.apiUrl}/Loan/SaveupdateCurrentLoans`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  attachCustomersLand(customerLandList: CustomersLoanLand[], tranId: number) {
     
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.CustomersLoanLands = customerLandList;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/AttachCustomersLand`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  SearchGLCode(loanReq: GlConfigrationsDetail) {

     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.GlConfigrationsDetail = loanReq;
    this.request.Loan = loanInfo;
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/SearchGLCode`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  addCropDetail(cropProd: CropProduction, tranId: number) {
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.CropProduction = cropProd;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/AddCropDetail`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  addAppraisalProposed(appraisalList: AppraisalProposed[], tranId: number) {
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.AppraisalProposedList = appraisalList;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/AddAppraisalProposed`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  getORRDropDownByAppID(loanAppID:string) {
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    var oRR = new ORR();
    oRR.LoanAppID = 2016727529;
    loanInfo.ORR = oRR;
    this.request.Loan = loanInfo;
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/GetORRDropDownByAppID`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  deleteAppraisalItemDetail(appraisal: AppraisalProposed, tranId: number) {
     
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    loanInfo.AppraisalProposed = appraisal;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
      var req = JSON.stringify(this.request);

      return this.http.post(`${environment.apiUrl}/Loan/DeleteAppraisalItemDetail`, req,
          { headers: this.httpUtils.getHTTPHeaders() }).pipe(
              map((res: BaseResponseModel) => res)
          );
  }

//  documentUpload(loanDoc: LoanDocuments, tranId: number) {
     
//    tranId= 12121
//    const formData = new FormData();
//    loanDoc.DocumentId = 1;
//    if (loanDoc.DocumentId != undefined, loanDoc.DocumentId != null) {
//      formData.append('DocumentId', loanDoc.DocumentId.toString());
//    }
//    if (loanDoc.Description != undefined, loanDoc.Description != null)
//    {
//      formData.append('Description', loanDoc.Description.toString());
//  }
//    if (loanDoc.PageNumber != undefined, loanDoc.PageNumber != null)
//    {
//formData.append('PageNumber', loanDoc.PageNumber.toString());
//}
//    if (loanDoc.DocumentNumber != undefined, loanDoc.DocumentNumber != null)
//    {
//  formData.append('DocumentNumber', loanDoc.DocumentNumber.toString());
//}
//    if (loanDoc.OwnerName != undefined, loanDoc.OwnerName != null)
//    {
//  formData.append('OwnerName', loanDoc.OwnerName.toString());
//}
//    if (loanDoc.LoanCaseID != undefined, loanDoc.LoanCaseID != null)
//    {
//  formData.append('LoanCaseID', loanDoc.LoanCaseID.toString());
//}
//    if (loanDoc.ParentDocId != undefined, loanDoc.ParentDocId != null)
//    {
//  formData.append('ParentDocId', loanDoc.ParentDocId.toString());
//}
//    if (loanDoc.CreatedUpdatedBy != undefined, loanDoc.CreatedUpdatedBy != null)
//    {
//  formData.append('CreatedUpdatedBy', loanDoc.CreatedUpdatedBy.toString());
//}
//    if (loanDoc.EnteredBy != undefined, loanDoc.EnteredBy != null)
//    {
//  formData.append('EnteredBy', loanDoc.EnteredBy.toString());
//}
//    if (loanDoc.file != undefined, loanDoc.file != null)
//    {
//  formData.append('file', loanDoc.file);
//}
//    return this.http.post<any>(`${environment.apiUrl}/Loan/DocumentUpload`, formData,
//    ).pipe(
//      map((res: BaseResponseModel) => res)
//    );


//  }
  documentUpload(loanDoc: LoanDocuments, tranId: number, loanCaseNo : string) {
    debugger
    tranId = 12121
    var formData = new FormData();
    var loanInfo = new Loan();

    var userInfo = this.userUtilsService.getUserDetails();

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


    debugger

    console.log("File Data",formData.get('file'));
    console.log("RefrenceNo data", formData.get('ReferenceNo'));
    console.log("Description data",formData.get('Description'));
    console.log("Page number data",formData.get('PageNumber'));
    console.log("Owner Name",formData.get('OwnerName'));
    console.log("Loan case id",formData.get('LoanCaseID'));
    console.log("Parent Doc Id ",formData.get('ParentDocId'));
    console.log("Created updated by",formData.get('CreatedUpdatedBy'));
    console.log("Entered by",formData.get('EnteredBy'));
    debugger
    return this.http.post<any>(`${environment.apiUrl}/Loan/DocumentUpload`, formData,
    ).pipe(
      map((res: BaseResponseModel) => res)
    );


  }

  GetViewLoanDocument(app) {
    debugger
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    var selectedCircleId = "";

    if (userInfo.UserCircleMappings.length > 0) {
      userInfo.UserCircleMappings.forEach(function (value, key) {

        if (userInfo.UserCircleMappings.length == (key + 1)) {
          selectedCircleId += value.CircleId;
        }
        else {
          selectedCircleId += value.CircleId + ",";
        }
      })
    }

    this.request.Circle = {
      CircleIds: selectedCircleId
    }
    this.request.TranId = 0
    this.activity.ActivityID = 1;
    this.request.ViewDocumnets =
    {
      ID : app,
      Type: "2"
    }
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.request.Activity = this.activity
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Recovery/GetViewLoanDocument`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
    );

  }

  searchLoanApplication(loanFilter: SearchLoan) {
     
    var userInfo = this.userUtilsService.getUserDetails();
    var selectedCircleId = "";

    if (userInfo.UserCircleMappings.length > 0) {
      userInfo.UserCircleMappings.forEach(function (value, key) {
         
        if (userInfo.UserCircleMappings.length == (key + 1)) {
          selectedCircleId += value.CircleId;
        }
        else {
          selectedCircleId += value.CircleId+",";
        }
      })
    }
    

    this.activity.ActivityID = 1;
    var selectedZone = {
      Id: 0,
      ZoneId: loanFilter.ZoneId,
      ZoneName : ""
    }

    var selectedBranch = {
      BranchId: loanFilter.BranchId,
      Id: 0,
      Name: "",
      WorkingDate : "" 
    }
    var selectedCircle = {
      CircleIds: selectedCircleId
    }
    var request = {
      Loan : loanFilter,
      TranId: 0,
      User: userInfo.User,
      Zone: selectedZone,
      Activity: this.activity,
      Branch: userInfo.Branch,
      Circle : selectedCircle
    }
    
    
    var req = JSON.stringify(request);

    return this.http.post(`${environment.apiUrl}/Loan/SearchLoanApplication`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  getORRDropDowns() {
    this.request = new BaseRequestModel();

    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/GetORRDropDowns`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  saveOrr(orrRequest:any) {
    this.request = new BaseRequestModel();

    var loanInfo = new Loan();
    //var oRR = new ORR();
    //oRR = orrRequest;
    loanInfo.ORR = orrRequest;
    this.request.Loan = loanInfo;
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/SaveORR`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  getLoanDetails(LcNo: any, LoanAppID) {
    debugger

    var userInfo = this.userUtilsService.getUserDetails();
    var branch = {
      BranchId: userInfo.Branch.BranchId
    }
    var loan = {
      LcNo: LcNo,
      ApplicationHeader: {
        LoanAppID: LoanAppID
      }
    }

    var request = {
      Branch: userInfo.Branch,
      Loan: loan
    }

    var req = JSON.stringify(request);
     
    return this.http.post(`${environment.apiUrl}/Loan/GetLoanDetails`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  saveLoanDbr(dbrReq: LoanDbr, tranId: number) {
     
    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.DBR = dbrReq;
    this.request.Loan = loanInfo;
    this.request.TranId = tranId;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Loan/SaveDBR`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  searchLoanDbr(loanFilter: SearchLoanDbr) {
     
    var userInfo = this.userUtilsService.getUserDetails();
    var selectedCircleId = "";

    if (userInfo.UserCircleMappings.length > 0) {
      userInfo.UserCircleMappings.forEach(function (value, key) {
        if (userInfo.UserCircleMappings.length == (key + 1)) {
          selectedCircleId += value.CircleId;
        }
        else {
          selectedCircleId += value.CircleId + ",";
        }
      })
    }


    this.activity.ActivityID = 1;
    var loanDBR = {
      DBR: loanFilter
    }
    //var selectedZone = {
    //  Id: 0,
    //  ZoneId: loanFilter.ZoneId,
    //  ZoneName: ""
    //}

    //var selectedBranch = {
    //  BranchId: loanFilter.BranchId,
    //  Id: 0,
    //  Name: "",
    //  WorkingDate: ""
    //}
    var selectedCircle = {
      CircleIds: selectedCircleId
    }
    var request = {
      Loan: loanDBR,
      TranId: 0,
      User: userInfo.User,
      Zone: userInfo.Zone,
      Activity: this.activity,
      Branch: userInfo.Branch,
      Circle: selectedCircle
    }

    var req = JSON.stringify(request);
     
    return this.http.post(`${environment.apiUrl}/Loan/GetDBR`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }


  deleteCustomerLoanApplication(custLoanAppId) {
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var loanInfo = new Loan();
    loanInfo.CustomersLoanApp = new CustomersLoanApp();
    loanInfo.CustomersLoanApp.CustLoanAppID = custLoanAppId;

    this.request.Loan = loanInfo;

    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/DeleteCustomerLoanApplication`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  deletePurposeLoanApplication(custLoanAppId) {
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var loanInfo = new Loan();
    loanInfo.CustomersLoanApp = new CustomersLoanApp();
    loanInfo.CustomersLoanApp.CustLoanAppID = custLoanAppId;

    this.request.Loan = loanInfo;

    var req = JSON.stringify(this.request);


    return this.http.post(`${environment.apiUrl}/Loan/DeleteLoanpurpose`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }

  documentDelete(docId) {
    debugger
var req

    return this.http.post(`${environment.apiUrl}/Loan/DocumentDelete`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );

  }
  deleteLegalHeirs(legalId, loan) {
    debugger

    this.request = new BaseRequestModel();
    var loanInfo = new Loan();
    loanInfo.LoanApplicationLegalHeirs = new LoanApplicationLegalHeirs();

    loanInfo.LoanApplicationLegalHeirs.LoanAppID = loan
    loanInfo.LoanApplicationLegalHeirs.ID = legalId
    this.request.Loan = loanInfo;
    this.request.TranId = 0
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Loan/DeleteLegalHeirs`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  deletePurpose(purposeId) {

  debugger
  var req
    return this.http.post(`${environment.apiUrl}/Loan/DeleteLoanpurpose`, req,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
}
}
