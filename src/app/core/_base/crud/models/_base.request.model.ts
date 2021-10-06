import {CashRequest} from './_common-models/cash-request';
import {DeviceLocation} from './_common-models/device-location';
import {ClientDeviceInfo} from './_common-models/client-device-info';
import {Loan} from '../../../auth/_models/loan-application-header.model';
import {DeceasedCustomer} from '../../../auth/_models/deceased-customer.model';

import {MarkDeceasedCustomer} from '../../../auth/_models/deceased-customer.model';

export class BaseRequestModel {
  public Activities: object;
  public Activity: object;
  public Profile: object;
  public User: object;
  public Zone: object;
  public UserInfo: object;
  public Customer: object;
  public Branch: object;
  public UserPasswordDetails: object;
  public Notification: object;
  public ReportFilters: object;
  public Circle: object;
  public Configuration: object;
  public UserHistory: object;
  public DocumentType: object;
  public LandInfo: object;
  public LandInfoDetail: object;
  public LandInfoData: object;
  public ViewDocumnets: object;
  public Rescheduling: object;
  public ChargeCreation: object;
  public ChargeCreationDetail: any[] = [];
  public CustomerLandRelation: object;
  public LandInfoDetailsList: any[] = [];
  public TranId: number;
  public Loan: Loan;
  public Deceased: DeceasedCustomer;
  public SearchData: object;
  public MarkDeceasedCustomer: MarkDeceasedCustomer;
  public DEVICELOCATION: any;
  public doPerformOTP: any;
  public Target: any;
  public Heading: any;
  public LoanUtilization: any;
  public ChangesTourPlanStatusDto:any;
  public TourPlan: any;
  public  OTP : OTP;
  Token :any
  RefreshToken:any

}

export class OTP {
  Id: any
  Text: any
  Hash: any
  ResendTime: any

}


