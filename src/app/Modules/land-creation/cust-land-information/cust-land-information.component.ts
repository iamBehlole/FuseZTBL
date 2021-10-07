
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LandChargeCreationComponent } from '../land-charge-creation/land-charge-creation.component';
import { finalize, takeUntil } from 'rxjs/operators';
import { AreaConvertorComponent } from '../area-convertor/area-convertor.component';
import { LandFilesUploadComponent } from '../land-files-upload/land-files-upload.component';
import { LandHistoryComponent } from '../land-history/land-history.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerListDialogComponent } from '../customer-list-dialog/customer-list-dialog.component';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateAdapter} from 'angular-calendar';
import {DateFormats, Lov, LovConfigurationKey, MaskEnum} from '../../../core/auth/_models/lov.class';
import {CreateCustomer} from '../../../core/auth/_models/customer.model';
import {BaseRequestModel} from '../../../core/_base/crud/models/_base.request.model';
import {LandInfoDetails} from '../../../core/auth/_models/land-info-details.model';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import { CustomerLandRelation } from 'app/core/auth/_models/customer-land-relation.model';
import {CustomerService} from '../../../core/auth/_services/customer.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {CommonService} from '../../../core/auth/_services/common.service';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {LandService} from '../../../core/auth/_services/land.service';
import {LovService} from '../../../core/auth/_services/lov.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {KtDialogService} from '../../../core/_base/layout';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {AppState} from '../../../core/reducers';
import {LandInfo}from '../../../core/auth/_models/land-info.model';
import {MatDialog} from '@angular/material/dialog';
import {Zone}from '../../../core/auth/_models/zone.model';


