import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {finalize} from 'rxjs/operators';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {Branch} from '../../../core/auth/_models/branch.model';
import {Zone} from '../../../core/auth/_models/zone.model';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {ReschedulingService} from '../../../core/auth/_services/rescheduling.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Loan} from '../../../core/auth/_models/loan-application-header.model';
import {
    Lov,
    LovConfigurationKey,
    LovData,
    MaskEnum,
    regExps,
    errorMessages,
    DateFormats,
} from '../../../core/auth/_models/lov.class';
import {LovService} from '../../../core/auth/_services/lov.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'kt-search-rc',
    templateUrl: './search-rc.component.html',
    styleUrls: ['./search-rc.component.scss'],
})
export class SearchRcComponent implements OnInit {
    loading: boolean;
    rcSearch: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    isZoneReadOnly: boolean;
    isBranchReadOnly: boolean;

    Math: any;

    // pagination
    itemsPerPage = 10; // you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; // use later

    OffSet: any;

    matTableLenght: boolean;

    // Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    public search = new Loan();
    public LovCall = new Lov();

    // Loan Status inventory
    LoanStatus: any = [];
    loanStatus: any = [];
    SelectedLoanStatus: any = [];

    // Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();
    displayedColumns = [
        'Branch',
        'TransactionDate',
        'LoanApp',
        'GlDescription',
        'Status',
        'Scheme',
        'OldDate',
        'AcStatus',
    ];
    dataSource: MatTableDataSource<SearchRC>;
    ELEMENT_DATA: SearchRC[] = [];
    Mydata: any;
    // Zone inventory
    Circles: any = [];
    SelectedCircles: any = [];

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _circleService: CircleService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private _reschedulingService: ReschedulingService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService
    ) {
        this.Math = Math;
    }

    ngOnInit(): void {
        this.create();
        this.isZoneReadOnly = false;
        this.isBranchReadOnly = false;

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        // -------------------------------Loading Zone-------------------------------//
        this.GetZones();

        // -------------------------------Loading Circle-------------------------------//

        // tslint:disable-next-line:triple-equals
        if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
            this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedCircles = this.Circles;
        }
        // tslint:disable-next-line:triple-equals
        if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
            this.isZoneReadOnly = true;
            this.isBranchReadOnly = true;
        }
        this.getLoanStatus();
    }

    // tslint:disable-next-line:typedef
    create() {
        this.rcSearch = this.fb.group({
            Zone: [''],
            Branch: [''],
            TrDate: [''],
            Lcno: [''],
            Status: [''],
        });
    }

    // tslint:disable-next-line:typedef
    GetZones() {
        this._circleService
            .getZones()
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    // tslint:disable-next-line:only-arrow-functions typedef
                    baseResponse.Zones.forEach(function(value) {
                        value.ZoneName = value.ZoneName.split('-')[1];
                    });
                    this.Zones = baseResponse.Zones;
                    this.SelectedZones = this.Zones;
                    console.log('zone loaded', this.SelectedZones);
                    // tslint:disable-next-line:triple-equals
                    if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
                        this.rcSearch.controls['Zone'].setValue(
                            this.LoggedInUserInfo.Zone.ZoneName
                        );
                        console.log(
                            'this.LoggedInUserInfo.Zone.ZoneId',
                            this.LoggedInUserInfo.Zone.ZoneId
                        );
                        this.GetBranches(this.LoggedInUserInfo.Zone.ZoneId);
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    // tslint:disable-next-line:typedef
    GetBranches(ZoneId) {
        this.Branches = [];
        this.rcSearch.controls['Branch'].setValue(null);
        this.Zone.ZoneId = ZoneId.value;
        this._circleService
            .getBranchesByZone(this.Zone)
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.Branches = baseResponse.Branches;
                    this.SelectedBranches = this.Branches;
                    console.log('Branches loaded', this.SelectedBranches);

                    // tslint:disable-next-line:triple-equals
                    if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
                        this.rcSearch.controls['Branch'].setValue(
                            this.LoggedInUserInfo.Branch.Name
                        );
                        console.log(
                            'this.LoggedInUserInfo.Branch.BranchId',
                            this.LoggedInUserInfo.Branch.BranchId,
                            'this.LoggedInUserInfo.Branch.BranchCode',
                            this.LoggedInUserInfo.Branch.BranchCode
                        );

                    }
                    // this.landSearch.controls['BranchId'].setValue(this.Branches[0].BranchId);
                    this.cdRef.detectChanges();
                }
            });
    }

    // -------------------------------Loan Status Functions-------------------------------//
    // tslint:disable-next-line:typedef
    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(
            (this.LovCall = {TagName: LovConfigurationKey.RescheduleStatus})
        );
        this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();
        console.log(this.SelectedLoanStatus);
    }

    // tslint:disable-next-line:typedef
    searchLoanStatus(loanStatusId) {
        loanStatusId = loanStatusId.toLowerCase();
        // tslint:disable-next-line:triple-equals
        if (loanStatusId != null && loanStatusId != '') {
            this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(
                (x) => x.Name.toLowerCase().indexOf(loanStatusId) > -1
            );
        } else {
            this.SelectedLoanStatus = this.LoanStatus.LOVs;
        }
    }

    // tslint:disable-next-line:typedef
    validateLoanStatusOnFocusOut() {
        // tslint:disable-next-line:triple-equals
        if (this.SelectedLoanStatus.length == 0) {
            this.SelectedLoanStatus = this.LoanStatus;
        }
    }

    // tslint:disable-next-line:typedef
    find() {
        this.spinner.show();
        this.search = Object.assign(this.rcSearch.getRawValue());
        console.log(this.search);

        this._reschedulingService
            .RescheduleSearch(this.search)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.dataSource = null;
                this.ELEMENT_DATA = [];
                if (baseResponse.Success === true) {
                    console.log(baseResponse);
                    this.loading = false;
                    this.Mydata = baseResponse.Loan.ReschedulingSearch;
                    // tslint:disable-next-line:forin
                    for (const data in this.Mydata) {
                        this.ELEMENT_DATA.push({
                            branch: this.Mydata[data].OrgUnitName,
                            transactionDate: this.Mydata[data].WorkingDate,
                            loanApp: this.Mydata[data].LoanCaseNo,
                            glDescription: this.Mydata[data].GlDesc,
                            status: this.Mydata[data].StatusName,
                            scheme: this.Mydata[data].SchemeCode,
                            oldDate: this.Mydata[data].LastDueDate,
                            acStatus: this.Mydata[data].DisbStatusName,

                        });
                    }
                    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                    console.log(this.dataSource.data);
                    if (this.dataSource.data.length > 0) {
                        this.matTableLenght = true;
                    }
                    else {
                        this.matTableLenght = false;
                    }

                    this.dv = this.dataSource.filteredData;
                    this.totalItems = this.dataSource.filteredData.length;
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                    // console.log(this.dataSource.filteredData.length)
                    // console.log(this.dataSource.data.length)
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
                this.loading = false;
            });
    }

    // tslint:disable-next-line:typedef
    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        // this.SearchJvData();
        // this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); // slice is used to get limited amount of data from APi
    }

}


interface SearchRC {
    branch: string;
    transactionDate: string;
    loanApp: string;
    glDescription: string;
    status: string;
    scheme: string;
    oldDate: string;
    acStatus: string;
}
