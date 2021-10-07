import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {finalize, takeUntil, retry} from 'rxjs/operators';
import {Subject, ReplaySubject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe, formatDate} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {FullscreenOverlayContainer} from '@angular/cdk/overlay';
import {parse} from 'path';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from 'moment';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
    DateFormats,
    errorMessages,
    Lov,
    LovConfigurationKey,
    MaskEnum,
    regExps
} from '../../../core/auth/_models/lov.class';
import {DateAdapter} from 'angular-calendar';
import {Activity} from '../../../core/auth/_models/activity.model';
import {CreateCustomer} from '../../../core/auth/_models/customer.model';
import {AppState} from '../../../core/reducers';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {KtDialogService} from '../../../core/_base/layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from '../../../core/auth/_services/customer.service';
import {LovService} from '../../../core/auth/_services/lov.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {CommonService} from '../../../core/auth/_services/common.service';

@Component({
  selector: 'kt-customer-profile',
  templateUrl: './customer-profile.component.html',
  providers: [
    DatePipe,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormats}

  ],
})
export class CustomerProfileComponent implements OnInit {
  saving = false;
  submitted = false;
  roleForm: FormGroup;
  isGenderDisabled = false;
  hasFormErrors = false;
  viewLoading = false;
  loadingAfterSubmit = false;
  _currentActivity: Activity = new Activity();
  //  profile: Profile = new Profile();

  AccessToData = [{Id: '1', Name: 'Zone'},
    {Id: '2', Name: 'Branch'},
    {Id: '3', Name: 'All'}];

  public createCustomer = new CreateCustomer();

  public LovCall = new Lov();
  public EducationLov: any;
  public CasteLov: any;
  public ReligionLov: any;
  public RiskCategoryLov: any;
  public PremisesFlagLov: any;
  public BankEmpNoLov: any;
  public MaritalStatusLov: any;
  public GenderLov: any;
  public OccupationLov: any;
  public DistrictLov: any;
  public DistrictLovFull: any;
  public CitizenshipLov: any;
  public BorrowerStatusLov: any;
  public PostCodeLov: any;

  public BranchLov: any;
  public ZoneLov: any;
  public HusbandNameShow: boolean = true;


  public maskEnums = MaskEnum;
  errors = errorMessages;


  private _onDestroy = new Subject<void>();

  images = [];
  public ObjSearchCustomer: any;

  public HideShowSaveButton = true;

  public ProfileImageSrc: string = './assets/media/logos/profilepicturelogo.png';
  public fileNameProfile: string;
  public ProfileImageData: any;


  public UrduFatherName: string = '';
  public UrduName: string = '';
  public UrduBirthPlace: string = '';
  public UrduCurrentAddress: string = '';
  public UrduPermanentAddress: string = '';


  public div_EmployeeShow: boolean = false;

  CurrentDate: any;

  public Namereadoly: boolean = false;
  public FatherNamereadoly: boolean = false;
  public Dobreadoly: boolean = false;
  public CnicExpiryreadoly: boolean = false;
  public CurrentAddressreadoly: boolean = false;
  public PresentAddressreadoly: boolean = false;

  public CNICCustomError: string = '';

  public IsLoadPreviousData: boolean = false;

  public PassportSterik: boolean = true;


  //////////////
  //Search filters
  public searchFilterCtrl: FormControl = new FormControl();
  public searchFilterCtrlCaste: FormControl = new FormControl();
  public searchFilterCtrlPostCode: FormControl = new FormControl();
  public searchFilterCtrlOccupation: FormControl = new FormControl();

  public CasteLovFull: any;
  public PostCodeLovFull: any;
  public OccupationLovFull: any;


  //todayMax = new Date(2021, 5, 29);
  todayMin = new Date(2021, 5, 1);
  todayMax = new Date();
  //todayMin = new Date();

  bit: any;


  ////
  //for search box
  //https://www.npmjs.com/package/ngx-mat-select-search