@Component({
  selector: 'kt-cust-land-information',
  templateUrl: './cust-land-information.component.html',
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class CustLandInformationComponent implements OnInit {

  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  ownerChecked = true;
  ShowTable: boolean = false;
  ShowError: boolean;
  AllowchargeCreation: boolean;
  AllowDocumentUpload: boolean;
  AllowSubmit: boolean;
  SaveCustomer = false;
  remove: boolean;
  errorShow: boolean;
  loading: boolean;
  NumberOfCustomerDisable: boolean;
  submitted = false;
  TrainId: number;
  hasHistoryLandInfoId: boolean = false;
  LandInformationForm: FormGroup;

  navigationSubscription;

  public createCustomer = new CreateCustomer();
  public SearchDataCustomer = new CreateCustomer();

  public SearchDataCustomerBackup: CreateCustomer[] = [];

  public maskEnums = MaskEnum;

  public LovCall = new Lov();

  public request = new BaseRequestModel();

  public LandInfo = new LandInfo();

  public LandInfoDetail: LandInfoDetails[] = [];
  alphas: any[] = [];

  public CustomerLandRelation = new CustomerLandRelation();

  public PostCodeLov: any;
  public PostCodeLovFull: any;
  public LandingProcedureLov: any;

  private _onDestroy = new Subject<void>();

  public CustomerLov: any;
  public BranchLov: any;
  public ZoneLov: any;
  public selectedCustomerID: any;
  public errorMessage: any;
  public errorMessageLand: any;

  public searchFilterCtrlPostCode: FormControl = new FormControl();

  public Zone = new Zone();

  // Objects for Get Data

  LandInfoDetailsList: any;
  LandInfoDataList: any;
  ChargeCreation: any;
  ChargeCreationDetailList: any;
  customerLandRelation: any;

  LoginUserInfo: any;

  //Cnic: "3377315953499"
  //CurrentAddress: "102/D"
  //CustomerName: "IRSHAD AHMAD"
  //CustomerNumber: "102-3396"
  //CustomerStatus: "A"
  //Dob: "01011973"
  //FatherName: "MUHAMAD SHARIF"
  //IsBankEmployee: "n"
  //TranId: "0"
  //isBMVSAvailable: false
  //isDocumentAllowed: false
  //isPictureAllowed: false


  // B
  BArea = ""
  BAreaOwned = "";
  BLeasedIn = "";
  BLeasedOut = "";
  BFimalyOperated = "";
  BUnderCustomhiring = "";
  BTotal = 0;

  // I

  IArea = "";
  IAreaOwned = "";
  ILeasedIn = "";
  ILeasedOut = "";
  IFimalyOperated = "";
  IUnderCustomhiring = "";
  ITotal = 0;

  // U

  UnArea = "";
  UnAreaOwned = "";
  UnLeasedIn = "";
  UnLeasedOut = "";
  UnFimalyOperated = "";
  UnUnderCustomhiring = "";
  UnTotal = 0;

  // UA

  UnAArea = "";
  UnAAreaOwned = "";
  UnALeasedIn = "";
  UnALeasedOut = "";
  UnAFimalyOperated = "";
  UnAUnderCustomhiring = "";
  UnATotal = 0;

  // TA

  AreaTotal: any
  AreaOwnedTotal: any
  LeasedInTotal: any
  LeasedOutTotal: any
  FamilyOperatedTotal: any
  UnderCustomHiringTotal: any
  TotalOfTotal = 0;
  isEditMode: any;
  LandInfoSearchData: any;
  isFormReadonly: boolean;

  zoneLovAll: any;
  branchLovAll: any;

  clearSaveCustomerButtonHide: boolean;

  landDetailMarlaPlaceholder: string = "0";

  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};

  isLandHistory: boolean;

  today = new Date();
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private _lovService: LovService,
    private _landService: LandService,
    private _customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private _common: CommonService,
    private _circleService: CircleService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //router.events.subscribe((val: any) => {
    //  //debugger;
    //  if (val.url == "/land-creation/land-info-add") {
    //    console.log("create form");
    //    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //    //this.ngOnInit();
    //    //this.onCreateRestForm();

    //  }
    //});
    //debugger;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        //this.initialiseInvites();
      }
    });
    var CheckEdit = localStorage.getItem("EditLandData");
    if (CheckEdit == '0') {
      localStorage.setItem("SearchLandData", "");
    }
  }


  ngOnInit() {
    debugger
    this.isEditMode = localStorage.getItem("EditLandData");
    if (this.isEditMode != "0") {
      this.LandInfoSearchData = JSON.parse(localStorage.getItem("SearchLandData"));
    }

    this.LandInfo.LandingProcedure = "IP";
    this.isFormReadonly = false;
    //this.IArea = "";
    this.AllowchargeCreation = false;
    this.NumberOfCustomerDisable = false;
    this.AllowDocumentUpload = false;
    this.AllowSubmit = false;
    this.ShowError = false;
    this.remove = false;
    this.loading = false;
    this.isLandHistory = false;
    this.LoadLovs();
    this.GetZones();
    this.createForm();

    this.clearSaveCustomerButtonHide = true;
    // Caste listen for search field value changes
    this.searchFilterCtrlPostCode.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPostCode();
      });

    //debugger;
    //if (this.isFormReadonly) {
    //  const controlsReadonly = this.LandInformationForm.controls;
    //  Object.keys(controlsReadonly).forEach(controlName =>
    //    controlsReadonly[controlName].disable()
    //  );
    //}
    var historyLandInfoId = localStorage.getItem("HistoryLandInfoId");
    debugger;
    var upFlag = this.route.snapshot.params['upFlag'];
    if (upFlag == 1 && historyLandInfoId && this.isEditMode == "1") {
      this.hasHistoryLandInfoId = true;
      localStorage.removeItem("HistoryLandInfoId");
      localStorage.setItem('EditLandData', '0');
      this.GetCustomerAllLandInfoHistory(historyLandInfoId);
      this.isLandHistory = true;
    }

    else if (upFlag == 1 && this.isEditMode == "1") {

      localStorage.setItem('EditLandData', '0');
      this.GetCustomerAllLandInfo(false);
      this.clearSaveCustomerButtonHide = false;

    }
  }



  private filterPostCode() {

    // get the search keyword
    let search = this.searchFilterCtrlPostCode.value;
    this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;

    if (!search) {
      //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

      this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;

    }

    else {
      search = search.toLowerCase();
      this.PostCodeLov.LOVs = this.PostCodeLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
    }

  }


  createForm() {

    debugger;
    var userInfo = this.userUtilsService.getUserDetails();
    this.LoginUserInfo = userInfo;
    //this.BranchLov = userInfo.Branch;
    //this.ZoneLov = userInfo.Zone;
    if (this.LandInfoSearchData !== undefined && this.LandInfoSearchData !== null && this.LandInfoSearchData !== '') {

      debugger;
      //if (userInfo.Branch.BranchCode == "All") {
      //  //this.LandInfo.Zone = this.LandInfoSearchData.Zone[0].ZoneName;
      //  //this.LandInfo.Branch = this.LandInfoSearchData.Branch[0].Name;
      //}
      //else {
      //  //this.LandInfo.Zone = userInfo.Zone.ZoneName;
      //  //this.LandInfo.Branch = userInfo.Branch.Name
      //}





      this.LandInfo.Id = this.LandInfoSearchData.LandInfoID;
      this.LandInfo.BranchId = this.LandInfoSearchData.BranchId;

      if ((this.LandInfoSearchData.Status == '3' || this.LandInfoSearchData.Status == '2') && this.isEditMode == "1") {

        this.isFormReadonly = true;


        localStorage.setItem("SearchLandData", '');
      }


    }

    this.LandInfo.Zone = userInfo.Zone.ZoneName;
    this.LandInfo.Branch = userInfo.Branch.Name

    //this.BranchLov = LandInfo.Zone;
    //this.ZoneLov = LandInfo.Branch;

    //this.LandInfo.Id = LandInfo.LandInfoID;
    //this.LandInfo.BranchId = LandInfo.BranchId;
    // this.LandInfo.Zone = LandInfo.ZoneID;



    this.LandInformationForm = this.formBuilder.group({
      Zone: [this.LandInfo.Zone],
      Branch: [this.LandInfo.Branch],
      PostCode: [this.LandInfo.PostCode, [Validators.required]],
      LandingProcedure: [this.LandInfo.LandingProcedure],
      PassbookNO: [this.LandInfo.PassbookNO, [Validators.required]],
      TotalArea: [this.LandInfo.TotalArea, [Validators.required]],
      DateIssue: [this._common.stringToDate(this.LandInfo.DateIssue), [Validators.required]],
      PlaceofIssuePB: [this.LandInfo.PlaceofIssuePB, [Validators.required]],
      CompleteAddress: [this.LandInfo.CompleteAddress, [Validators.required]],
      LandAutoCode: [this.LandInfo.LandAutoCode],
      NumberOfCustomer: [this.LandInfo.NumberOfCustomer],
      Remarks: [this.LandInfo.Remarks],
      LandCustID: [this.CustomerLandRelation.LandCustID],
    });
  }

  getTitle(): string {

    return "Customer Land Information"
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.LandInformationForm.controls[controlName].hasError(errorName);
  }

  async LoadLovs() {
    //this.ngxService.start();
    this.PostCodeLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.PostalCode })

    this.PostCodeLovFull = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.PostalCode })
    this.PostCodeLovFull.LOVs = this._lovService.SortLovs(this.PostCodeLovFull.LOVs);



    this.PostCodeLov.LOVs = this._lovService.SortLovs(this.PostCodeLov.LOVs);
    this.LandingProcedureLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.LandingProcedure })
    this.LandingProcedureLov.LOVs = this._lovService.SortLovs(this.LandingProcedureLov.LOVs);


    console.log(this.PostCodeLov.LOVs);


    var userInfo = this.userUtilsService.getUserDetails();
    this.BranchLov = userInfo.Branch;
    this.ZoneLov = userInfo.Zone;
    debugger;
  }

  landChargeCreation() {

    debugger;
    this.LandInfo.Id = this.CustomerLov[0].LandInfoID;

    if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != "") {
      this.LandInfo.Status = this.LandInfoSearchData.Status;
    }

    this.LandInfo.UserId = this.CustomerLov[0].CustomerNumber;
    const dialogRef = this.dialog.open(LandChargeCreationComponent, { data: { landInfo: this.LandInfo, landChargCreation: this.ChargeCreation, landChargeCreationDetails: this.ChargeCreationDetailList, TrainId: this.TrainId }, disableClose: true, panelClass: ['full-screen-modal'] });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }
      this.ktDialogService.hide();
      debugger;
      this.ChargeCreation = res.data.ChargeCreation;
      this.ChargeCreationDetailList = res.data.ChargeCreationDetails;

    });

  }

  landUploadFiles() {

    debugger;
    if (this.CustomerLov != undefined) {
      debugger;
      this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
    }
    if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != "") {
      this.LandInfo.Status = this.LandInfoSearchData.Status;
    }

    const dialogRef = this.dialog.open(LandFilesUploadComponent, { data: { landInfo: this.LandInfo, landInfoDataList: this.LandInfoDataList, TrainId: this.TrainId }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }
      debugger;
      this.LandInfoDataList = res.data.uploadDocumentsData;
      this.spinner.hide();
    });

  }

  AreaConvertor() {

    debugger;

    const dialogRef = this.dialog.open(AreaConvertorComponent, { data: {}, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data.TotalArea != undefined)
        this.LandInformationForm.controls['TotalArea'].setValue(res.data.TotalArea);
      debugger;
      if (!res) {
        return;
      }

    });

  }

  clearSaveCustomerLandInfo() {
    if (this.LandInfo.Id) {
      return;
    }
    this.LandInformationForm.controls['PostCode'].setValue("");
    this.LandInformationForm.controls['LandingProcedure'].setValue("");
    this.LandInformationForm.controls['PassbookNO'].setValue("");
    this.LandInformationForm.controls['TotalArea'].setValue("");
    this.LandInformationForm.controls['DateIssue'].setValue("");
    this.LandInformationForm.controls['PlaceofIssuePB'].setValue("");
    this.LandInformationForm.controls['CompleteAddress'].setValue("");
    this.LandInformationForm.controls['LandAutoCode'].setValue("");
    this.LandInformationForm.controls['LandingProcedure'].setValue("");
    //this.LandInformationForm.controls['NumberOfCustomer'].setValue("");
    //this.deleteAllRows();
    debugger;
    //this.dynamicArray = [];

  }

  GetZones() {
    debugger;
    this.loading = true;
    this._circleService.getZones()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

          baseResponse.Zones.forEach(function (value) {
            value.ZoneName = value.ZoneName.split("-")[1];
          })
          this.zoneLovAll = baseResponse.Zones;
        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message);

      });

  }



  GetBranches(ZoneId, branchId) {
    this.loading = true;

    debugger;
    this.Zone.ZoneId = ZoneId;
    this._circleService.getBranchesByZone(this.Zone)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.loading = false;

          //baseResponse.Branches.forEach(function (value) {
          //  value.Name = value.Name.split("-")[1];
          //})
          var branchNameTemp = baseResponse.Branches.filter(x => x.BranchId == branchId)[0]
          this.LandInformationForm.controls['Branch'].setValue(branchNameTemp.Name)
          this.branchLovAll = baseResponse.Branches;

        }

        else
          this.layoutUtilsService.alertElement("", baseResponse.Message);

      });



  }

  saveCustomerLandInfo() {


    debugger;
    this.errorMessageLand = "";
    this.errorShow = false;
    this.hasFormErrors = false;
    if (this.LandInformationForm.invalid) {
      const controls = this.LandInformationForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    this.LandInfo = Object.assign(this.LandInfo, this.LandInformationForm.getRawValue());
    this.LandInfo.BranchId = this.BranchLov.BranchId;
    this.LandInfo.DateIssue = this.datePipe.transform(this.LandInfo.DateIssue, "ddMMyyyy");

    if (this.CustomerLov != undefined && this.CustomerLov != "") {
      this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
    }



    this.LandInfo.customerLandRelation = [];



    if (this.LandInfo.NumberOfCustomer != this.SearchDataCustomerBackup.length) {

      this.errorMessageLand = "Number of Customer must be equal to search Customer";
      return;
    }
    debugger;

    for (var i = 0; i < this.SearchDataCustomerBackup.length; i++) {
      var customer = new CustomerLandRelation();
      customer.IsActive = "Y";
      customer.Cnic = this.SearchDataCustomerBackup[i].Cnic;
      customer.LandInfoID = 0;
      customer.BranchId = this.BranchLov.BranchId;
      customer.IsActive = "Y";
      customer.IsOwner = "Y";
      customer.CustomerName = this.SearchDataCustomerBackup[i].CustomerName;
      customer.FatherName = this.SearchDataCustomerBackup[i].FatherName;
      customer.TotalArea = "";
      customer.EnteredBy = "test";

      this.LandInfo.customerLandRelation.push(customer);
    }



    //if (this.LandInfo.NumberOfCustomer != this.CustomerLov.length) {

    //  this.errorMessageLand = "Number of Customer must be equal to search Customer";
    //  return;
    //}
    //debugger;

    //for (var i = 0; i < this.CustomerLov.length; i++) {
    //  var customer = new CustomerLandRelation();
    //  customer.IsActive = "Y";
    //  customer.Cnic = this.CustomerLov[i].Cnic;
    //  customer.LandInfoID = 0;
    //  customer.BranchId = this.BranchLov.BranchId;
    //  customer.IsActive = "Y";
    //  customer.IsOwner = "Y";
    //  customer.CustomerName = this.CustomerLov[i].CustomerName;
    //  customer.FatherName = this.CustomerLov[i].FatherName;
    //  customer.TotalArea = "";
    //  customer.EnteredBy = "test";

    //  this.LandInfo.customerLandRelation.push(customer);
    //}


    //this.CustomerLandRelation = Object.assign(this.CustomerLandRelation, this.LandInformationForm.getRawValue());

    this.spinner.show();
    this.LandInfo.TotalArea = parseInt(this.LandInfo.TotalArea).toString();
    this._landService
      .saveCustomerLandInfo(this.LandInfo)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        debugger;
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.loadingAfterSubmit = false;
          this.NumberOfCustomerDisable = true;
          this.CustomerLov = baseResponse.CustomerLandRelationList;
          //temp
          this.customerLandRelation = baseResponse.CustomerLandRelationList;
          this.LandInfo.Id = baseResponse.LandInfo.Id;
          this.LandInfo.LandAutoCode = baseResponse.LandInfo.LandAutoCode;
          // this.LandInfo.UserId = 
          this.TrainId = baseResponse.TranId;

          //adding custLandId in dynamic array
          this.dynamicArray.forEach(function (part, index) {
            debugger;
            var tempCustomer = baseResponse.CustomerLandRelationList.filter(x => x.Cnic == this[index].cnic);
            this[index].LandCustID = tempCustomer[0].LandCustID;
          }, this.dynamicArray); // use arr as this

          this.GetCustomerAllLandInfo(true);
          //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          //this.spinner.hide();
        }

      });

  }
  GetCustomerAllLandInfoHistory(historyLandInfoId: string) {
    //this.LandInfo.Id = historyLandInfoId;
    this.spinner.show();
    this._landService.getLandHistoryDetail(this.LandInfo, historyLandInfoId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {



          if (this.LoginUserInfo.User.UserId != baseResponse.LandInfo.EnteredBy && this.LoginUserInfo.Branch.BranchCode != "All")
            this.isFormReadonly = true;

          debugger;
          this.SaveCustomer = true;
          this.NumberOfCustomerDisable = true;
          this.AllowchargeCreation = true;
          this.AllowDocumentUpload = true;
          this.AllowSubmit = true;

          this.LandInfo = baseResponse.LandInfo;
          this.LandInfo.ZoneName = this.LandInfoSearchData.Zone[0].ZoneName;
          this.LandInfoDataList = baseResponse.LandInfoDataList;
          this.LandInfoDetailsList = baseResponse.LandInfoDetailsList;
          this.ChargeCreation = baseResponse.ChargeCreation;
          this.ChargeCreationDetailList = baseResponse.ChargeCreationDetailList;
          this.customerLandRelation = baseResponse.CustomerLandRelationList;

          this.alphas = [];
          var areaOwnByAllCustomer = 0
          if (this.LandInfoDetailsList != undefined) {

            for (var i = 0; i < this.LandInfoDetailsList.length; i++) {
              var landData = []
              for (var j = 0; j < this.LandInfoDetailsList[i].length; j++) {
                if (this.LandInfoDetailsList[i][j].LandCustID != undefined && this.LandInfoDetailsList[i][j].LandCustID != null &&
                  this.LandInfoDetailsList[i][j].LandCustID != '') {
                  landData.push(this.LandInfoDetailsList[i][j])
                }
              }
              if (landData.length > 0) {
                this.alphas.push(landData)
                if (landData[4].AreaOwnedTotal != undefined || landData[4].AreaOwnedTotal != null || landData[4].AreaOwnedTotal != '') {
                  areaOwnByAllCustomer += parseInt(landData[4].AreaOwned)
                }
              }
            }

          }


          this.LandInfo.TotalOwnedAreaForChargeCreation = "" + areaOwnByAllCustomer
          if (this.customerLandRelation != undefined) {

            debugger;
            for (var i = 0; i < this.customerLandRelation.length; i++) {

              this.newDynamic = {
                cnic: this.customerLandRelation[i].Cnic, owner: "", customerName: this.customerLandRelation[i].CustomerName,
                fatherName: this.customerLandRelation[i].FatherName, area: this.customerLandRelation[i].TotalArea, isReadOnly: true,
                LandCustID: this.customerLandRelation[i].LandCustID, LandInfoID: this.customerLandRelation[i].LandInfoID
              };
              this.dynamicArray.push(this.newDynamic);

              this.SearchDataCustomerBackup.push(this.customerLandRelation[i])
            }


            this.CustomerLov = this.customerLandRelation;
            //console.log(this.zoneLovAll);
            //var ZoneNameTemp = this.zoneLovAll.filter(x => x.ZoneId == this.LandInfo.Zone);
            this.LandInformationForm.controls['Zone'].setValue(this.LandInfo.ZoneName);
            this.GetBranches(this.LandInfo.ZoneID, this.LandInfo.BranchId);
            //this.LandInformationForm.controls['Branch'].setValue(this.LandInfo.Branch);
            this.LandInformationForm.controls['PostCode'].setValue(this.LandInfo.PostCode);
            this.LandInformationForm.controls['LandingProcedure'].setValue(this.LandInfo.LandingProcedure);
            this.LandInformationForm.controls['PassbookNO'].setValue(this.LandInfo.PassbookNO);
            this.LandInformationForm.controls['TotalArea'].setValue(this.LandInfo.TotalArea);
            this.LandInformationForm.controls['DateIssue'].setValue(this._common.stringToDate(this.LandInfo.DateIssue));
            this.LandInformationForm.controls['PlaceofIssuePB'].setValue(this.LandInfo.PlaceofIssuePB);
            this.LandInformationForm.controls['CompleteAddress'].setValue(this.LandInfo.CompleteAddress);
            this.LandInformationForm.controls['LandAutoCode'].setValue(this.LandInfo.LandAutoCode);
            this.LandInformationForm.controls['NumberOfCustomer'].setValue(this.customerLandRelation.length);
            this.LandInformationForm.controls['Remarks'].setValue(this.LandInfo.Remarks);

            this.ktDialogService.hide();
            this.cdRef.detectChanges();

          }
          else
            this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.ktDialogService.hide();
        }
      });
    this.cdRef.detectChanges();

  }

  GetCustomerAllLandInfo(showSuccessDialog: Boolean) {
    if (!showSuccessDialog) {
      this.spinner.show();
    }
    this._landService.getCustomerAllLandInfo(this.LandInfo)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {



          if (this.LoginUserInfo.User.UserId != baseResponse.LandInfo.EnteredBy && this.LoginUserInfo.Branch.BranchCode != "All")
            this.isFormReadonly = true;

          debugger;
          this.SaveCustomer = true;
          this.NumberOfCustomerDisable = true;
          this.AllowchargeCreation = true;
          this.AllowDocumentUpload = true;
          this.AllowSubmit = true;

          this.LandInfo = baseResponse.LandInfo;
          this.LandInfoDataList = baseResponse.LandInfoDataList;
          this.LandInfoDetailsList = baseResponse.LandInfoDetailsList;
          this.ChargeCreation = baseResponse.ChargeCreation;
          this.ChargeCreationDetailList = baseResponse.ChargeCreationDetailList;
          this.customerLandRelation = baseResponse.CustomerLandRelationList;

          this.dynamicArray = []
          this.SearchDataCustomerBackup = []
          this.alphas = [];
          var areaOwnByAllCustomer = 0
          if (this.LandInfoDetailsList != undefined) {

            for (var i = 0; i < this.LandInfoDetailsList.length; i++) {
              var landData = []
              for (var j = 0; j < this.LandInfoDetailsList[i].length; j++) {
                if (this.LandInfoDetailsList[i][j].LandCustID != undefined && this.LandInfoDetailsList[i][j].LandCustID != null &&
                  this.LandInfoDetailsList[i][j].LandCustID != '') {
                  landData.push(this.LandInfoDetailsList[i][j])
                }
              }
              if (landData.length > 0) {
                this.alphas.push(landData)
                if (landData[4].AreaOwnedTotal != undefined || landData[4].AreaOwnedTotal != null || landData[4].AreaOwnedTotal != '') {
                  areaOwnByAllCustomer += parseInt(landData[4].AreaOwned)
                }
              }
            }

          }



          this.LandInfo.TotalOwnedAreaForChargeCreation = "" + areaOwnByAllCustomer
          if (this.customerLandRelation != undefined) {

            debugger;
            for (var i = 0; i < this.customerLandRelation.length; i++) {

              this.newDynamic = {
                cnic: this.customerLandRelation[i].Cnic, owner: "", customerName: this.customerLandRelation[i].CustomerName,
                fatherName: this.customerLandRelation[i].FatherName, area: this.customerLandRelation[i].TotalArea, isReadOnly: true,
                LandCustID: this.customerLandRelation[i].LandCustID, LandInfoID: this.customerLandRelation[i].LandInfoID
              };
              this.dynamicArray.push(this.newDynamic);

              this.SearchDataCustomerBackup.push(this.customerLandRelation[i])
            }


            this.CustomerLov = this.customerLandRelation;
            //console.log(this.zoneLovAll);
            //var ZoneNameTemp = this.zoneLovAll.filter(x => x.ZoneId == this.LandInfo.Zone);
            this.LandInformationForm.controls['Zone'].setValue(this.LandInfo.ZoneName);
            this.GetBranches(this.LandInfo.ZoneID, this.LandInfo.BranchId);
            //this.LandInformationForm.controls['Branch'].setValue(this.LandInfo.Branch);
            this.LandInformationForm.controls['PostCode'].setValue(this.LandInfo.PostCode);
            this.LandInformationForm.controls['LandingProcedure'].setValue(this.LandInfo.LandingProcedure);
            this.LandInformationForm.controls['PassbookNO'].setValue(this.LandInfo.PassbookNO);
            this.LandInformationForm.controls['TotalArea'].setValue(this.LandInfo.TotalArea);
            this.LandInformationForm.controls['DateIssue'].setValue(this._common.stringToDate(this.LandInfo.DateIssue));
            this.LandInformationForm.controls['PlaceofIssuePB'].setValue(this.LandInfo.PlaceofIssuePB);
            this.LandInformationForm.controls['CompleteAddress'].setValue(this.LandInfo.CompleteAddress);
            this.LandInformationForm.controls['LandAutoCode'].setValue(this.LandInfo.LandAutoCode);
            this.LandInformationForm.controls['NumberOfCustomer'].setValue(this.customerLandRelation.length);
            this.LandInformationForm.controls['Remarks'].setValue(this.LandInfo.Remarks);

            this.ktDialogService.hide();
            this.cdRef.detectChanges();


            if (showSuccessDialog) {
              this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
            }
          }
          else
            this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.ktDialogService.hide();
        }
      });
    this.cdRef.detectChanges();

  }

  checkForDulpicateCustomerLandDetail() {

    debugger;
    var index = []
    for (var i = 0; i < this.alphas.length; i++) {
      var landInfoDetails = this.alphas[i]
      if (landInfoDetails[0].LandCustID == this.selectedCustomerID) {
        index.push(i)
      }
    }
    if (index.length > 1) {
      var j = index[0]
      this.alphas.splice(j, 1);
    }

  }

  saveCustomerLandInfoDetails() {



    this.errorMessage = "";
    debugger;
    this.getLandDetailTableData();
    this.checkForDulpicateCustomerLandDetail()




    if (this.CustomerLov.length != this.alphas.length) {
      this.errorMessage = "Please enter the land detail for all customers"
      return
    }

    var totalArea = 0
    var totalOwnedArea = 0;
    var enteredArea = parseInt(this.LandInfo.TotalArea);
    debugger;
    //this.CustomerLov = this.SearchDataCustomerBackup;
    for (var i = 0; i < this.alphas.length; i++) {
      var landInfoDetails = this.alphas[i]
      totalArea = totalArea + parseInt(landInfoDetails[4].AreaTotal);
      totalOwnedArea = totalOwnedArea + parseInt(landInfoDetails[4].AreaOwned);
    }





    if (totalArea != enteredArea) {
      this.errorMessage = "Area of all the custmer must be equal to the entered Area Owned<br/>" +
        "Area Owner = " + enteredArea + "<br/>Total Area of all the customers = " + totalArea
      return
    }
    else {

      this.spinner.show();
      this._landService
        .saveCustomerLandInfoDetail(this.alphas, this.TrainId)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.spinner.hide();
          })
        )
        .subscribe((baseResponse: BaseResponseModel) => {

          debugger;
          console.log(baseResponse);
          if (baseResponse.Success === true) {
            this.AllowchargeCreation = true;
            this.AllowDocumentUpload = true;
            this.AllowSubmit = true;
            this.loadingAfterSubmit = false;
            this.LandInfo.TotalOwnedAreaForChargeCreation = totalOwnedArea.toString();
            this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);

          }
          else {
            this.layoutUtilsService.alertElement("", baseResponse.Message);
          }

        });
    }

  }

  submitCustomerLandInfo() {

    this.spinner.show();
    this.request = new BaseRequestModel();

    var userInfo = this.userUtilsService.getUserDetails();
    this.request.User = userInfo.User;
    this.LandInfo.Remarks = this.LandInformationForm.controls["Remarks"].value;
    this.request.LandInfo = this.LandInfo;
    //this.request.LandInfo.Remarks = "";
    this.request.TranId = this.TrainId;
    debugger;
    this._landService
      .SubmitLandInfo(this.request)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinner.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        debugger;
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.ktDialogService.hide();
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
          this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });

  }

  searchCustomer(index) {

    debugger;


    var customerSearchArray = this.dynamicArray[index];
    if (customerSearchArray.cnic == '' || customerSearchArray.cnic == undefined || customerSearchArray.cnic == null) {
      return;
    }

    var duplicateCustomer = this.SearchDataCustomerBackup.filter(x => x.Cnic == customerSearchArray.cnic)[0];
    if (duplicateCustomer != undefined && duplicateCustomer != null) {
      this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
      return;
    }
    this.createCustomer.CustomerStatus = 'A';
    this.createCustomer.Cnic = customerSearchArray.cnic;



    this._customerService
      .searchCustomer(this.createCustomer)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        debugger;
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          console.log(baseResponse)
          debugger;
          this.SaveCustomer = true;
          this.SearchDataCustomer = baseResponse.Customers[0];
          this.dynamicArray[index].customerName = this.SearchDataCustomer.CustomerName;
          this.dynamicArray[index].fatherName = this.SearchDataCustomer.FatherName;
          this.dynamicArray[index].Customer_Id = this.SearchDataCustomer.CustomerNumber;
          this.dynamicArray[index].isReadOnly = true;
          //this.dynamicArray[index].LandCustID = this.SearchDataCustomer.LandCustID;
          //this.dynamicArray[index].LandCustID = this.SearchDataCustomer.LandCustID;
          //this.dynamicArray[index].area = this.createCustomer

          this.SearchDataCustomerBackup.push(this.SearchDataCustomer);
          //this.CustomerLov = this.SearchDataCustomerBackup;

          this.cdRef.detectChanges();
        }
        else {


          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }

      });


  }

  onKey(event: any) {
    debugger;
    var value = event.target.value;
    if (value == undefined || value == null || value == '') {
      return
    }

    // if(this.dynamicArray.length > value){
    //   this.dynamicArray.length = 0;
    // }

    value = parseInt(value);

    //this.SearchDataCustomerBackup.splice(value, 1);

    if (this.dynamicArray.length > value) {
      var tempValueCount = this.dynamicArray.filter(item => item.cnic != '').length;
      if (tempValueCount > value) {
        this.layoutUtilsService.alertElement("", "There are some customers present in below list and you entered number less than already present. Please remove some customers to continue");
      }

      // this.layoutUtilsService.alertElement("", "There are some customers present in below list and you entered number less than already present. Please remove some customers to continue", "Warning");


      //this.deleteCustomerOnCustomerNumberUpdate(this.dynamicArray[value].cnic);

      this.dynamicArray = this.dynamicArray.filter(item => item.cnic != '');
      event.target.value = this.dynamicArray.length;
      this.LandInformationForm.controls["NumberOfCustomer"].setValue(this.dynamicArray.length);
      //var tempWarningShown = false;
      //this.dynamicArray.forEach( (item, index, object) =>{
      //  if (!tempWarningShown && item.cnic != '') {
      //    this.layoutUtilsService.alertElement("", "There are some customers present in below list and you entered number less than already present. Please remove some customers to continue", "Warning");
      //    tempWarningShown = true;

      //  } else if (item.cnic == '') {
      //    object.splice(index, 1);
      //  }
      //});

      //var length = this.dynamicArray.length
      //for (var i = value; i < length; i++) {
      //  if (!tempWarningShown && this.dynamicArray[value].cnic != '') {
      //    this.layoutUtilsService.alertElement("", "There are some customers present in below list and you entered number less than already present. Please remove some customers to continue", "Warning");
      //    tempWarningShown = true;
      //    //break;
      //    //this.deleteCustomerOnCustomerNumberUpdate(this.dynamicArray[value].cnic)
      //  }
      //  else
      //    this.dynamicArray.splice(i, 1);
      //}
    } else {
      var length = this.dynamicArray.length

      for (var j = length; j < value; j++) {
        this.newDynamic = { cnic: "", owner: "", customerName: "", fatherName: "", area: "", CnicFieldEnabled: false };
        this.dynamicArray.push(this.newDynamic);
      }
    }

  }

  deleteCustomerOnCustomerNumberUpdate(cnic: any) {

    debugger;
    var index = []
    for (var i = 0; i < this.SearchDataCustomerBackup.length; i++) {
      if (this.SearchDataCustomerBackup[i].Cnic == cnic) {
        index.push(i)
      }
    }
    if (index.length > 0) {

      for (var i = 0; i < index.length; i++) {
        var j = index[i]
        this.SearchDataCustomerBackup.splice(j, 1);
      }

    }

  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  getUserInput(userInput: any): any {

    if (userInput == undefined || userInput == '') {
      return '0'
    }
    return userInput
  }
  onKeyInputCalculateValue(event: any) {

    debugger;
    this.BTotal = 0;



    this.BAreaOwned = this.BArea;
    this.BTotal = + parseInt(this.getUserInput(this.BAreaOwned)) + parseInt(this.getUserInput(this.BLeasedIn)) +
      parseInt(this.getUserInput(this.BFimalyOperated)) + parseInt(this.getUserInput(this.BUnderCustomhiring)) -
      parseInt(this.getUserInput(this.BLeasedOut));

    this.ITotal = 0;
    this.IAreaOwned = this.IArea;
    this.ITotal = +parseInt(this.getUserInput(this.IAreaOwned)) + parseInt(this.getUserInput(this.ILeasedIn)) + parseInt(this.getUserInput(this.IFimalyOperated)) + parseInt(this.getUserInput(this.IUnderCustomhiring)) - parseInt(this.getUserInput(this.ILeasedOut));

    this.UnTotal = 0;
    this.UnAreaOwned = this.UnArea;
    this.UnTotal = +parseInt(this.getUserInput(this.UnAreaOwned)) + parseInt(this.getUserInput(this.UnLeasedIn)) + parseInt(this.getUserInput(this.UnFimalyOperated)) + parseInt(this.getUserInput(this.UnUnderCustomhiring)) - parseInt(this.getUserInput(this.UnLeasedOut));

    this.UnATotal = 0;
    this.UnAAreaOwned = this.UnAArea;
    this.UnATotal = +parseInt(this.getUserInput(this.UnAAreaOwned)) + parseInt(this.getUserInput(this.UnALeasedIn)) + parseInt(this.getUserInput(this.UnAFimalyOperated)) + parseInt(this.getUserInput(this.UnAUnderCustomhiring)) - parseInt(this.getUserInput(this.UnALeasedOut));


    this.AreaTotal = 0;
    this.AreaTotal = + parseInt(this.getUserInput(this.BArea)) + parseInt(this.getUserInput(this.IArea)) + parseInt(this.getUserInput(this.UnArea)) + parseInt(this.getUserInput(this.UnAArea));

    this.AreaOwnedTotal = 0;
    this.AreaOwnedTotal = + parseInt(this.getUserInput(this.BAreaOwned)) + parseInt(this.getUserInput(this.IAreaOwned)) + parseInt(this.getUserInput(this.UnAreaOwned)) + parseInt(this.getUserInput(this.UnAAreaOwned));

    this.LeasedInTotal = 0;
    this.LeasedInTotal = + parseInt(this.getUserInput(this.BLeasedIn)) + parseInt(this.getUserInput(this.ILeasedIn)) + parseInt(this.getUserInput(this.UnLeasedIn)) + parseInt(this.getUserInput(this.UnALeasedIn));

    this.LeasedOutTotal = 0;
    this.LeasedOutTotal = +parseInt(this.getUserInput(this.BLeasedOut)) + parseInt(this.getUserInput(this.ILeasedOut)) + parseInt(this.getUserInput(this.UnLeasedOut)) + parseInt(this.getUserInput(this.UnALeasedOut));

    this.FamilyOperatedTotal = 0;
    this.FamilyOperatedTotal = + parseInt(this.getUserInput(this.BFimalyOperated)) + parseInt(this.getUserInput(this.IFimalyOperated)) + parseInt(this.getUserInput(this.UnFimalyOperated)) + parseInt(this.getUserInput(this.UnAFimalyOperated));

    this.UnderCustomHiringTotal = 0;
    this.UnderCustomHiringTotal = + parseInt(this.getUserInput(this.BUnderCustomhiring)) + parseInt(this.getUserInput(this.IUnderCustomhiring)) + parseInt(this.getUserInput(this.UnUnderCustomhiring)) + parseInt(this.getUserInput(this.UnAUnderCustomhiring));

    this.TotalOfTotal = + this.BTotal + this.ITotal + this.UnTotal + this.UnATotal;


  }

  SelectionChangePushData(event: any) {

    debugger
    var resetTable = true
    this.ShowTable = true

    console.log(this.dynamicArray)

    // if(this.dynamicArray.length == 1){
    //   if(this.selectedCustomerID != undefined && this.selectedCustomerID != '' && this.selectedCustomerID != null){
    //     this.selectedCustomerID = undefined;
    //   }
    // }

    /*if (this.alphas.length > 0) {
      var details = this.alphas[0];
      this.TotalOfTotal = details[4].AreaTotal;
    }
  
    if (this.TotalOfTotal == 0) {
    }*/
    debugger;
    if (this.isEditMode == '1' && this.alphas.length > 0 && this.TotalOfTotal == 0) {
      // when land will be in edit mode then on selecting any customer from drop down
      // the total value will be 0 and table is not populated at the moment, so need to igonre the below
      // condition written inside the else clause.
      this.selectedCustomerID = event.value;
    } else {
      if (this.TotalOfTotal == 0) {
        if (this.selectedCustomerID != undefined && this.selectedCustomerID != '' && this.selectedCustomerID != null) {

          var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];
          this.LandInformationForm.controls['LandCustID'].setValue(Customerdata.LandCustID)
        } else {
          this.selectedCustomerID = event.value;
        }
        return
      }
    }
    if (this.selectedCustomerID == undefined || this.selectedCustomerID == '' || this.selectedCustomerID == null) {
      this.selectedCustomerID = event.value;
      resetTable = false
    }


    this.getLandDetailTableData()
    var dataFound = this.reloadLandDetailTableData(event.value)
    this.checkForDulpicateCustomerLandDetail()

    if (resetTable && !dataFound) {
      this.clearLandDetailTableData()
    }

    this.selectedCustomerID = event.value;

  }

  getLandObject(Customerdata: any): LandInfoDetails {

    var landDetails = new LandInfoDetails();
    var BranchID = this.BranchLov.BranchId;

    landDetails.BranchID = BranchID;
    landDetails.CustomerNumber = Customerdata.CustomerNumber;
    landDetails.IsOwner = "Y";
    landDetails.LandCustID = Customerdata.LandCustID;
    landDetails.LandInfoDetailID = 0;
    landDetails.LandInfoID = Customerdata.LandInfoID;
    landDetails.LandUnit = 1;

    return landDetails
  }

  getLandDetailTableData() {


    debugger;
    if (this.isEditMode == '1' && this.alphas.length > 0 && this.TotalOfTotal == 0) {
      // when land will be in edit mode then on selecting any customer from drop down
      // the total value will be 0 and table is not populated at the moment, so need to igonre the below
      // condition.
      return
    }
    if (this.TotalOfTotal == 0) {
      var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];
      this.errorMessage = "Please enter land details for " + Customerdata.CustomerName
      return
    }

    this.LandInfoDetail = [];

    var Customerdata = this.CustomerLov.filter(x => x.LandCustID == this.selectedCustomerID)[0];

    var LandDetails = this.getLandObject(Customerdata)

    LandDetails.Area = this.BArea
    LandDetails.AreaOwned = this.BAreaOwned
    LandDetails.FamAreaOpr = this.BFimalyOperated
    LandDetails.LeasedIn = this.BLeasedIn
    LandDetails.LeasedOut = this.BLeasedOut
    LandDetails.LandTypeID = 1;
    LandDetails.AreaUnderCust = this.BUnderCustomhiring
    LandDetails.AreaTotal = this.BTotal;


    this.LandInfoDetail.push(LandDetails);
    var LandDetails = this.getLandObject(Customerdata)


    LandDetails.Area = this.IArea
    LandDetails.AreaOwned = this.IAreaOwned
    LandDetails.FamAreaOpr = this.IFimalyOperated
    LandDetails.LeasedIn = this.ILeasedIn
    LandDetails.LeasedOut = this.ILeasedOut
    LandDetails.AreaUnderCust = this.IUnderCustomhiring
    LandDetails.LandTypeID = 2;
    LandDetails.AreaTotal = this.ITotal;

    this.LandInfoDetail.push(LandDetails);
    var LandDetails = this.getLandObject(Customerdata)


    LandDetails.Area = this.UnArea
    LandDetails.AreaOwned = this.UnAreaOwned
    LandDetails.FamAreaOpr = this.UnFimalyOperated
    LandDetails.LeasedIn = this.UnLeasedIn
    LandDetails.LeasedOut = this.UnLeasedOut
    LandDetails.AreaUnderCust = this.UnUnderCustomhiring
    LandDetails.LandTypeID = 3;
    LandDetails.AreaTotal = this.UnTotal;

    this.LandInfoDetail.push(LandDetails);
    var LandDetails = this.getLandObject(Customerdata)

    LandDetails.Area = this.UnAArea
    LandDetails.AreaOwned = this.UnAAreaOwned
    LandDetails.FamAreaOpr = this.UnAFimalyOperated
    LandDetails.LeasedIn = this.UnALeasedIn
    LandDetails.LeasedOut = this.UnALeasedOut
    LandDetails.AreaUnderCust = this.UnAUnderCustomhiring
    LandDetails.LandTypeID = 4;
    LandDetails.AreaTotal = this.UnATotal;

    this.LandInfoDetail.push(LandDetails);
    var LandDetails = this.getLandObject(Customerdata)

    LandDetails.Area = this.AreaTotal;
    LandDetails.AreaOwned = this.AreaOwnedTotal;
    LandDetails.FamAreaOpr = this.FamilyOperatedTotal;
    LandDetails.LeasedIn = this.LeasedInTotal;
    LandDetails.LeasedOut = this.LeasedOutTotal;
    LandDetails.AreaUnderCust = this.UnderCustomHiringTotal;
    LandDetails.LandTypeID = 5;
    LandDetails.AreaTotal = this.TotalOfTotal;

    this.LandInfoDetail.push(LandDetails);


    this.alphas.push(this.LandInfoDetail);

  }

  reloadLandDetailTableData(customerId: any): boolean {

    debugger;
    var landInfoDetail = [];

    for (var i = 0; i < this.alphas.length; i++) {
      var detail = this.alphas[i]
      if (detail[0].LandCustID == customerId) {
        landInfoDetail = detail;
        break;
      }
    }

    if (landInfoDetail.length == 0)
      return false

    if (this.LandInfoSearchData != undefined && this.LandInfoSearchData != null) {
      if ((this.LandInfoSearchData.Status == '3' || this.LandInfoSearchData.Status == '2' || this.LandInfoSearchData.Status == '1') && this.isEditMode == "1") {

        this.landDetailMarlaPlaceholder = "";
        this.BArea = landInfoDetail[0].Area == "0" ? "" : landInfoDetail[0].Area
        this.BAreaOwned = landInfoDetail[0].AreaOwned == "0" ? "" : landInfoDetail[0].AreaOwned
        this.BFimalyOperated = landInfoDetail[0].FamAreaOpr == "0" ? "" : landInfoDetail[0].FamAreaOpr
        this.BLeasedIn = landInfoDetail[0].LeasedIn == "0" ? "" : landInfoDetail[0].LeasedIn
        this.BLeasedOut = landInfoDetail[0].LeasedOut == "0" ? "" : landInfoDetail[0].LeasedOut
        this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust == "0" ? "" : landInfoDetail[0].AreaUnderCust
        this.BTotal = landInfoDetail[0].AreaTotal == "0" ? "" : landInfoDetail[0].AreaTotal

        this.IArea = landInfoDetail[1].Area == "0" ? "" : landInfoDetail[1].Area
        this.IAreaOwned = landInfoDetail[1].AreaOwned == "0" ? "" : landInfoDetail[1].AreaOwned
        this.IFimalyOperated = landInfoDetail[1].FamAreaOpr == "0" ? "" : landInfoDetail[1].FamAreaOpr
        this.ILeasedIn = landInfoDetail[1].LeasedIn == "0" ? "" : landInfoDetail[1].LeasedIn
        this.ILeasedOut = landInfoDetail[1].LeasedOut == "0" ? "" : landInfoDetail[1].LeasedOut
        this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust == "0" ? "" : landInfoDetail[1].AreaUnderCust
        this.ITotal = landInfoDetail[1].AreaTotal == "0" ? "" : landInfoDetail[1].AreaTotal


        this.UnArea = landInfoDetail[2].Area == "0" ? "" : landInfoDetail[2].Area
        this.UnAreaOwned = landInfoDetail[2].AreaOwned == "0" ? "" : landInfoDetail[2].AreaOwned
        this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr == "0" ? "" : landInfoDetail[2].FamAreaOpr
        this.UnLeasedIn = landInfoDetail[2].LeasedIn == "0" ? "" : landInfoDetail[2].LeasedIn
        this.UnLeasedOut = landInfoDetail[2].LeasedOut == "0" ? "" : landInfoDetail[2].LeasedOut
        this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust == "0" ? "" : landInfoDetail[2].AreaUnderCust
        this.UnTotal = landInfoDetail[2].AreaTotal == "0" ? "" : landInfoDetail[2].AreaTotal

        this.UnAArea = landInfoDetail[3].Area == "0" ? "" : landInfoDetail[3].Area
        this.UnAAreaOwned = landInfoDetail[3].AreaOwned == "0" ? "" : landInfoDetail[3].AreaOwned
        this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr == "0" ? "" : landInfoDetail[3].FamAreaOpr
        this.UnALeasedIn = landInfoDetail[3].LeasedIn == "0" ? "" : landInfoDetail[3].LeasedIn
        this.UnALeasedOut = landInfoDetail[3].LeasedOut == "0" ? "" : landInfoDetail[3].LeasedOut
        this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust == "0" ? "" : landInfoDetail[3].AreaUnderCust
        this.UnATotal = landInfoDetail[3].AreaTotal == "0" ? "" : landInfoDetail[3].AreaTotal


        this.AreaTotal = landInfoDetail[4].Area == "0" ? "" : landInfoDetail[4].Area
        this.AreaOwnedTotal = landInfoDetail[4].AreaOwned == "0" ? "" : landInfoDetail[4].AreaOwned
        this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr == "0" ? "" : landInfoDetail[4].FamAreaOpr
        this.LeasedInTotal = landInfoDetail[4].LeasedIn == "0" ? "" : landInfoDetail[4].LeasedIn
        this.LeasedOutTotal = landInfoDetail[4].LeasedOut == "0" ? "" : landInfoDetail[4].LeasedOut
        this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust == "0" ? "" : landInfoDetail[4].AreaUnderCust
        this.TotalOfTotal = landInfoDetail[4].AreaTotal == "0" ? "" : landInfoDetail[4].AreaTotal
      }
      else {
        this.BArea = landInfoDetail[0].Area
        this.BAreaOwned = landInfoDetail[0].AreaOwned
        this.BFimalyOperated = landInfoDetail[0].FamAreaOpr
        this.BLeasedIn = landInfoDetail[0].LeasedIn
        this.BLeasedOut = landInfoDetail[0].LeasedOut
        this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust
        this.BTotal = landInfoDetail[0].AreaTotal

        this.IArea = landInfoDetail[1].Area
        this.IAreaOwned = landInfoDetail[1].AreaOwned
        this.IFimalyOperated = landInfoDetail[1].FamAreaOpr
        this.ILeasedIn = landInfoDetail[1].LeasedIn
        this.ILeasedOut = landInfoDetail[1].LeasedOut
        this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust
        this.ITotal = landInfoDetail[1].AreaTotal


        this.UnArea = landInfoDetail[2].Area
        this.UnAreaOwned = landInfoDetail[2].AreaOwned
        this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr
        this.UnLeasedIn = landInfoDetail[2].LeasedIn
        this.UnLeasedOut = landInfoDetail[2].LeasedOut
        this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust
        this.UnTotal = landInfoDetail[2].AreaTotal

        this.UnAArea = landInfoDetail[3].Area
        this.UnAAreaOwned = landInfoDetail[3].AreaOwned
        this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr
        this.UnALeasedIn = landInfoDetail[3].LeasedIn
        this.UnALeasedOut = landInfoDetail[3].LeasedOut
        this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust
        this.UnATotal = landInfoDetail[3].AreaTotal


        this.AreaTotal = landInfoDetail[4].Area
        this.AreaOwnedTotal = landInfoDetail[4].AreaOwned
        this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr
        this.LeasedInTotal = landInfoDetail[4].LeasedIn
        this.LeasedOutTotal = landInfoDetail[4].LeasedOut
        this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust
        this.TotalOfTotal = landInfoDetail[4].AreaTotal
      }
    }
    else {
      this.BArea = landInfoDetail[0].Area
      this.BAreaOwned = landInfoDetail[0].AreaOwned
      this.BFimalyOperated = landInfoDetail[0].FamAreaOpr
      this.BLeasedIn = landInfoDetail[0].LeasedIn
      this.BLeasedOut = landInfoDetail[0].LeasedOut
      this.BUnderCustomhiring = landInfoDetail[0].AreaUnderCust
      this.BTotal = landInfoDetail[0].AreaTotal

      this.IArea = landInfoDetail[1].Area
      this.IAreaOwned = landInfoDetail[1].AreaOwned
      this.IFimalyOperated = landInfoDetail[1].FamAreaOpr
      this.ILeasedIn = landInfoDetail[1].LeasedIn
      this.ILeasedOut = landInfoDetail[1].LeasedOut
      this.IUnderCustomhiring = landInfoDetail[1].AreaUnderCust
      this.ITotal = landInfoDetail[1].AreaTotal


      this.UnArea = landInfoDetail[2].Area
      this.UnAreaOwned = landInfoDetail[2].AreaOwned
      this.UnFimalyOperated = landInfoDetail[2].FamAreaOpr
      this.UnLeasedIn = landInfoDetail[2].LeasedIn
      this.UnLeasedOut = landInfoDetail[2].LeasedOut
      this.UnUnderCustomhiring = landInfoDetail[2].AreaUnderCust
      this.UnTotal = landInfoDetail[2].AreaTotal

      this.UnAArea = landInfoDetail[3].Area
      this.UnAAreaOwned = landInfoDetail[3].AreaOwned
      this.UnAFimalyOperated = landInfoDetail[3].FamAreaOpr
      this.UnALeasedIn = landInfoDetail[3].LeasedIn
      this.UnALeasedOut = landInfoDetail[3].LeasedOut
      this.UnAUnderCustomhiring = landInfoDetail[3].AreaUnderCust
      this.UnATotal = landInfoDetail[3].AreaTotal


      this.AreaTotal = landInfoDetail[4].Area
      this.AreaOwnedTotal = landInfoDetail[4].AreaOwned
      this.FamilyOperatedTotal = landInfoDetail[4].FamAreaOpr
      this.LeasedInTotal = landInfoDetail[4].LeasedIn
      this.LeasedOutTotal = landInfoDetail[4].LeasedOut
      this.UnderCustomHiringTotal = landInfoDetail[4].AreaUnderCust
      this.TotalOfTotal = landInfoDetail[4].AreaTotal
    }

    return true
  }

  clearLandDetailTableData() {


    this.BArea = ""
    this.BAreaOwned = ""
    this.BFimalyOperated = ""
    this.BLeasedIn = ""
    this.BLeasedOut = ""
    this.BUnderCustomhiring = ""
    this.BTotal = 0

    this.IArea = ""
    this.IAreaOwned = ""
    this.IFimalyOperated = ""
    this.ILeasedIn = ""
    this.ILeasedOut = ""
    this.IUnderCustomhiring = ""
    this.ITotal = 0


    this.UnArea = ""
    this.UnAreaOwned = ""
    this.UnFimalyOperated = ""
    this.UnLeasedIn = ""
    this.UnLeasedOut = ""
    this.UnUnderCustomhiring = ""
    this.UnTotal = 0

    this.UnAArea = ""
    this.UnAAreaOwned = ""
    this.UnAFimalyOperated = ""
    this.UnALeasedIn = ""
    this.UnALeasedOut = ""
    this.UnAUnderCustomhiring = ""
    this.UnATotal = 0


    this.AreaTotal = ""
    this.AreaOwnedTotal = ""
    this.FamilyOperatedTotal = ""
    this.LeasedInTotal = ""
    this.LeasedOutTotal = ""
    this.UnderCustomHiringTotal = ""
    this.TotalOfTotal = 0

  }
  deleteAllRows() {
    this.dynamicArray.forEach((currentValue, index) => {
      this.deleteRow(index);
    });

  }
  deleteRow(index) {
    debugger;
    if (this.dynamicArray.length > 1) {
      debugger
      if (this.dynamicArray[index].LandCustID != null && this.dynamicArray[index].LandCustID != "") {
        this.spinner.show();
        var tempCustLandInfo = this.customerLandRelation.filter(x => x.Cnic == this.dynamicArray[index].cnic);
        var indexCustLandInfo = this.customerLandRelation.indexOf(tempCustLandInfo[0])
        var indexCustLov = this.CustomerLov.indexOf(tempCustLandInfo[0])
        var indexAlphas = -1;
        if (this.alphas != undefined) {
          //var indexAlphas = this.alphas.indexOf(tempCustLandInfo[0]);
          //tempCustLandInfo[0].LandCustID
          //this.alphas[0][0].LandCustID
          this.alphas.forEach((item, key) => {
            debugger;
            if (item[0].LandCustID == tempCustLandInfo[0].LandCustID)
              indexAlphas = key;
          });
        }


        this._landService.deleteCustomerWithLand(this.dynamicArray[index].LandCustID)
          .pipe(
            finalize(() => {

              this.spinner.hide();
            })
          ).subscribe((baseResponse: BaseResponseModel) => {
            debugger;
            if (baseResponse.Success === true) {

              //var tempCustLandInfo = this.customerLandRelation.filter(x => x.Cnic == this.dynamicArray[index].cnic);
              //var indexCustLandInfo = this.customerLandRelation.indexOf(tempCustLandInfo)
              this.SearchDataCustomerBackup.splice(indexCustLandInfo, 1)

              /*var indexCustLov = this.CustomerLov.indexOf(tempCustLandInfo)*/
              this.CustomerLov.splice(indexCustLov, 1);

              this.alphas.splice(indexAlphas, 1);

              if (this.dynamicArray[index].LandCustID == this.selectedCustomerID) {
                // B
                this.BArea = ""
                this.BAreaOwned = "";
                this.BLeasedIn = "";
                this.BLeasedOut = "";
                this.BFimalyOperated = "";
                this.BUnderCustomhiring = "";
                this.BTotal = 0;

                this.IArea = "";
                this.IAreaOwned = "";
                this.ILeasedIn = "";
                this.ILeasedOut = "";
                this.IFimalyOperated = "";
                this.IUnderCustomhiring = "";
                this.ITotal = 0;

                this.UnArea = "";
                this.UnAreaOwned = "";
                this.UnLeasedIn = "";
                this.UnLeasedOut = "";
                this.UnFimalyOperated = "";
                this.UnUnderCustomhiring = "";
                this.UnTotal = 0;

                this.UnAArea = "";
                this.UnAAreaOwned = "";
                this.UnALeasedIn = "";
                this.UnALeasedOut = "";
                this.UnAFimalyOperated = "";
                this.UnAUnderCustomhiring = "";
                this.UnATotal = 0;

                this.AreaTotal = "";
                this.AreaOwnedTotal = "";
                this.LeasedInTotal = "";
                this.LeasedOutTotal = "";
                this.FamilyOperatedTotal = "";
                this.UnderCustomHiringTotal = "";
                this.TotalOfTotal = 0;

              }


              this.dynamicArray[index].cnic = "";
              this.dynamicArray[index].owner = "";
              this.dynamicArray[index].customerName = "";
              this.dynamicArray[index].fatherName = "";
              this.dynamicArray[index].area = "";
              this.dynamicArray[index].LandCustID = "";
              this.dynamicArray[index].LandInfoID = "";
              this.dynamicArray[index].isReadOnly = false;

              // this.dynamicArray[index].cnic = "";
              // this.dynamicArray[index].owner = "";
              // this.dynamicArray[index].customerName = "";
              // this.dynamicArray[index].fatherName = "";
              // this.dynamicArray[index].area = "";
              // this.dynamicArray[index].LandCustID = "";
              // this.dynamicArray[index].LandInfoID = "";
              // this.dynamicArray[index].isReadOnly = false;

              this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
            }
            else {
              this.layoutUtilsService.alertElement("", baseResponse.Message);
            }

          });
      }
      else {
        var tempCust = this.SearchDataCustomerBackup.filter(x => x.Cnic == this.dynamicArray[index].cnic);
        if (tempCust != null && tempCust.length > 0) {
          var tempIndex = this.SearchDataCustomerBackup.indexOf(tempCust[0]);
          this.SearchDataCustomerBackup.splice(tempIndex, 1);
        }
        this.dynamicArray[index].cnic = "";
        this.dynamicArray[index].owner = "";
        this.dynamicArray[index].customerName = "";
        this.dynamicArray[index].fatherName = "";
        this.dynamicArray[index].area = "";
        this.dynamicArray[index].isReadOnly = false;


        return true;
      }
      //return false;
    } else {
      //this.dynamicArray.splice(index, 1);
      // this.dynamicArray[index].cnic = "";
      // this.dynamicArray[index].owner = "";
      // this.dynamicArray[index].customerName = "";
      // this.dynamicArray[index].fatherName = "";
      // this.dynamicArray[index].area = "";
      // this.dynamicArray[index].isReadOnly = false;

      // this.SearchDataCustomerBackup.splice(index, 1);
      this.layoutUtilsService.alertElement("", "Atleast one record is required.");
      return true;
    }
  }


  ViewLandHistory() {

    debugger;
    if (this.CustomerLov != undefined) {
      debugger;
      this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
    }
    let url = "/land-creation/land-info-history/" + this.LandInfo.Id
    // this.router.navigate(['../' + url]);


    // this.router.navigate(['./land-info-history/L/L']);

    //this.router.navigate(['./land-info-history', { id: "1", id2: "2" }]);
    this.router.navigateByUrl(url);
    // this.router.navigate(['./land-info-history', { lhFlag: "1", lID: this.LandInfo.Id }], { relativeTo: this.activatedRoute });
  }

  ViewLandHistoryBKP() {

    debugger;
    if (this.CustomerLov != undefined) {
      debugger;
      this.LandInfo.Id = this.CustomerLov[0].LandInfoID;
    }
    const dialogRef = this.dialog.open(LandHistoryComponent, { data: { landInfo: this.LandInfo, TrainId: this.TrainId }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

    });

  }

  viewCustomrePage() {
    const dialogRef = this.dialog.open(CustomerListDialogComponent, { width: "85%", data: {}, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      debugger;
      if (!res) {
        return;
      }
      //this.JvForm.controls.TransactionMasterID.setValue(res);
    });
  }

  viewCustomrePageOld() {
    debugger;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customer/search-customer']));
    var w = 1000;
    var h = 1900;
    var title = "ZTBL";
    window.open(url, title, "height=600,width=1100,menubar=no,toolbar=no,");
    //this.popupCenter({ url: uUrl, title: title, w: w, h: h });
    //console.log(url);
    // window.open(url, "ZTBL", "height=500,width=1180");
    //window.open("http://localhost:4200/customer/search-customer", "abc", "height=1024,width=800");

    //var left = (screen.width / 2) - (w / 2); var top = (screen.height / 2) - (h / 2);
    //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    //var left = (screen.width - w) / 2;
    //var top = (screen.height - h) / 4;
    var left = 0;
    var top = 0;
    //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    // window.open(url, 'ZTBL', config = center);  
  }

  popupCenter = ({ url, title, w, h }) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    )

    if (window.focus) newWindow.focus();
  }


  initialiseInvites() {
    //debugger
    //this.LandInfo = null
    //this.LandInfoDataList = null
    //this.LandInfoDetailsList = null
    //this.ChargeCreation = null
    //this.ChargeCreationDetailList = null
    //this.customerLandRelation = null


    //var userInfo = this.userUtilsService.getUserDetails();
    //this.LoginUserInfo = userInfo;
    //this.LandInfo.Zone = userInfo.Zone.ZoneName;
    //this.LandInfo.Branch = userInfo.Branch.Name
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}

export class DynamicGrid {
  cnic: string;
  owner: string;
  customerName: string;
  fatherName: string;
  area: string;
  isReadOnly: boolean;
  LandCustID: string;
  LandInfoID: string;
  Customer_Id: string;
}
