import { Loan } from '../../../auth/_models/loan-application-header.model';
import { LovData } from '../../../auth/_models/lov.class';

export class BaseResponseModel {
  Code: string;
  Success: boolean; // Admin
  Message: string;
  isWebOTPEnabled: boolean;
  Activities: any;
  MenuBar: [];
  ProfileActivityDtos: any;
  Circles: any;
  Employees: any;
  Ftb: number;
  ErrorLog: any;
  circleLocations: any;
  UserHistory: any;
  ErrorLogs: any;
  circleSinglePoints: any;
  DocumentTypes: any;
  Configurations: any;
  UserHistories: any;
  Profiles: any;
  _3RdPartyAPILogs: any;
  _3RdPartyAPILog: any;
  Channels: any;
  Ecib: any;
  customerNDC: any;
  Notifications: any;
  Zones: any;
  Zone: any;
  Branch: any;
  UserCircleMappings: any;
  Branches: any;
  UserTypes: any;
  Customers: any;
  Customer: any;
  GeoFancPoints: any;
  Users: any;
  User: any;
  searchLandData: any;
  CustomerLandRelationList: any;
  Recovery: any;
  sessionID: string;
  channelID: number;
  Token: string;
  RefreshToken: string;
  LandInfo: any;
  LandHistoryList: any;
  LandInfoDetailsList: any;
  RecoveryCounts: any;
  LandInfoDataList: any;
  ChargeCreation: any;
  ChargeCreationDetailList: any;
  TokenExpirayTime: string;
  NotificationCount: string;
  TranId: number;
  ecibListFull: any;
  SubProposalGLList: any;
  LovData: LovData;
  LOVs: object;
  ViewDocumnets: any;
  Loan: any;
  JournalVoucher: any;
  SeedKhadVendor: any;
  CanCollectRecoveryForAllMCO: boolean;
  DeceasedCustomer:any;
  ViewDocumnetsList:any;
  Target:any;
  Heading:any;
  LoanUtilization:any;
  BorrowerInfo: any;
  VillageBenchMarking: any;
  TourPlanAndDiaryDto:any;
  TourPlan:any;
}