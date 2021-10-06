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
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
//src/app/core/_base/crud/utils/user-utils.service

@Component({
  selector: 'kt-pending-customers',
  templateUrl: './pending-customers.component.html'
})
export class PendingCustomersComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  loggedInUserDetails: any;


  //displayedColumns = ['CustomerName', 'CustomerNumber', 'FatherName', 'Cnic', 'CurrentAddress', 'Dob', 'CustomerStatus', 'View'];
  displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'CurrentAddress', 'CustomerStatus', 'View'];

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
    private layoutUtilsService: LayoutUtilsService,
    private userUtilsService: UserUtilsService) { }

  ngOnInit() {

    this.LoadLovs();

    this.createForm();

    this.searchCustomer();
    debugger;

    var userDetails = this.userUtilsService.getUserDetails();
    this.loggedInUserDetails = userDetails;

    //this.FilterForm.controls["StartDate"].setValue(this.myDate);
    //this.FilterForm.controls["EndDate"].setValue(this.myDate);
    console.log(userDetails)
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
    this._customer.CustomerStatus = "N";

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
    //console.log(this._customer)

    this._customerService.searchCustomer(this._customer)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          console.log(baseResponse)
          this.dataSource.data = baseResponse.Customers;
          console.log(this.dataSource.data)


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

  CheckEditStatus(customer: any) {
    debugger
    console.log(customer)
  
    if (customer.CreatedBy == this.loggedInUserDetails.User.UserId) {
      return true
      // if (jv.MakerID == this.loggedInUserDetails.User.UserId) {
      //   return true
      // }
      // else {
      //   return false
      // }
    }
    else {
      return false
    }

  }

  CheckViewStatus(customer: any) {
    debugger
   //console.log(jv)
    if (customer.CreatedBy != this.loggedInUserDetails.User.UserId) {
      return true
    }
    else {
      return false
    }

  }

  editCustomer(Customer: any) {

    debugger;
    localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));


    localStorage.setItem('CreateCustomerBit', '2');






    // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
    this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });

  }

  viewCustomer(Customer: any) {

    debugger;
    localStorage.setItem('SearchCustomerStatus', JSON.stringify(Customer));


    localStorage.setItem('CreateCustomerBit', '2');






    // this.router.navigate(['../customer/customerProfile', { id: id }], { relativeTo: this.activatedRoute });
    this.router.navigate(['/customer/customerProfile'], { relativeTo: this.activatedRoute });

  }

  getStatus(status: string) {

    if (status == 'N') {
      return "Pending";
    }

  }


  async LoadLovs() {

    //this.ngxService.start();

    this.CustomerStatusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.CustomerStatus })


    debugger;
    ////For Bill type
    // this.EducationLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Education })

    // this.ngxService.stop();

  }

}
