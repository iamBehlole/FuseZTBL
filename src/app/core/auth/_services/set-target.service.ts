import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpUtilsService } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Activity } from '../_models/activity.model';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model';
import { UserUtilsService } from '../../_base/crud/utils/user-utils.service';
import { LoanApplicationLegalHeirs, PersonalSureties, CorporateSurety, LoanRefrences, LoanWitness, LoanPastPaid, LoanDocumentCheckList, CurrentLoans, GlConfigrationsDetail, ORR, CropProduction, AppraisalProposed, LoanDocuments, SearchLoan, LoanDbr, SearchLoanDbr  } from '../_models/loan-application-header.model';

import { Customer, DeceasedCustomer } from '../_models/deceased-customer.model';
import { Observable } from 'rxjs';

import { CommonService } from './common.service';
import { DatePipe } from '@angular/common'


@Injectable({
  providedIn: 'root'
})
export class SetTargetService {

  dod: Date;

  public request = new BaseRequestModel();
  public activity = new Activity();

  constructor(
    private http: HttpClient,
     private httpUtils: HttpUtilsService,
     private userUtilsService: UserUtilsService,
     private datePipe: DatePipe,
    private _common: CommonService) { }

  GetDeceasedCustomer(form){

    debugger
    var deceasedInfo = new Customer();
    deceasedInfo = form         
    this.request = new BaseRequestModel();
    this.request.Customer = deceasedInfo
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Customer/GetDeceasedCustomer`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  GetTragetDuration(){

    debugger

    var userInfo = this.userUtilsService.getUserDetails();
    debugger
    this.request.User = userInfo.User;    
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;

    var deceasedInfo = new Customer();
    this.request = new BaseRequestModel();
    // this.request.Customer = deceasedInfo
    this.request.TranId = 2830;

    var circle = userInfo.UserCircleMappings;
    var circleIds = [];
    
    circle.forEach(element => {
      circleIds.push(element.CircleId);
    });
    var _circles = JSON.stringify(circleIds)

    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "0.000000",
      LONG: "0.000000",
      SRC: "GPS"
    },
    
    this.request.Circle={
      CircleIds: _circles
    },

    this.request.doPerformOTP = false;

    var req = JSON.stringify(this.request);

    debugger
    return this.http.post(`${environment.apiUrl}/Target/GetTragetDuration`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  GetTargets(value:string){

    debugger
    var deceasedInfo = new Customer();
    this.request = new BaseRequestModel();

    this.request.Target = {
      Duration : value,
      Targets : null
    }
    this.request.Target["Targets"] = null;
    this.request.TranId = 2830;

    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "0.00000",
      LONG: "0.000000",
      SRC: "GPS"
    },

    this.request.Circle={
      CircleIds: "53444,53443,53442,53441"
    },

    this.request.doPerformOTP = false;

    var userInfo = this.userUtilsService.getUserDetails();
    debugger
    this.request.User = userInfo.User;
    // this.request.User = {
    //   UserId : "B-44"
    //       }
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    // console.log(req);
    debugger
    return this.http.post(`${environment.apiUrl}/Target/GetTargets`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }


  saveTargets(targets,Duration,AssignedTarget){

    debugger;
    this.request = new BaseRequestModel();
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.Circle={
      CircleIds: "53444,53443,53442,53441"
    },

    this.request.DEVICELOCATION={
      BTSID :"0",
      BTSLOC : "",
      LAT: "33.65898",
      LONG: "73.057665",
      SRC: "GPS"
    },

    
    this.request.TranId = 2830;
    
    this.request.doPerformOTP = false;

    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;

    this.request.User = userInfo.User;
    // this.request.User["UserId"] = "B-44";

    this.request.Target= {"Targets":targets};
   
    this.request.Target.Duration=Duration;
    this.request.Target.AssignedTarget=AssignedTarget;
    
    // this.request.Target["AssignedTarget"]=AssignedTarget;
    
    var req = JSON.stringify(this.request);
    console.log(req);
    debugger

      return this.http.post<any>(`${environment.apiUrl}/Target/AddUpdateTarget`, this.request,
    ).pipe(
      map((res: BaseResponseModel) => res)
    );
    }

    submitTargets(Duration){

      debugger;
      this.request = new BaseRequestModel();
      var userInfo = this.userUtilsService.getUserDetails();
      this.request.Circle={
        CircleIds: "53444,53443,53442,53441"
      },
  
      this.request.DEVICELOCATION={
        BTSID :"0",
        BTSLOC : "",
        LAT: "33.65898",
        LONG: "73.057665",
        SRC: "GPS"
      },
      
      this.request.TranId = 2830;
      this.request.doPerformOTP = false;
      this.request.Zone = userInfo.Zone;
      this.request.Branch = userInfo.Branch;
      this.request.User = userInfo.User;
      this.request.Target= {"Targets":null}
      this.request.Target.Duration=Duration.toString();
      var req = JSON.stringify(this.request);
      console.log(req);
      debugger
  
        return this.http.post<any>(`${environment.apiUrl}/Target/SubmitTarget`, this.request,
      ).pipe(
        map((res: BaseResponseModel) => res)
      );
      }

  


  GetListOfRejectedDeceasedPerson(){
    
    var deceasedInfo = new Customer();
    this.request = new BaseRequestModel();
    deceasedInfo.Cnic = ''
    this.request.Customer = deceasedInfo
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);
    debugger
    return this.http.post(`${environment.apiUrl}/Customer/GetListOfRejectedDeceasedPerson`, req,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }

  SubmitCustomerNADRA(){


    
    this.request = new BaseRequestModel();
    this.request.TranId = 0;
    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.request.Zone = userInfo.Zone;
    this.request.Branch = userInfo.Branch;
    this.activity.ActivityID = 1;
    this.request.Activity = this.activity;
    var req = JSON.stringify(this.request);

    return this.http.post(`${environment.apiUrl}/Customer/SubmitCustomerNADRA`, req,
    { headers: this.httpUtils.getHTTPHeaders() }).pipe(
      map((res: BaseResponseModel) => res)
    );
  }
}
