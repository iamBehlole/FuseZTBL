import {DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Lov, LovConfigurationKey, DateFormats} from '../../../core/auth/_models/lov.class';
import {CommonService} from '../../../core/auth/_services/common.service';
import {LovService} from '../../../core/auth/_services/lov.service';
import {RecoveryService} from '../../../core/auth/_services/recovery.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {KtDialogService} from '../../../core/_base/layout';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {Zone} from '../../../core/auth/_models/zone.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {JournalVoucherService} from '../../../../app/core/auth/_services/journal-voucher.service';
import {JournalVocherData} from '../../../core/auth/_models/journal-voucher.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'kt-search-jv',
    templateUrl: './search-jv.component.html',
    styles: [],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats}

    ],
})
export class SearchJvComponent implements OnInit {
    Math: any;

    displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status', 'View'];

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    SaveCustomer = false;
    remove: boolean;
    errorShow: boolean;
    submitted = false;
    dataFetched = false;
    JvSearchForm: FormGroup;
    tranId: string;
    public recoveryTypes: any[] = [];
    maxDate = new Date();
    Zones: any = [];
    Branches: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();
    LoggedInUserInfo: BaseResponseModel;
    loggedInUserDetails: any;

    OffSet: any;
    // pagination
    itemsPerPage = 10; // you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; // use later

    JvStatuses: any;
    Nature: any;
    public LovCall = new Lov();
    public JournalVoucher = new JournalVocherData();

    dataSource = new MatTableDataSource();
    matTableLenght: any;

    requiryTypeRequired = false;


    newDynamic: any = {};

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private ktDialogService: KtDialogService,
        private _lovService: LovService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private datePipe: DatePipe,
        private _common: CommonService,
        private _recoveryService: RecoveryService,
        private spinner: NgxSpinnerService,
        private _circleService: CircleService,
        private jv: JournalVoucherService
    ) {
        this.Math = Math;
    }

    ngOnInit(): void {

        this.createForm();
        this.loadLOV();

        const userInfo = this.userUtilsService.getUserDetails();
        const dateString = userInfo.Branch.WorkingDate;
        // tslint:disable-next-line:radix
        const day = parseInt(dateString.substring(0, 2));
        // tslint:disable-next-line:radix
        const month = parseInt(dateString.substring(2, 4));
        // tslint:disable-next-line:radix
        const year = parseInt(dateString.substring(4, 8));

        const branchWorkingDate = new Date(year, month - 1, day);
        this.JvSearchForm.controls.TransactionDate.setValue(branchWorkingDate);
        this.JvSearchForm.controls.ZoneId.setValue(userInfo.Zone.ZoneName);
        this.JvSearchForm.controls.OrganizationUnit.setValue(userInfo.Branch.Name);
        
        this.maxDate = new Date(year, month - 1, day);

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    }

    // tslint:disable-next-line:typedef
    getKeys(obj: any) {
        return Object.keys(obj);
    }

    // tslint:disable-next-line:typedef
    async loadLOV() {

        this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JvStatus});
       
        this.JvStatuses = this.JvStatuses.LOVs;
        console.log(this.JvStatuses);

        this.Nature = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});
        
        this.Nature = this.Nature.LOVs;
        console.log(this.Nature);

        this.cdRef.detectChanges();

    }

    // tslint:disable-next-line:typedef
    createForm() {
        this.JvSearchForm = this.formBuilder.group({
            ZoneId: [''],
            OrganizationUnit: [''],
            TransactionDate: [''],
            Nature: [''],
            VoucherNo: [''],
            Status: [''],
        });
    }


    // tslint:disable-next-line:typedef
    validateZoneOnFocusOut() {
        // tslint:disable-next-line:triple-equals
        if (this.SelectedZones.length == 0) {
            this.SelectedZones = this.Zones;
        }
    }


    // tslint:disable-next-line:typedef
    find() {
        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchJvData();
    }

    // tslint:disable-next-line:typedef
    SearchJvData() {
        this.spinner.show();
        this.JournalVoucher.Offset = this.OffSet.toString();
        this.JournalVoucher.Limit = this.itemsPerPage.toString();

        let status = this.JvSearchForm.controls.Status.value;
        let nature = this.JvSearchForm.controls.Nature.value;
        const manualVoucher = this.JvSearchForm.controls.VoucherNo.value;
        const trDate = this.datePipe.transform(this.JvSearchForm.controls.TransactionDate.value, 'ddMMyyyy');

        console.log(trDate);
        // tslint:disable-next-line:triple-equals
        if (status == '') {
            status = 'ALL';
        }

        // tslint:disable-next-line:triple-equals
        if (nature == '') {
            nature = '1';
        }
        this.JournalVoucher = Object.assign(this.JournalVoucher, status);

        this.jv.getSearchJvTransactions(status, nature, manualVoucher, trDate)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                console.log(baseResponse);
                if (baseResponse.Success) {
                    this.loading = false;

                    this.dataSource.data = baseResponse.JournalVoucher.JournalVoucherDataList;

                    if (this.dataSource.data.length > 0) {
                        this.matTableLenght = true;
                    }
                    else {
                        this.matTableLenght = false;
                    }
                    // if (this.dataSource.data.length == 0) {
                    //  this.dataSource.data = baseResponse.searchLandData;
                    //  this.ShowViewMore = true;
                    // }
                    // else {
                    //  for (var i = 0; i < baseResponse.searchLandData.length; i++) {

                    //    this.dataSource.data.push(baseResponse.searchLandData[i]);
                    //  }
                    //  this.dataSource._updateChangeSubscription();
                    // }
                    // pagination
                    this.dv = this.dataSource.data;
                    // this.dataSource = new MatTableDataSource(data);

                    this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    // this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    this.matTableLenght = false;

                    this.dataSource = this.dv.slice(1, 0); // this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    // this.dataSource.data = [];
                    // this._cdf.detectChanges();
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv.slice(1, 0);
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
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


    // tslint:disable-next-line:typedef
    CheckEidtStatus(jv: any) {


        // tslint:disable-next-line:triple-equals
        if (jv.Status == '2' || jv.Status == '5') {
            // tslint:disable-next-line:triple-equals
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    // tslint:disable-next-line:typedef
    CheckViewStatus(jv: any) {


        // tslint:disable-next-line:triple-equals
        if (jv.Status != '2' && jv.Status != '5') {
            return true;
        } else {
            // tslint:disable-next-line:triple-equals
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return false;
            } else {
                return true;
            }
        }

    }

    // tslint:disable-next-line:typedef
    editJv(Jv: any) {


        // tslint:disable-next-line:triple-equals
        Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
        // tslint:disable-next-line:triple-equals
        Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
        Jv.obj = 'o';
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: '1'}], {relativeTo: this.activatedRoute});
    }



    hasError(controlName: string, errorName: string): boolean {
        return this.JvSearchForm.controls[controlName].hasError(errorName);
    }

    // tslint:disable-next-line:typedef
    onAlertClose($event) {
        this.hasFormErrors = false;
    }


    // tslint:disable-next-line:typedef
    clearForm() {

        this.JvSearchForm.reset();
    }

}
