// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../../../core/reducers';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { CustomerService } from '../../../../core/auth/_services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaskEnum, errorMessages, regExps, LovConfigurationKey, Lov } from '../../../../core/auth/_models/lov.class';
import { LovService } from '../../../../core/auth/_services/lov.service';

@Component({
  selector: 'kt-authorized-customers',
  templateUrl: './authorized-customers.component.html'
})
export class AuthorizedCustomersComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];

  gridHeight: string;
  customerSearch: FormGroup;
  myDate = new Date().toLocaleDateString();


  public maskEnums = MaskEnum;
  errors = errorMessages;
  public LovCall = new Lov();
  public CustomerStatusLov: any;
  _customer: CreateCustomer = new CreateCustomer();

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private filterFB: FormBuilder,
    private router: Router,
    private _customerService: CustomerService,
    private _lovService: LovService,
    private layoutUtilsService: LayoutUtilsService) { }

  ngOnInit() {

    this.LoadLovs();

    this.createForm();

    debugger;
    //this.FilterForm.controls["StartDate"].setValue(this.myDate);
    //this.FilterForm.controls["EndDate"].setValue(this.myDate);

    this.searchCustomer();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 280 + 'px';
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }





  createForm() {
    this.customerSearch = this.filterFB.group({
      CustomerName: [this._customer.CustomerName, [Validators.required]],
      Cnic: [this._customer.Cnic, [Validators.required, Validators.pattern(regExps.cnic)]],
      FatherName: [this._customer.FatherName, [Validators.required]],
      CustomerStatus: [this._customer.CustomerStatus, [Validators.required]]
    });
  }



  hasError(controlName: string, errorName: string): boolean {
    return this.customerSearch.controls[controlName].hasError(errorName);
  }

  searchCustomer() {
    debugger;
    this._customer.clear();
    //this._customer = Object.assign(this._customer, this.customerSearch.value);

    //const controlsCust = this.customerSearch.controls;

    //if ((this._customer.CustomerName == null || this._customer.CustomerName == "") && (this._customer.Cnic == null || this._customer.Cnic == "") && (this._customer.FatherName == null || this._customer.FatherName == "") && (this._customer.CustomerStatus == null || this._customer.CustomerStatus == "")) {

    //  Object.keys(controlsCust).forEach(controlName =>
    //    controlsCust[controlName].markAsTouched()
    //  );

    //  return;

    //}
    //else {
    //  Object.keys(controlsCust).forEach(controlName =>
    //    controlsCust[controlName].markAsUntouched()
    //  );
    //}

    this._customer.CustomerStatus = "A";
    this._customerService.searchCustomer(this._customer)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.dataSource.data = baseResponse.Customers;


        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message);
          this.dataSource.data = []
        }

      });
  }


  exportToExcel() {
    //this.exportActivities = [];
    //Object.assign(this.tempExportActivities, this.dataSource.data);
    //this.tempExportActivities.forEach((o, i) => {
    //  this.exportActivities.push({
    //    activityName: o.activityName,
    //    activityURL: o.activityURL,
    //    parentActivityName: o.parentActivityName
    //  });
    //});
    //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
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

  editCustomer(Customer: any) {

    debugger;
    localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));


    localStorage.setItem('CreateCustomerBit', '2');






    // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
    this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });

  }


  getStatus(status: string) {

    if (status == 'A') {
      return "Approved";
    }

  }

  async LoadLovs() {

    //this.ngxService.start();

    this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus })

    console.log(this.CustomerStatusLov.LOVs);
    debugger;
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

    // this.ngxService.stop();

  }

}