  constructor(
    // public dialogRef: MatDialogRef<RoleEditComponent>,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private _customerService: CustomerService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private _common: CommonService,
    private spinner: NgxSpinnerService
  ) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;


  }

  ngOnInit() {

    debugger;
    this.images.push(this.ProfileImageSrc);
    debugger;
    this.bit = localStorage.getItem('CreateCustomerBit');

    if (this.bit == null || this.bit == undefined || this.bit == '' || this.bit == '10') {
      localStorage.setItem('CreateCustomerBit', '1');

      this.router.navigate(['/customer/check-eligibility'], {relativeTo: this.activatedRoute});
      this.IsLoadPreviousData = false;
      return;
    }

    //else if (bit == '2' || bit == '5') {
    else if (this.bit == '2' || this.bit == '5') {
      this.IsLoadPreviousData = true;
      localStorage.setItem('CreateCustomerBit', '');
    } else {
      this.IsLoadPreviousData = false;
      localStorage.setItem('CreateCustomerBit', '');
    }


    this.CurrentDate = new Date();
    this.CurrentDate = this.datePipe.transform(this.CurrentDate, MaskEnum.DateFormat);

    debugger;
    this.LoadLovs();

    this.createCustomer = JSON.parse(localStorage.getItem('SearchCustomerStatus'));

    this.createForm();

    if (this.IsLoadPreviousData) {
      this.LoadPreviousData();
    }


    // listen for search field value changes
    this.searchFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDistricts();
      });


    // Caste listen for search field value changes
    this.searchFilterCtrlCaste.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCaste();
      });

    // Caste listen for search field value changes
    this.searchFilterCtrlPostCode.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPostCode();
      });

    // Caste listen for search field value changes
    this.searchFilterCtrlOccupation.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOccupation();
      });

  }

  private filterDistricts() {
    debugger;
    // get the search keyword
    let search = this.searchFilterCtrl.value;
    this.DistrictLov.LOVs = this.DistrictLovFull.LOVs;

    if (!search) {
      //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

      this.DistrictLov.LOVs = this.DistrictLovFull.LOVs;

    } else {
      search = search.toLowerCase();
      this.DistrictLov.LOVs = this.DistrictLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
    }

  }

  private filterCaste() {

    // get the search keyword
    let search = this.searchFilterCtrlCaste.value;
    this.CasteLov.LOVs = this.CasteLovFull.LOVs;

    if (!search) {
      //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

      this.CasteLov.LOVs = this.CasteLovFull.LOVs;

    } else {
      search = search.toLowerCase();
      this.CasteLov.LOVs = this.CasteLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
    }

  }

  private filterPostCode() {

    // get the search keyword
    let search = this.searchFilterCtrlPostCode.value;
    this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;

    if (!search) {
      //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

      this.PostCodeLov.LOVs = this.PostCodeLovFull.LOVs;

    } else {
      search = search.toLowerCase();
      this.PostCodeLov.LOVs = this.PostCodeLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
    }

  }

  private filterOccupation() {

    // get the search keyword
    let search = this.searchFilterCtrlOccupation.value;
    this.OccupationLov.LOVs = this.OccupationLovFull.LOVs;

    if (!search) {
      //this.DistrictLov.LOVs.next(this.DistrictLov.LOVs.slice());

      this.OccupationLov.LOVs = this.OccupationLovFull.LOVs;

    } else {
      search = search.toLowerCase();
      this.OccupationLov.LOVs = this.OccupationLov.LOVs.filter(x => x.Name.toLowerCase().indexOf(search) > -1);
    }

  }

  convertDateToString(dateToBeConverted: string) {
    return moment(dateToBeConverted, 'YYYY-MM-DD HH:mm:ss').format('DD-MMM-YYYY');
  }

  createForm() {

    var userInfo = this.userUtilsService.getUserDetails();
    this.BranchLov = userInfo.Branch;
    this.ZoneLov = userInfo.Zone;

    debugger;
    this.createCustomer.Zone = this.ZoneLov.ZoneName;
    this.createCustomer.Branch = this.BranchLov.Name;
    this.roleForm = this.formBuilder.group({
      Zone: [this.createCustomer.Zone],
      Branch: [this.createCustomer.Branch],
      Cnic: [this.createCustomer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
      Dob: [this._common.stringToDate(this.createCustomer.Dob)],
      CnicIssueDate: [this._common.stringToDate(this.createCustomer.CnicIssueDate), [Validators.required]],
      CnicExpiry: [this._common.stringToDate(this.createCustomer.CnicExpiry)],
      //Dob: [this.createCustomer.Dob],
      //CnicIssueDate: [this.createCustomer.CnicIssueDate, [Validators.required]],
      //CnicExpiry: [this.createCustomer.CnicExpiry],
      Gender: [this.createCustomer.Gender, [Validators.required]],
      MaritalStatus: [this.createCustomer.MaritalStatus],
      CustomerName: [this.createCustomer.CustomerName, [Validators.required]],
      FatherName: [this.createCustomer.FatherName, [Validators.required]],
      HusbandName: [this.createCustomer.HusbandName],
      FatherOrHusbandCnic: [this.createCustomer.FatherOrHusbandCnic],

      MotherName: [this.createCustomer.MotherName, [Validators.required]],
      Occupation: [this.createCustomer.Occupation, [Validators.required]],
      BankEmp: [this.createCustomer.BankEmp],
      MarkOfIdentification: [this.createCustomer.MarkOfIdentification],
      Ntn: [this.createCustomer.Ntn, [Validators.pattern(regExps.ntn)]],
      District: [this.createCustomer.District],
      Citizenship: [this.createCustomer.CitizenShip, [Validators.required]],
      CellNumber: [this.ValidateMobileNumberSet(), [Validators.required, Validators.pattern(regExps.mobile)]],
      PhoneNumber: [this.createCustomer.PhoneNumber, [Validators.pattern(regExps.seventothirteen)]],
      OfficePhoneNumber: [this.createCustomer.OfficePhoneNumber, [Validators.pattern(regExps.seventothirteen)]],
      FaxNumber: [this.createCustomer.FaxNumber, [Validators.pattern(regExps.seventothirteen)]],
      Email: [this.createCustomer.Email, [Validators.pattern(regExps.email)]],
      BrowserStatus: [this.createCustomer.BrowserStatus, [Validators.required]],
      Education: [this.createCustomer.Education, [Validators.required]],
      Caste: [this.createCustomer.Caste, [Validators.required]],
      Religion: [this.createCustomer.Religion, [Validators.required]],
      BirthPlace: [this.createCustomer.BirthPlace],
      RiskCategory: [this.createCustomer.RiskCategory],
      PremisesFlag: [this.createCustomer.PremisesFlag],
      BusinessProfPos: [this.createCustomer.BusinessProfPos],
      FamilyNumber: [this.createCustomer.FamilyNumber, [Validators.pattern(regExps.familyNumber)]],
      // BankEmpPPNo: [this.createCustomer.BankEmp, [Validators.required]],
      PostCode: [this.createCustomer.PostCode, [Validators.required]],
      CurrentAddress: [this.createCustomer.CurrentAddress, [Validators.required]],
      PassportNumber: [this.createCustomer.PassportNumber],
      PermanentAddress: [this.createCustomer.PermanentAddress, [Validators.required]],
      Remarks: [this.createCustomer.Remarks],
      OldCnic: [this.createCustomer.OldCnic],
      //FamilyNo: [this.createCustomer.FamilyNo],
      // PlaceOfBirth: [this.createCustomer.PlaceOfBirth],
      EmployeeNo: [this.createCustomer.EmployeeNo],
      //FatherSpouseCnic: [this.createCustomer.FatherSpouseCnic],
      //BusinessProfPosition: [this.createCustomer.BusinessProfPosition],
      NDCPDFLink: [this.createCustomer.NDCPDFLink],
      ECIBPDFLink: [this.createCustomer.ECIBPDFLink],

      // PhoneOff: [this.createCustomer.PhoneOff]
      //  ProfilePicture: ['', Validators.required]
    });

    // const branchWorkingDate = new Date(year, month - 1, day);
    // this.roleForm.controls.EffectiveDate.setValue(branchWorkingDate);

    if (this.roleForm.controls.Gender.value == undefined || this.roleForm.controls.Gender.value == null || this.roleForm.controls.Gender.value == '') {
      debugger
      this.cnicfocusout();
    }


    //this.cnicfocusout();
    this.GenderChange(null);


    //this.roleForm.controls['Dob'].setValue(this.createCustomer.Dob);
    //this.roleForm.controls['CnicExpiry'].setValue(this.createCustomer.Dob);
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.roleForm.controls[controlName].hasError(errorName);
  }

  get f(): any {
    if (typeof this.roleForm != 'undefined') {
      return this.roleForm.controls;

    } else {
      return false;
    }
  }

  onSubmit(flag): void {

    if (flag == true) {

    }

    debugger;
    this.hasFormErrors = false;
    const controls = this.roleForm.controls;

    //this.roleForm.controls['Zone'].setValue('0');// = '0';
    //this.roleForm.controls['Branch'].setValue('0');


    if (this.roleForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      Object.keys(controls).forEach(controlName =>
        console.log(controls[controlName])
      );

      this.hasFormErrors = true;

      return;
    }


    this.createCustomer = Object.assign(this.createCustomer, this.roleForm.getRawValue());

    if (this.createCustomer.Email == null) {
      this.createCustomer.Email = '';
    }

    if (this.createCustomer.BirthPlace == null) {
      this.createCustomer.BirthPlace = '';
    }

    if (this.createCustomer.FaxNumber == null) {
      this.createCustomer.FaxNumber = '';
    }

    if (this.createCustomer.PremisesFlag == null) {
      this.createCustomer.PremisesFlag = '';
    }

    if (this.createCustomer.BusinessProfPos == null) {
      this.createCustomer.BusinessProfPos = '';
    }

    if (this.createCustomer.FamilyNumber == null) {
      this.createCustomer.FamilyNumber = '';
    }

    if (this.createCustomer.Remarks == null) {
      this.createCustomer.Remarks = '';
    }


    if (this.createCustomer.OfficePhoneNumber == null) {
      this.createCustomer.OfficePhoneNumber = '';
    }

    if (this.createCustomer.PhoneNumber == null) {
      this.createCustomer.PhoneNumber = '';
    }

    if (this.createCustomer.RiskCategory == null) {
      this.createCustomer.RiskCategory = '';
    }

    if (this.createCustomer.District == null) {
      this.createCustomer.District = 0;
    }

    if (this.createCustomer.Ntn == null) {
      this.createCustomer.Ntn = '';
    }

    if (this.createCustomer.MarkOfIdentification == null) {
      this.createCustomer.MarkOfIdentification = '';
    }

    if (this.createCustomer.FatherOrHusbandCnic == null) {
      this.createCustomer.FatherOrHusbandCnic = '';
    }

    if (this.createCustomer.MaritalStatus == null) {
      this.createCustomer.MaritalStatus = '';
    }

    if (this.createCustomer.OldCnic == null) {
      this.createCustomer.OldCnic = '';
    }

    if (this.createCustomer.BirthPlace == null) {
      this.createCustomer.BirthPlace = '';
    }

    if (this.createCustomer.EmployeeNo == null) {
      this.createCustomer.EmployeeNo = 0;
    }

    if (this.createCustomer.HusbandName == null) {
      this.createCustomer.HusbandName = '';
    }

    if (this.createCustomer.NDCPDFLink == null) {
      this.createCustomer.NDCPDFLink = '';
    }

    if (this.createCustomer.ECIBPDFLink == null) {
      this.createCustomer.ECIBPDFLink = '';
    }

    if (this.createCustomer.BankEmp == null) {
      this.createCustomer.BankEmp = 0;
    }

    if (this.createCustomer.PassportNumber == null) {
      this.createCustomer.PassportNumber = '';
    }


    this.createCustomer.CellNumber = this.ValidateMobileNumberGet();
    this.createCustomer.doSubmit = flag;


    var userInfo = this.userUtilsService.getUserDetails();
    this.BranchLov = userInfo.Branch;
    this.ZoneLov = userInfo.Zone;

    this.createCustomer.Zone = userInfo.Zone.ZoneId;
    this.createCustomer.Branch = userInfo.Branch.BranchId;


    this.createCustomer.Dob = this.datePipe.transform(this.createCustomer.Dob, 'ddMMyyyy');
    this.createCustomer.CnicExpiry = this.datePipe.transform(this.createCustomer.CnicExpiry, 'ddMMyyyy');
    this.createCustomer.CnicIssueDate = this.datePipe.transform(this.createCustomer.CnicIssueDate, 'ddMMyyyy');

    this.spinner.show();
    this._customerService.createCustomerSave(this.createCustomer)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        var pic = this.ProfileImageData;
        if (baseResponse.Success) {
          if (this.ProfileImageData != undefined || this.ProfileImageData != null) {
            this.UploadProfilePicture();
          } else {
            const dialogRef = this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);

            dialogRef.afterClosed().subscribe(res => {
              debugger;
              this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
              //if (res) {
              //  this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
              //}
            });


          }
        } else {

          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
        }
      });


  }

  UploadProfilePicture() {

    this._customerService.UploadImagesCallAPI(this.ProfileImageData, this.createCustomer.CustomerNumber)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          debugger;
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
          this.goBackWithId();
        } else {
          debugger;
          this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
        }
      });


  }

  getTitle(): string {

    return 'Create Customer';
    //if (this.data.profile.ProfileID > 0) {

    //  return 'Edit Role';
    //}
    //return 'New Role';
  }

  close(result: any): void {
    // this.dialogRef.close(result);
  }

  onAlertClose($event) {
    // this.hasFormErrors = false;
  }

  async LoadLovs() {

    //this.ngxService.start();

    this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Education});
    this.CasteLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Cast});
    this.ReligionLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Religions});
    this.RiskCategoryLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.RiskCategory});
    this.PremisesFlagLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PremisesFlag});
    this.BankEmpNoLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Employee});
    this.MaritalStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.MaritalStatus});
    this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
    this.OccupationLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Occupation});
    this.DistrictLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.District});
    this.BorrowerStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BorrowerStatus});
    this.CitizenshipLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Nationality});

    this.PostCodeLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode});


    ////For Search
    this.DistrictLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.District});

    //For Caste
    this.CasteLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Cast});
    this.CasteLovFull.LOVs = this._lovService.SortLovs(this.CasteLovFull.LOVs);

    //For Post Code
    this.PostCodeLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.PostalCode});
    this.PostCodeLovFull.LOVs = this._lovService.SortLovs(this.PostCodeLovFull.LOVs);


    //For Occupation
    this.OccupationLovFull = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Occupation});
    this.OccupationLovFull.LOVs = this._lovService.SortLovs(this.OccupationLovFull.LOVs);


    this.DistrictLovFull.LOVs = this._lovService.SortLovs(this.DistrictLovFull.LOVs);
    this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov.LOVs);

    this.EducationLov.LOVs = this._lovService.SortLovs(this.EducationLov.LOVs);
    this.CasteLov.LOVs = this._lovService.SortLovs(this.CasteLov.LOVs);

    if (this.bit == '2') {
      var currentCaste = this.CasteLov.LOVs.filter(x => x.Id == this.createCustomer.Caste.toString())[0];
      this.roleForm.controls.Caste.setValue(currentCaste.Value);
    }


    //console.log('cast lov')
    //console.log(this.CasteLov.LOVs)

    debugger;
    this.ReligionLov.LOVs = this._lovService.SortLovs(this.ReligionLov.LOVs);
    this.RiskCategoryLov.LOVs = this._lovService.SortLovs(this.RiskCategoryLov.LOVs);
    this.PremisesFlagLov.LOVs = this._lovService.SortLovs(this.PremisesFlagLov.LOVs);
    this.BankEmpNoLov.LOVs = this._lovService.SortLovs(this.BankEmpNoLov.LOVs);
    this.MaritalStatusLov.LOVs = this._lovService.SortLovs(this.MaritalStatusLov.LOVs);
    this.GenderLov.LOVs = this._lovService.SortLovs(this.GenderLov.LOVs);
    this.OccupationLov.LOVs = this._lovService.SortLovs(this.OccupationLov.LOVs);
    this.DistrictLov.LOVs = this._lovService.SortLovs(this.DistrictLov.LOVs);
    this.BorrowerStatusLov.LOVs = this._lovService.SortLovs(this.BorrowerStatusLov.LOVs);
    this.CitizenshipLov.LOVs = this._lovService.SortLovs(this.CitizenshipLov.LOVs);

    this.PostCodeLov.LOVs = this._lovService.SortLovs(this.PostCodeLov.LOVs);


    debugger;

    var userInfo = this.userUtilsService.getUserDetails();
    this.BranchLov = userInfo.Branch;
    this.ZoneLov = userInfo.Zone;

  }


  //////////Change events

  GenderChange($event) {
    debugger

    var MaritalStatus = this.roleForm.controls['MaritalStatus'].value;
    var GenderStatus = this.roleForm.controls['Gender'].value;


    if (GenderStatus == 'F') {

      if (MaritalStatus == 'M' || MaritalStatus == 'W') {
        this.HusbandNameShow = true;
        this.roleForm.controls['HusbandName'].setValidators([Validators.required]);
      } else {
        this.HusbandNameShow = false;

        this.roleForm.controls['HusbandName'].clearValidators();
        this.roleForm.controls['HusbandName'].updateValueAndValidity();
      }
    } else if (GenderStatus == 'M') {
      this.HusbandNameShow = false;

      this.roleForm.controls['HusbandName'].clearValidators();
      this.roleForm.controls['HusbandName'].updateValueAndValidity();
    }

  }

  OccupationChange($event) {
    debugger;
    var Occupation = this.roleForm.controls['Occupation'].value;

    if (Occupation == '1') {


      this.roleForm.controls['BankEmp'].setValidators([Validators.required]);
      this.roleForm.controls['BankEmp'].setErrors({'required': true});

      this.div_EmployeeShow = true;

    } else {


      this.roleForm.controls['BankEmp'].clearValidators();
      this.roleForm.controls['BankEmp'].updateValueAndValidity();
      this.div_EmployeeShow = false;
    }


  }

  CitizenshipChange($event) {

    var Citizenship = this.roleForm.controls['Citizenship'].value;

    if (Citizenship == '1') {

      this.roleForm.controls['PassportNumber'].clearValidators();
      this.roleForm.controls['PassportNumber'].updateValueAndValidity();
      this.PassportSterik = false;

    } else {


      this.roleForm.controls['PassportNumber'].setValidators([Validators.required]);
      this.roleForm.controls['PassportNumber'].setErrors({'required': true});
      this.PassportSterik = true;


    }

    this.roleForm.controls['PassportNumber'].updateValueAndValidity();

  }

  LoadPreviousData() {
    debugger;
    this.ObjSearchCustomer = JSON.parse(localStorage.getItem('SearchCustomerStatus'));


    if (this.ObjSearchCustomer != null && this.ObjSearchCustomer != '') {


      this.spinner.show();
      this._customerService.GetCustomer(this.ObjSearchCustomer)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe(baseResponse => {
          debugger;
          if (baseResponse.Success) {
            var customerobj = baseResponse.Customer;
            console.log(this.CasteLov);
            this.createCustomer = customerobj;
            if (this.createCustomer.FatherOrHusbandCnic != undefined && this.createCustomer.FatherOrHusbandCnic != null) {
              this.createCustomer.FatherOrHusbandCnic = parseInt(this.createCustomer.FatherOrHusbandCnic).toString();
            } else {
              this.createCustomer.FatherOrHusbandCnic = '';
            }

            if (this.createCustomer.FaxNumber != undefined && this.createCustomer.FaxNumber != null) {
              this.createCustomer.FaxNumber = parseInt(this.createCustomer.FaxNumber).toString();
            } else {
              this.createCustomer.FaxNumber = '';
            }
            //this.createCustomer.FaxNumber = && this.createCustomer.FaxNumber != null ? parseInt(this.createCustomer.FaxNumber).toString() : "";
            this.createForm();
            this.ReadWriteForm();


            try {

              if (customerobj.ProfilePicturePath != null && customerobj.ProfilePicturePath != undefined) {

                debugger;
                var PreviousUploadProfile = customerobj.ProfilePicturePath;
                if (PreviousUploadProfile != undefined && PreviousUploadProfile != null) {
                  debugger;
                  this.images = [];
                  this.images.push(PreviousUploadProfile);

                }

              }

            } catch (e) {

            }

            try {

              this.UrduFatherName = customerobj.UrduFatherName;
              this.UrduName = customerobj.UrduName;
              this.UrduBirthPlace = customerobj.UrduBirthPlace;
              this.UrduCurrentAddress = customerobj.UrduCurrentAddress;
              this.UrduPermanentAddress = customerobj.UrduPermanentAddress;

            } catch (e) {

            }

            this.cdRef.detectChanges();


          }


          this.createForm();
          this.cdRef.detectChanges();
          //else
          //  this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });

    }


  }

  ValidateMobileNumberSet() {

    var Mob = this.createCustomer.CellNumber;


    if (Mob != null && Mob != undefined && Mob != '') {
      var MobLength = Mob.length;

      if (Mob.length == 14) {
        return Mob.substring(5);
      }

      if (Mob.length == 13) {
        return Mob.substring(4);
      } else if (Mob.length == 12) {
        return Mob.substring(3);
      } else {
        return Mob;
      }

    } else {
      Mob = '';
    }


  }

  ValidateMobileNumberGet() {

    var Mob = this.createCustomer.CellNumber;


    if (Mob != null && Mob != undefined && Mob != '') {
      var MobLength = Mob.length;
      if (Mob.length == 8) {
        return Mob = '+923' + Mob;
      } else {
        return Mob;
      }

    }

  }

  ReadWriteForm() {

    var customerStatus = JSON.parse(localStorage.getItem('SearchCustomerStatus'));
    debugger;
    if (customerStatus.CustomerStatus.toLowerCase() == 'a' || customerStatus.CustomerStatus.toLowerCase() == 'p') {
      this.roleForm.disable();
      //this.roleForm.controls["Gender"].disabled;
      this.isGenderDisabled = true;
      this.HideShowSaveButton = false;
      this.CurrentAddressreadoly = true;
    } else {
      this.CurrentAddressreadoly = false;

      this.roleForm.controls['PermanentAddress'].updateValueAndValidity();
    }


    this.GenderChange(null);
    this.CitizenshipChange(null);
    this.OccupationChange(null);
    //this.cnicfocusout();

    try {

      debugger;
      this.Namereadoly = this._lovService.IsReadonly(this.roleForm.controls['CustomerName'].value);
      this.FatherNamereadoly = this._lovService.IsReadonly(this.roleForm.controls['FatherName'].value);
      this.Dobreadoly = this._lovService.IsReadonly(this.roleForm.controls['Dob'].value);
      this.CnicExpiryreadoly = this._lovService.IsReadonly(this.roleForm.controls['CnicExpiry'].value);
      //this.CurrentAddressreadoly = this._lovService.IsReadonly(this.roleForm.controls['CurrentAddress'].value);
      this.PresentAddressreadoly = this._lovService.IsReadonly(this.roleForm.controls['PermanentAddress'].value);


    } catch (e) {


    }


  }//end of read write function

  goBackWithId() {

    this.router.navigate(['/customer/search-customer'], {relativeTo: this.activatedRoute});
  }

  ///////End of change events////////////////


  ngAfterViewInit() {


  }


  onFileSelected(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileNameProfile = file.name;

      var Name = file.name.split('.').pop();
      if (Name != undefined) {
        if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'png' || Name.toLowerCase() == 'jpeg') {
          //this.roleForm.controls['ProfilePicture'].setValue(file);
          var reader = new FileReader();

          reader.onload = (event: any) => {

            this.images.push(event.target.result);

            this.ProfileImageData = file;

            this.roleForm.patchValue({
              fileSource: this.images
            });
          };
          reader.readAsDataURL(event.target.file);
        }
      } else {
        this.layoutUtilsService.alertElementSuccess('Only jpeg, png, jpg files are allowed', 'Only jpeg, png, jpg files are allowed', '99');

        event.srcElement.value = null;
      }
    }
  }

  onFileChange(event) {
    debugger
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var file = event.target.files[0];

      var Name = file.name.split('.').pop();
      if (Name != undefined) {
        if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'png' || Name.toLowerCase() == 'jpeg') {

          for (let i = 0; i < filesAmount; i++) {

            this.images = [];
            var reader = new FileReader();

            reader.onload = (event: any) => {
              debugger;

              this.images.push(event.target.result);

              this.ProfileImageData = file;
              this.roleForm.patchValue({
                fileSource: this.images
              });
            };
            reader.readAsDataURL(event.target.files[i]);
          }
          this.cdRef.detectChanges();
        } else {
          this.layoutUtilsService.alertElementSuccess('Only jpeg, png, jpg files are allowed', 'Only jpeg, png, jpg files are allowed', '99');

          event.srcElement.value = null;

          return;
        }
      }

    }
  }


  onPickerClosed() {

    debugger;
    var Dob = this.roleForm.controls['Dob'].value;
    var CnicIssue = this.roleForm.controls['CnicIssueDate'].value;
    var CnicExpiry = this.roleForm.controls['CnicExpiry'].value;

    let DobDate = null;// new Date(ldStartDate);
    let CnicIssueDate = null;// new Date(ldStartDate);
    let CnicExpiryDate = null;// new Date(ldStartDate);

    if (CnicIssue != null && CnicIssue != '' && CnicIssue != undefined &&
      Dob != null && Dob != '' && Dob != undefined) {
      CnicIssueDate = new Date(CnicIssue);
      DobDate = new Date(Dob);


      var DifferenceFirst = Math.floor((CnicIssueDate.getFullYear()) - DobDate.getFullYear());
      if (DifferenceFirst < 18) {
        this.roleForm.controls['CnicIssueDate'].setErrors({'invaliddaterange': true});
        this.CNICCustomError = 'Date of Birth and CNIC Issue difference should be at least 18 years';
        return;
      } else {
        this.CNICCustomError = '';
        // this.roleForm.controls['CnicIssueDate'].setErrors({ 'invaliddaterange': null });

        this.roleForm.controls['CnicIssueDate'].clearValidators();
        this.roleForm.controls['CnicIssueDate'].updateValueAndValidity();

      }

    }

    if (CnicIssue != null && CnicIssue != '' && CnicIssue != undefined &&
      CnicExpiry != null && CnicExpiry != '' && CnicExpiry != undefined) {
      CnicIssueDate = new Date(CnicIssue);
      CnicExpiryDate = new Date(CnicExpiry);


      var DifferenceFirst = Math.floor((CnicExpiryDate.getFullYear()) - CnicIssueDate.getFullYear());
      if (DifferenceFirst < 5) {
        this.roleForm.controls['CnicIssueDate'].setErrors({'invaliddaterange': true});
        this.CNICCustomError = 'CNIC Issue and Expiry date difference should be at least 5 years';
        return;
      } else {
        this.CNICCustomError = '';
        //this.roleForm.controls['CnicIssueDate'].setErrors({ 'invaliddaterange': null });

        this.roleForm.controls['CnicIssueDate'].clearValidators();
        this.roleForm.controls['CnicIssueDate'].updateValueAndValidity();

      }

    }


  }

  cnicfocusout() {
    debugger;
    var Cnic = this.roleForm.controls['Cnic'].value;
    if (Cnic != '' && Cnic != undefined && Cnic != null && Cnic.length == 13) {

      var lastDigit = Cnic.substring(Cnic.length - 1);

      if (lastDigit % 2 == 0)///Means Female
      {
        this.roleForm.controls['Gender'].setValue('F');
      } else // Means Male as cnic last digit is odd
      {
        this.roleForm.controls['Gender'].setValue('M');
      }


    }


  }

  checkSequentialPhone() {
    debugger;
    var Input = this.roleForm.controls['PhoneNumber'].value;

    if (Input != '' && Input != null && Input != undefined) {

      if (this._common.isMatchSequentialInput(Input)) {
        this.roleForm.controls['PhoneNumber'].setErrors({'sequentialError': true});
      } else {

        //
        this.roleForm.controls['PhoneNumber'].setErrors({'sequentialError': null});
        this.roleForm.controls['PhoneNumber'].updateValueAndValidity();
      }


    }


  }

  checkSequentialFax() {
    debugger;
    var Input = this.roleForm.controls['FaxNumber'].value;

    if (Input != '' && Input != null && Input != undefined) {

      if (this._common.isMatchSequentialInput(Input)) {
        this.roleForm.controls['FaxNumber'].setErrors({'sequentialError': true});
      } else {

        //
        this.roleForm.controls['FaxNumber'].setErrors({'sequentialError': null});
        this.roleForm.controls['FaxNumber'].updateValueAndValidity();
      }


    }


  }

  checkSequentialCell() {
    debugger;
    var Input = this.roleForm.controls['CellNumber'].value;

    if (Input != '' && Input != null && Input != undefined) {

      if (this._common.isMatchSequentialInput(Input)) {
        this.roleForm.controls['CellNumber'].setErrors({'sequentialError': true});
      } else {

        //
        this.roleForm.controls['CellNumber'].setErrors({'sequentialError': null});
        this.roleForm.controls['CellNumber'].updateValueAndValidity();
      }


    }


  }

  checkSequentialNtn() {
    debugger;
    var Input = this.roleForm.controls['Ntn'].value;

    if (Input != '' && Input != null && Input != undefined) {

      if (this._common.isMatchSequentialInput(Input)) {
        this.roleForm.controls['Ntn'].setErrors({'sequentialError': true});
      } else {

        //
        this.roleForm.controls['Ntn'].setErrors({'sequentialError': null});
        this.roleForm.controls['Ntn'].updateValueAndValidity();
      }


    }


  }

}//end of class
