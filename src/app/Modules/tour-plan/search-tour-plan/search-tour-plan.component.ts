// Angular
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
// Material
// RXJS
import {finalize} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../../core/reducers';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {CreateCustomer} from '../../../core/auth/_models/customer.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {LovService} from '../../../core/auth/_services/lov.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {Zone} from '../../../core/auth/_models/zone.model';
import {Branch} from '../../../core/auth/_models/branch.model';
import {LoanUtilizationService} from '../../../core/auth/_services/loan-utilization.service';
import {TourPlanService} from '../../../core/auth/_services/tour-plan.service';
import {TourPlan} from '../../../core/auth/_models/tour-plan.model';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {errorMessages, Lov, MaskEnum} from '../../../core/auth/_models/lov.class';

// Services


@Component({
    selector: 'kt-search-tour-plan',
    templateUrl: './search-tour-plan.component.html'
})
export class SearchTourPlanComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @Input() isDialog: any = false;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;


    userInfo;
    gridHeight: string;
    TourPlan: FormGroup;
    myDate = new Date().toLocaleDateString();
    isMCO = false;
    isBM = false;
    circle;
    circleNo;
    loggedInUser: any;
    public maskEnums = MaskEnum;
    errors = errorMessages;
    public LovCall = new Lov();
    public CustomerStatusLov: any;
    _customer: CreateCustomer = new CreateCustomer();
    _TourPlan =  new TourPlan;
    public Zone = new Zone();
    public Branch = new Branch();
    Zones: any = [];
    SelectedZones: any = [];
    Branches: any = [];
    SelectedBranches: any = [];
    isUserAdmin = false;
    isZoneUser = false;
    loggedInUserDetails: any;
    loanutilizationStatusLov;
    TourPlansByDate;
    minDate: Date;
    fromdate: string;
    todate: string;
    Today = new Date;

    constructor(private store: Store<AppState>,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                public snackBar: MatSnackBar,
                private filterFB: FormBuilder,
                private router: Router,
                private spinner: NgxSpinnerService,
                private _loanutilizationService: LoanUtilizationService,
                private tourPlanService: TourPlanService,
                private _lovService: LovService,
                private layoutUtilsService: LayoutUtilsService,
                private _circleService: CircleService,
                private _cdf: ChangeDetectorRef,
                private userUtilsService: UserUtilsService) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit() {

        this.setUsers();
        // if (this.isDialog)
        //   this.displayedColumns = ["LoanCaseNo",
        //   // "GlCode",
        //   "Status",
        //   "Remarks",
        //   "Lng",
        //   "Lat",
        //   "Actions",]
        // else
        //  this.displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View']

        this.LoadLovs();
        this.createForm();
        this.setCircles();
        this.getTourPlan();
        const userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;

    }


  setUsers() {
      const userInfo = this.userUtilsService.getUserDetails();
      this.userInfo = this.userUtilsService.getUserDetails();
      // console.log(userInfo);
      // MCO User
      if (userInfo.User.userGroup[0].ProfileID === '56') {
          this.isMCO = true;
      }

      if (userInfo.User.userGroup[0].ProfileID === '57') {
          this.isBM = true;
      }

      if (this.isUserAdmin || this.isZoneUser) {
          userInfo.Branch = {};
          if (this.Branch.BranchCode !== undefined) {
              userInfo.Branch.BranchId = this.Branch.BranchCode;
          } else {
              userInfo.Branch.BranchId = 0;
          }
      }
      if (this.isUserAdmin) {
          userInfo.Zone = {};
          if (this.Zone.ZoneId !== undefined) {
              userInfo.Zone.ZoneId = this.Zone.ZoneId;
          } else {
              userInfo.Zone.ZoneId = 0;
          }
      }

  }
  setCircles() {
    this._circleService.GetCircleByBranchId()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
          console.log(baseResponse);
          if (baseResponse.Success) {
              this.circle = baseResponse.Circles;

          } else {
              this.layoutUtilsService.alertElement('', baseResponse.Message);
          }
      });
  }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
        // var userInfo = this.userUtilsService.getUserDetails();
        // this.TourPlan.controls['Zone'].setValue(userInfo.Zone.ZoneName);
        // this.TourPlan.controls['Branch'].setValue(userInfo.Branch.Name);
    }

    // CheckEditStatus(loanUtilization: any) {
    //   debugger

    //   if () {
    //     return true
    //   }
    //   else {
    //     return false
    //   }
    // }

    setFromDate() {

        // this.TourPlan.controls.FromDate.reset();
        this.minDate = this.TourPlan.controls.FromDate.value.toDate();
        let FromDate = this.TourPlan.controls.FromDate.value;
        if (FromDate._isAMomentObject === undefined) {
            try {
                let day = this.TourPlan.controls.FromDate.value.getDate();
                let month = this.TourPlan.controls.FromDate.value.getMonth() + 1;
                const year = this.TourPlan.controls.FromDate.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.fromdate = branchWorkingDate.toString();
                this.TourPlan.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                let day = this.TourPlan.controls.FromDate.value.toDate().getDate();
                let month = this.TourPlan.controls.FromDate.value.toDate().getMonth() + 1;
                const year = this.TourPlan.controls.FromDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                FromDate = day + '' + month + '' + year;

                this.fromdate = FromDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.FromDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    setToDate() {
        let ToDate = this.TourPlan.controls.ToDate.value;
        if (ToDate._isAMomentObject === undefined) {
            try {
                let day = this.TourPlan.controls.ToDate.value.getDate();
                let month = this.TourPlan.controls.ToDate.value.getMonth() + 1;
                const year = this.TourPlan.controls.ToDate.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                let day = this.TourPlan.controls.ToDate.value.toDate().getDate();
                let month = this.TourPlan.controls.ToDate.value.toDate().getMonth() + 1;
                const year = this.TourPlan.controls.ToDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                ToDate = day + '' + month + '' + year;
                this.todate = ToDate;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourPlan.controls.ToDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    getToday() {
        // Today

        if (this.TourPlan.controls.ToDate.value) {
            this.Today = this.TourPlan.controls.ToDate.value;
            return this.Today;
        } else {

            this.Today = new Date();
            // console.log(this.Today);
            // console.log(this.Today.toISOString().split('T')[0]);
            return this.Today;
        }
    }

  getTodayForTo() {
      return new Date().toISOString().split('T')[0];
  }



  CheckEditStatus(loanUtilization: any) {
      // tslint:disable-next-line:no-unused-expression
      this.loggedInUserDetails.User.UserId;
      if (this.isMCO) {
          if (loanUtilization.Status === 'P' || loanUtilization.Status === 'R') {
              if (loanUtilization.CreatedBy === this.loggedInUserDetails.User.UserId) {
                  return true;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      } else if (this.isBM) {
          if (loanUtilization.Status === 'S') {
              return true;
          }
      } else {
          return false;
      }
  }

  CheckViewStatus(loanUtilization: any) {
    if (this.isMCO) {
        if (loanUtilization.Status === 'C' || loanUtilization.Status === 'S' || loanUtilization.Status === 'A') {
            if (loanUtilization.CreatedBy === this.loggedInUserDetails.User.UserId) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    else if (this.isBM) {
        if (loanUtilization.Status === 'C' || loanUtilization.Status === 'P' || loanUtilization.Status === 'R' || loanUtilization.Status === 'A') {
            return true;
        }
    } else {
        return false;
    }

  }




  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  createForm() {
      const userInfo = this.userUtilsService.getUserDetails();
      this.TourPlan = this.filterFB.group({
          Zone: [userInfo.Zone.ZoneName],
          Branch: [userInfo.Branch.Name],
          FromDate: [],
          ToDate: [],
          Status: ['', Validators.required],
          CircleId: []
      });

  }

  GetZones() {

    this.loading = true;
    this._circleService.getZones()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        if (baseResponse.Success) {

            baseResponse.Zones.forEach((value) => {
                value.ZoneName = value.ZoneName.split('-')[1];
            });
            this.Zones = baseResponse.Zones;
            this.SelectedZones = baseResponse.Zones;

            // this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
            // this.GetBranches(this.Zones[0].ZoneId);
            this.loading = false;
            this._cdf.detectChanges();
        } else {
            this.layoutUtilsService.alertElement('', baseResponse.Message);
        }
      });
  }

  SetBranches(branchId) {
    this.Branch.BranchCode = branchId.value;
  }


  GetBranches(ZoneId) {
      this.loading = true;
      this.dataSource.data = [];
      this.Branches = [];
      if (ZoneId.value === undefined) {
          this.Zone.ZoneId = ZoneId;
      } else {
          this.Zone.ZoneId = ZoneId.value;
      }
      this._circleService.getBranchesByZone(this.Zone)
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          ).subscribe(baseResponse => {
          if (baseResponse.Success) {
              this.loading = false;
              // baseResponse.Branches.forEach(function (value) {
              //  value.Name = value.Name.split("-")[1];
              // })

              this.Branches = baseResponse.Branches;
              this.SelectedBranches = baseResponse.Branches;
              // this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
              this._cdf.detectChanges();
          } else {
              this.layoutUtilsService.alertElement('', baseResponse.Message);
          }
      });
  }


  searchBranch(branchId) {
      branchId = branchId.toLowerCase();
      if (branchId != null && branchId !== undefined && branchId !== '') {
          this.SelectedBranches = this.Branches.filter(x => x.Name.toLowerCase().indexOf(branchId) > -1);
      } else {
          this.SelectedBranches = this.Branches;
      }
  }
  validateBranchOnFocusOut() {
      if (this.SelectedBranches.length === 0) {
          this.SelectedBranches = this.Branches;
      }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.TourPlan.controls[controlName].hasError(errorName);
  }

  getTourPlan() {


  }

  SearchTourPlan() {

      this.spinner.show();
      if (!this.TourPlan.controls['Status'].value) {
          this.TourPlan.controls['Status'].setValue('All');
      }
      this._TourPlan = Object.assign(this.TourPlan.value);
      this.tourPlanService.SearchTourPlan(this._TourPlan)
          .pipe(
              finalize(() => {
                  this.loading = false;
                  this.spinner.hide();
              })
          )
          .subscribe(baseResponse => {

              if (baseResponse.Success) {

                  this.TourPlansByDate = baseResponse.TourPlan['TourPlansByDate'];
                  console.log(this.dataSource.data);

              } else {
                  this.layoutUtilsService.alertElement('', baseResponse.Message);
                  this.dataSource.data = [];
              }
          });
  }



  getStatus(status: string) {

      if (status === 'P') {
          return 'Submit';
      } else if (status === 'N') {
          return 'Pending';
      } else if (status === 'A') {
          return 'Authorized';
      } else if (status === 'R') {
          return 'Refer Back';
      }
  }



  exportToExcel() {
      // this.exportActivities = [];
      // Object.assign(this.tempExportActivities, this.dataSource.data);
      // this.tempExportActivities.forEach((o, i) => {
      //  this.exportActivities.push({
      //    activityName: o.activityName,
      //    activityURL: o.activityURL,
      //    parentActivityName: o.parentActivityName
      //  });
      // });
      // this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
  }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
    }

    masterToggle() {

    }


    editloanutilization(utilization: any) {
        console.log(utilization);
        // this.router.navigate(['other']);
        // console.log(this.TourPlan.controls["Status"].value)
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        this.router.navigate(['../loan-uti'], {
            state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }


    viewloanutilization(utilization: any) {
        // this.router.navigate(['other']);
        console.log(utilization);
        utilization.view = '1';
        // console.log(this.TourPlan.controls["Status"].value)
        // utilization = {Status:this.TourPlan.controls["Status"].value}
        this.router.navigate(['../loan-uti'], {
            state: {example: utilization},
            relativeTo: this.activatedRoute
        });
    }

    async LoadLovs() {

        // this.ngxService.start();

        this.loanutilizationStatusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.UtilizationTypes});
        // console.log(this.CustomerStatusLov.LOVs);
        this.loanutilizationStatusLov.LOVs.forEach((value) => {
            if (!value.Value) {
                value.Value = 'All';
            }
        });

        //// For Bill type
        // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

        // this.ngxService.stop();

    }

}
