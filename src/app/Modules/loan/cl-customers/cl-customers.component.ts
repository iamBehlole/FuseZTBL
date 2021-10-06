import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { LoanCustomer } from '../../../../core/auth/_models/loan-customer';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Lov, LovConfigurationKey } from '../../../../core/auth/_models/lov.class';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { CustomerService } from '../../../../core/auth/_services/customer.service';
import { finalize } from 'rxjs/operators';
import { KtDialogService } from '../../../../core/_base/layout';
import { CustomersLoanApp, Loan } from '../../../../core/auth/_models/loan-application-header.model';
import { LoanService } from '../../../../core/auth/_services/loan.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'kt-cl-customers',
  templateUrl: './cl-customers.component.html',
  styleUrls: ['./cl-customers.component.scss']
})
export class ClCustomersComponent implements OnInit {
  hasFormErrors = false;
  loanCustomerForm: FormGroup;
  LoggedInUserInfo: BaseResponseModel;
  public LovCall = new Lov();
  public AGPSLov: any;
  public RelationshipLov: any;
  agpsModel: any;
  relationshipModel: any;
  //Global Variables
  public loanCustomer = new LoanCustomer();
  public customerArray: CustomerGrid[] = [];
  public createCustomer = new CreateCustomer();
  public customerLoanApp = new CustomersLoanApp();
  ll
  @Input() loanDetail: Loan;
  @Output() loanCustomerCall: EventEmitter<any> = new EventEmitter();
  constructor(private formBuilder: FormBuilder,
    private userUtilsService: UserUtilsService,
    private _lovService: LovService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _loanService: LoanService,
    private spinner: NgxSpinnerService,
    private _customerService: CustomerService) {
      } 

