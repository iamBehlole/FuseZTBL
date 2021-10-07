import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {JournalVoucherService} from '../../../../core/auth/_services/journal-voucher.service';
import {UserUtilsService} from '../../../../../app/core/_base/crud/utils/user-utils.service';
import {LayoutUtilsService} from '../../../../core/_base/crud';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {JournalVocherData} from '../../../../core/auth/_models/journal-voucher.model';
import {Lov, LovConfigurationKey, DateFormats} from '../../../../core/auth/_models/lov.class';
import {LovService} from '../../../../core/auth/_services/lov.service';
import {MatTableDataSource} from '@angular/material/table';


@Component({
    selector: 'kt-search-jv-rb',
    templateUrl: './search-jv-rb.component.html',
    styleUrls: ['./search-jv-rb.component.scss']
})
export class SearchJvRbComponent implements OnInit {
    displayedColumns = ['Branch', 'VoucherNO', 'TransactionDate', 'Category', 'TransactionMaster', 'Debit', 'Credit', 'Status', 'Edit', 'View'];
    Math: any;
    OffSet: any;
    // pagination
    itemsPerPage = 10; // you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; // use later
    dataSource = new MatTableDataSource();
    matTableLenght: any;
    Zones: any = [];
    Branches: any = [];
    SelectedZones: any = [];
    loggedInUserDetails: any;
    loading: boolean;
    maxDate = new Date();
    public LovCall = new Lov();
    public JournalVoucher = new JournalVocherData();
    LoggedInUserInfo;

    referbackForm: FormGroup;
    JvStatuses: any;
    Nature: any;

    constructor(
        private cdRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private jv: JournalVoucherService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
    ) {
        this.loggedInUserDetails = this.userUtilsService.getUserDetails();
        this.Math = Math;
    }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        this.loadLOV();
        this.createForm();
        this.SearchJvData();

        const userInfo = this.userUtilsService.getUserDetails();
        const dateString = userInfo.Branch.WorkingDate;
        // tslint:disable-next-line:radix
        const day = parseInt(dateString.substring(0, 2));
        // tslint:disable-next-line:radix
        const month = parseInt(dateString.substring(2, 4));
        // tslint:disable-next-line:radix
        const year = parseInt(dateString.substring(4, 8));

        const branchWorkingDate = new Date(year, month - 1, day);
        this.referbackForm.controls.TransactionDate.setValue(branchWorkingDate);
        this.referbackForm.controls.ZoneId.setValue(userInfo.Zone.ZoneName);
        this.referbackForm.controls.OrganizationUnit.setValue(userInfo.Branch.Name);
        
        this.maxDate = new Date(year, month - 1, day);

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    }


    // tslint:disable-next-line:typedef
    find() {
        this.OffSet = 0;
        this.pageIndex = 0;
        this.dataSource.data = [];
        this.SearchJvData();
    }

    // tslint:disable-next-line:typedef
    createForm() {
        this.referbackForm = this.fb.group({
            ZoneId: [''],
            OrganizationUnit: [''],
            TransactionDate: [''],
            Nature: [''],
            VoucherNo: [''],
            Status: ['R'],
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.referbackForm.controls[controlName].hasError(errorName);
    }

    // tslint:disable-next-line:typedef
    SearchJvData() {

        this.spinner.show();
        this.spinner.show();
        const status = this.referbackForm.controls.Status.value;
        let nature = this.referbackForm.controls.Nature.value;
        const manualVoucher = this.referbackForm.controls.VoucherNo.value;
        const trDate = this.datePipe.transform(this.referbackForm.controls.TransactionDate.value, 'ddMMyyyy');


        // tslint:disable-next-line:triple-equals
        if (nature == '') {
            nature = '1';
        }

        // this.JournalVoucher = Object.assign(this.JournalVoucher, status);

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

                    if (this.dataSource.data.length <= 0) {
                        this.matTableLenght = false;
                    } else {
                        this.matTableLenght = true;
                    }
                    this.dv = this.dataSource.data;
                    // this.dataSource = new MatTableDataSource(data);

                    this.totalItems = baseResponse.JournalVoucher.JournalVoucherDataList.length;
                    // this.paginate(this.pageIndex) //calling paginate function
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {

                    this.matTableLenght = false;

                    this.dataSource = this.dv.slice(1, 0);
                    this.OffSet = 1;
                    this.pageIndex = 1;
                    this.dv = this.dv.slice(1, 0);
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }

                this.loading = false;
            });

    }

    // tslint:disable-next-line:typedef
    async loadLOV() {

        this.JvStatuses = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JvStatus});
        debugger;
        this.JvStatuses = this.JvStatuses.LOVs;
        console.log(this.JvStatuses);

        this.Nature = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.JVCategory});
        debugger;
        this.Nature = this.Nature.LOVs;
        console.log(this.Nature);

        this.cdRef.detectChanges();
    }

    // tslint:disable-next-line:typedef
    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }

    // tslint:disable-next-line:typedef
    viewJv(Jv: any) {
        // tslint:disable-next-line:triple-equals
        Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
        Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
        Jv.obj = "o";
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    editJv(Jv: any) {
        debugger;
        Jv.Branch = this.Branches.filter(x => x.BranchId == Jv.BranchId);
        Jv.Zone = this.Zones.filter(x => x.ZoneId == Jv.ZoneID);
        localStorage.setItem('SearchJvData', JSON.stringify(Jv));
        localStorage.setItem('EditJvData', '1');
        this.router.navigate(['../form', {upFlag: "1"}], {relativeTo: this.activatedRoute});
    }

    CheckEditStatus(jv: any) {


        if (jv.MakerID == this.loggedInUserDetails.User.UserId) {
            return true
            // if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
            //   return true
            // }
            // else {
            //   return false
            // }
        } else {
            return false
        }

    }

    CheckViewStatus(jv: any) {


        if (jv.Status != "1" && jv.Status != "4") {
            return true
        } else {
            if (jv.EnteredBy == this.loggedInUserDetails.User.UserId) {
                return false
            } else {
                return true
            }
        }

    }


}