  ngOnInit() {
    
    this.LoadLovs();
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    this.createForm();
    
    
  }
  createForm() {
    this.loanCustomerForm = this.formBuilder.group({
      CNIC: [this.loanCustomer.CNIC, [Validators.required]],
      AGPS: [this.loanCustomer.AGPS, [Validators.required]],
      Relationship: [this.loanCustomer.RelationShip, [Validators.required]]
    });
  }
  hasError(controlName: string, errorName: string): boolean {
    return this.loanCustomerForm.controls[controlName].hasError(errorName);
  }
  async LoadLovs() {
    
    //this.ngxService.start();
    var tempArray = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.AGPS });
    this.AGPSLov = tempArray.LOVs;
    
    tempArray = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.Relationship })
    this.RelationshipLov = tempArray.LOVs;
    
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  searchCustomer() {
    debugger
    this.hasFormErrors = false;
    if (this.loanCustomerForm.invalid) {
      const controls = this.loanCustomerForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    var duplicateCustomer = this.customerArray.filter(x => x.cnic == this.loanCustomerForm.controls['CNIC'].value)[0];
    if (duplicateCustomer != undefined && duplicateCustomer != null) {
      this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
      return;
    }
    this.createCustomer.CustomerStatus = 'A';
    
    this.createCustomer.Cnic = this.loanCustomerForm.controls['CNIC'].value;


    this.spinner.show();
    this._customerService
      .searchCustomer(this.createCustomer)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.ktDialogService.hide();
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {

        
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          
          var customer = baseResponse.Customers[0];

          var grid = new CustomerGrid();

          //cnic: this.loanCustomerForm.controls['CNIC'].value
          grid.cnic = this.loanCustomerForm.controls['CNIC'].value
          grid.name = customer.CustomerName
          grid.fatherName = customer.FatherName
          grid.dob = customer.Dob
          grid.agps = this.agpsModel
          grid.agpsName = this.AGPSLov.filter(v => v.Id == this.agpsModel)[0].Name;
          grid.Relationship = this.relationshipModel;
          grid.RelationshipName = this.RelationshipLov.filter(v => v.Id == this.relationshipModel)[0].Name;
          this.customerArray.push(grid);
          
          //this.dynamicArray[index].area = this.createCustomer

         
          this.cdRef.detectChanges();

          this.loanCustomerForm.controls['CNIC'].setValue("");
          this.loanCustomerForm.controls['AGPS'].setValue("");
          this.loanCustomerForm.controls['Relationship'].setValue("");
          Object.keys(this.loanCustomerForm.controls).forEach(key => {
            this.loanCustomerForm.get(key).markAsUntouched();
          });
        }
        else {


          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        }

      });
  }



  loadAppCustomerDataOnUpdate(appCustomerData) {
    

    console.log(appCustomerData)
    // for(var i=0; i<=appCustomerData.length; i++){
    // this.loanCustomerForm.controls["CNIC"].setValue(appCustomerData[0].CNIC);
    // }

    var tempAgpsLovs = this.AGPSLov;
    var tempRelationshipLovs = this.RelationshipLov;

    var tempCustomerArray: CustomerGrid[] = [];

    appCustomerData.forEach(function (item, key) {
  
      var grid = new CustomerGrid();
      grid.CustLoanAppID = item.CustLoanAppID;
      grid.cnic = item.Cnic; 
      grid.name = item.CustomerName;
      grid.fatherName = item.FatherName;
      grid.dob = item.DOB;
      //grid.agps = this.agpsModel 
      
      var tempAgpsLov = tempAgpsLovs.filter(v => v.Id == item.Agps)
      if (tempAgpsLov.length > 0)  
        grid.agpsName = tempAgpsLov[0].Name;
      else
        grid.agpsName = item.Agps;
      //grid.Relationship = this.relationshipModel;
      
      var tempRealtionshipLov = tempRelationshipLovs.filter(v => v.Id == item.RelationID);
      if (tempRealtionshipLov.length > 0)
        grid.RelationshipName = tempRealtionshipLov[0].Name;
      else  
        grid.RelationshipName = "";
      tempCustomerArray.push(grid);
      

    });

    this.customerArray = tempCustomerArray;

  }

  deleteRow(customerObj, index) {

    const _title = 'Confirmation';
    const _description = 'Do you really want to continue?';
    const _waitDesciption = '';
    const _deleteMessage = ``;

    const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }
      
      if (this.customerArray.length == 0) {
        return false;
      } else {
        if (customerObj.CustLoanAppID == null || customerObj.CustLoanAppID == undefined || customerObj.CustLoanAppID == "") {
          this.customerArray.splice(index, 1);
          this.cdRef.detectChanges();
          return true;
        }
        else {
          this.spinner.show();
          this._loanService.deleteCustomerLoanApplication(customerObj.CustLoanAppID)
            .pipe(
              finalize(() => {
                this.spinner.hide();

              })
            )
            .subscribe(baseResponse => {
              const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
            })
        }
        

      }


    })

  
  }
  onSaveCustomer() {
    debugger
    if (this.loanDetail == null || this.loanDetail == undefined) {
      this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
      return;
    }
      
    
    //var applicatns = this.customerArray.filter(x => x.agpsName.toLowerCase() == 'applicant')[0];
    //if (applicatns == undefined || applicatns == null) {
    //  this.layoutUtilsService.alertElement("", "Minimum 1 Applicant is required", "Applicant");
    //  return;
    //} 
    //var coApplicatns = this.customerArray.filter(x => x.agpsName.toLowerCase() == 'co-applicant');
    //if (coApplicatns == undefined || coApplicatns != null || coApplicatns.length <=2) {
    //  this.layoutUtilsService.alertElement("", "Minimum 2 Co Applicant is required", "Applicant");
    //  return;
    //}
    this.spinner.show();
    var isCustomerAdded = false;
    var resMessage = "";
    var resCode = "";
    var customerAdded = 0;
    
    this.customerArray.forEach(cus => {
      this.customerLoanApp.Cnic = cus.cnic;
      this.customerLoanApp.RelationID = parseInt(cus.Relationship);
      this.customerLoanApp.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
      //this.customerLoanApp.LoanAppID = 0;
      this.customerLoanApp.Agps = cus.agps;
      this._loanService.saveCustomerWithLoanApp(this.customerLoanApp, this.loanDetail.TranId)
        .pipe(
          finalize(() => {
            this.spinner.hide();
            
            if (this.customerArray.length == customerAdded) {
              const dialogRef = this.layoutUtilsService.alertElementSuccess("", resMessage, resCode);
            }
          })
        )
        .subscribe(baseResponse => {
          
          customerAdded++;
          if (baseResponse.Success) {
            debugger
            isCustomerAdded = true;
            resMessage = baseResponse.Message;
            resCode = baseResponse.Code;
            //this.customerLoanApp.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
            cus.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
            var addedCustomer = new CustomersLoanApp();
            addedCustomer.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
            addedCustomer.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
            addedCustomer.RelationID = parseInt(cus.Relationship);
            addedCustomer.Cnic = cus.cnic;
            addedCustomer.Agps = cus.agps;
            addedCustomer.CustomerName = cus.name;
            this.loanDetail.CustomersLoanList.push(addedCustomer);
            this.loanDetail.CustomersLoanApp = this.customerLoanApp;
            this.loanCustomerCall.emit(this.loanDetail);
            //const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          }
          else {
            //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          }
        });
    })


    

  }
}
export class CustomerGrid {
  CustLoanAppID: number;
  cnic: string;
  name: string;
  fatherName: string;
  dob: string;
  agps: string;
  agpsName: string;
  Relationship: string;
  RelationshipName: string;
}
