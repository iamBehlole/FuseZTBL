import { Component, OnInit, ViewChild,ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MatSort,MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import { DeceasedCustomerService } from "../../../../core/auth/_services/deceased-customer.service";
import { BaseResponseModel } from "../../../../core/_base/crud/models/_base.response.model";
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material'
import { ViewFileComponent } from "../view-file/view-file.component";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Customer,Documents,MarkDeceasedCustomer } from "../../../../core/auth/_models/deceased-customer.model";
import { DatePipe } from "@angular/common";

import { CommonService } from '../../../../core/auth/_services/common.service';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MaskEnum, Lov, errorMessages, regExps, LovConfigurationKey, DateFormats } from '../../../../core/auth/_models/lov.class';

@Component({
  selector: "kt-deceased-cus",
  templateUrl: "./deceased-cus.component.html",
  styleUrls: ["./deceased-cus.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    {
         provide: MatDialogRef,
         useValue: {}
       },
       {
         provide: MAT_DIALOG_DATA,
         useValue: {}
       },
  ],

  //   providers: [
  //  {
  //    provide: MatDialogRef,
  //    useValue: {}
  //  },
  //  {
  //    provide: MAT_DIALOG_DATA,
  //    useValue: {}
  //  },
  // ],
})
export class DeceasedCusComponent implements OnInit {

  
  customerForm: FormGroup;
  //matElects: FormGroup;

  displayedColumns = [
    "lcno",
    "gl",
    "scm",
    "crp",
    "rate",
    "disb_date",
    "disb_amt",
    "principal",
    "tot_markup",
    "markup_rec",
    "other_charges",
    "legal_charges",
    "balance",
  ];

  visible:any = true;
  hasFormErrors = false;
  isEmpty:boolean = false;
  viewerOpen = false;
  txtValue:string = null;
  len:string=null;
  deceasedCustomerID = null
  public markDeceasedCustomer= new MarkDeceasedCustomer();
  imageUrl: any;
  file:File;
  rawData = new Documents();
  errorShow: boolean;
  viewOnly: boolean;
  

  dataSource: MatTableDataSource<DeceasedCust>;
  LoggedInUserInfo: BaseResponseModel;

  ELEMENT_DATA: DeceasedCust[] = [];
  isEditMode;
  myModel:boolean=false;
  DeceasedCustomerInf;
  DeceasedCustomerDisbursementRecoveries = [];
  DeceasedCustomerAttachedFile = [];
  url : string
  public deceasedInfo = new Customer();

  cnicn;
  name;
  select: Selection[] = [
    { value: "0", viewValue: "NO" },
    { value: "1", viewValue: "Yes" },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private _deceasedCustomer: DeceasedCustomerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _common: CommonService,
    private datePipe: DatePipe,

  ) {
    debugger;
    router.events.subscribe((val: any) => {
      if (val.url == "/deceased-customer/customers") {
      }
    });
    debugger
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  ngAfterViewInit() {
    // this.GetDisbursement();
    if (this.route.snapshot.params["LnTransactionID"] != null) {
      debugger
      this.GetReshTransaction()
    }
  }

  //to disable future date
  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }

  GetReshTransaction()
  {
    debugger
    this.spinner.show();
    this.cnicn = this.route.snapshot.params["LnTransactionID"];
    this.name = this.route.snapshot.params["CustomerName"];
    if(this.route.snapshot.params["ViewObj"]){
      this.viewOnly = true;
    }
    this.deceasedInfo.Cnic = this.cnicn
    this.deceasedInfo.CustomerName = this.name
    debugger;
    this._deceasedCustomer
    .GetDeceasedCustomer(this.deceasedInfo)
    .pipe(finalize(() => {
      this.spinner.hide();
    }))
    .subscribe((baseResponse) => {
      if (baseResponse.Success) {
        debugger
        this.isEmpty = true;
        this.DeceasedCustomerInf =  baseResponse.DeceasedCustomer.DeceasedCustomerInfo;
          console.log(this.DeceasedCustomerInf)
          this.deceasedCustomerID = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID
          this.customerForm.controls["DateofDeath"].setValue(this._common.stringToDate(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate));
          this.customerForm.controls["Cn"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
          this.customerForm.controls["Cnic"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
          this.customerForm.controls["CustomerName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.CustomerName);
          this.customerForm.controls["FatherName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.FatherName);
          this.customerForm.controls["NadraNo"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.NadraNo);
          this.customerForm.controls["MakerRemarks"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.MakerRemarks);
          if(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.IsCertificateVerified == "Y")
          {
            this.myModel = true
            this.customerForm.controls["IsNadraCertificateVerified"].setValue(true);
          }
          else {
            this.myModel = false
            this.customerForm.controls["IsNadraCertificateVerified"].setValue(false);
          }
          this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;
          // console.log(baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries)
          this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList
        } else {
          this.isEmpty = false;
          debugger;
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code
          );
      }
    });
  }
  

  ngOnInit() {
    this.createForm();
    var userInfo = this.userUtilsService.getUserDetails();
    this.customerForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
    this.customerForm.controls.Branch.setValue(userInfo.Branch.Name);
    //this.elementsFormControls();.
    //console.log(this.DeceasedCustomerAttachedFile)
  }

  


  hasError(controlName: string, errorName: string): boolean {
    //debugger;
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  createForm() {
    

    this.customerForm = this.fb.group({
      Zone: ["", Validators.required],
      Branch: ["", Validators.required],
      PPNo:[""],
      Cnic: [""],
      DateofDeath:['', Validators.required],
      NadraNo: ['', Validators.required],
      DetailSourceIncome: [''],
      CustomerName: [''],
      Cn: [''],
      FatherName: [''],
      MakerRemarks: ['', Validators.required],
      IsNadraCertificateVerified: [''],
      IsReferredBack: [''],
      LegalHeirPay:['', Validators.required],
      file: [''],
      DeceasedID:[''],

      
    });

    this.customerForm.controls["DetailSourceIncome"].disable();
  }

  onFileChange(event) {
    debugger
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      this.file = event.target.files[0];

      var Name = this.file.name.split('.').pop();
      if (Name != undefined) {
        if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "jpeg" || Name.toLowerCase() == "png") {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            this.rawData.file = this.file;
            this.imageUrl = event.target.result;
            this.visible = false;
          }


          reader.readAsDataURL(this.file);

        }
        else {
          this.layoutUtilsService.alertElement("", "Only jpeg,jpg and png files are allowed", "99");
          
          return;
        }
      }
    }else{
      this.visible = true;
    }


  }

  // onChange(e){
  //   console.log(e);
  // }

  onChang(e){
    console.log(e)
    if(e == false){
      this.myModel = true
      // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
    }
    else 
    {
      this.myModel = false
      // this.customerForm.controls["IsNadraCertificateVerified"].setValue(this.myModel);
    }
    console.log(e)
  }
 
  previewImg(){
    debugger
    // for(var a=0 ; this.DeceasedCustomerAttachedFile.length > a; a++)
    // {
    //   debugger
    //   if(id == this.DeceasedCustomerAttachedFile[a].ID)
    //   {
    //     debugger
    //     this.url = this.DeceasedCustomerAttachedFile[a].Path
    //   }
    // }
    debugger
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '90%',
      height: '90%',
      data: { documentView: this.DeceasedCustomerAttachedFile, url: this.imageUrl }
    });
  }

  find() {
    debugger
    this.spinner.show();
        this._deceasedCustomer
      .GetDeceasedCustomer(this.customerForm.value)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
        this.isEmpty = true;
          debugger;
          var json = JSON.stringify(baseResponse.DeceasedCustomer);
          console.log(json);
          // console.log()
          this.DeceasedCustomerInf =  baseResponse.DeceasedCustomer.DeceasedCustomerInfo;
          //console.log(this.DeceasedCustomerInf)
          console.log(this.DeceasedCustomerInf);
          this.deceasedCustomerID = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID
           this.customerForm.controls["DateofDeath"].setValue(this._common.stringToDate(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate));
            // this.DateofDeath = baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeathDate;
          this.customerForm.controls["Cn"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.Cnic);
          this.customerForm.controls["CustomerName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.CustomerName);
          this.customerForm.controls["FatherName"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.FatherName);
          this.customerForm.controls["NadraNo"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.NadraNo);
          this.customerForm.controls["DeceasedID"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID);
          this.customerForm.controls["MakerRemarks"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.MakerRemarks);

          if(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.IsCertificateVerified == "Y")
          {
            this.myModel = true
          }
          else 
          {
            this.myModel = false
          }

          // if(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.LegalHeirPay == "Y")
          // {
          // this.customerForm.controls["DeceasedID"].setValue(baseResponse.DeceasedCustomer.DeceasedCustomerInfo.DeceasedID);
          // }
          // else {
          //   this.myModel = false
          // }


          this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;
          debugger
          console.log(this.dataSource);
          //this.savedFiles =
          this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList

          debugger
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code=null
          );
        }
      });
  }

  viewDocument(id){
    debugger
    for(var a=0 ; this.DeceasedCustomerAttachedFile.length > a; a++)
    {
      debugger
      if(id == this.DeceasedCustomerAttachedFile[a].ID)
      {
        debugger
        this.url = this.DeceasedCustomerAttachedFile[a].Path
      }
    }
    debugger
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      height: '50%',
      data: { documentView: this.DeceasedCustomerAttachedFile, url: this.url }
    });
  }

  OnChangeDisable(value){
    if(value=="0"){
    this.customerForm.controls["DetailSourceIncome"].reset();
    this.customerForm.controls["DetailSourceIncome"].disable();
    this.markDeceasedCustomer.OtherSourceOfIncome=null;
    }
    else if(value=="1"){
      this.customerForm.controls["DetailSourceIncome"].reset();
      this.customerForm.controls["DetailSourceIncome"].enable();
      this.customerForm.controls["DetailSourceIncome"].setValidators(Validators.required);
      this.customerForm.controls["DetailSourceIncome"].updateValueAndValidity();      
    }
    else{
      this.customerForm.controls["DetailSourceIncome"].reset();
      this.customerForm.controls["DetailSourceIncome"].disable();
      this.markDeceasedCustomer.OtherSourceOfIncome=null;
    }
      }

      // onTextChange(value)
      // {
      //   this.txtValue = value;
      //   this.customerForm.reset();
      //   if(this.txtValue == '')
      //   {
      //     this.isEmpty = true;
      //   }
        
      // }

      changed(value){
        this.len = value.target.value;
        if(this.len.length <= 13)
        {
          //this.customerForm.reset();
          this.isEmpty = false;

          this.customerForm.markAsUntouched();
          this.customerForm.markAsPristine();
        }
      }

  MarkAsDeceasedCustomer(){
    debugger

    this.errorShow = false;
    this.hasFormErrors = false;
    console.log(this.customerForm)
    if (this.customerForm.invalid) {
      const controls = this.customerForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    if(this.customerForm.controls["IsNadraCertificateVerified"].value == "true"){
      this.customerForm.controls["IsNadraCertificateVerified"].setValue("N");
    }
    else{
      this.customerForm.controls["IsNadraCertificateVerified"].setValue("Y");
    }

    if(this.DeceasedCustomerInf.Status == "4"){
      if(this.file == undefined){
        this.file = this.DeceasedCustomerAttachedFile[0].Path
        console.log(this.DeceasedCustomerAttachedFile[0].Path)
      }
      this.customerForm.controls["IsReferredBack"].setValue("1");
    }

    debugger
    this.markDeceasedCustomer = Object.assign(this.markDeceasedCustomer, this.customerForm.value);
    //if(this.deceasedCustomerID != null){
    //  this.markDeceasedCustomer.DeceasedID = this.deceasedCustomerID
    //}
    if(this.customerForm.controls["LegalHeirPay"].value == 0){
      this.markDeceasedCustomer.LegalHeirPay= "N";
    }
    else{
      this.markDeceasedCustomer.LegalHeirPay= "Y";
    }
    if(this.DeceasedCustomerInf.Status != undefined && this.DeceasedCustomerInf.Status != "4"){
        // if(!this.deceasedCustomerID == null){        
        //   var Message;
        //   var Code;
        //   this.layoutUtilsService.alertElement("", Message="Please Attach Image",Code=null);
        // }
        if(!this.customerForm.controls.file.value || !this.DeceasedCustomerAttachedFile){        
          var Message;
          var Code;
          this.layoutUtilsService.alertElement("", Message="Please Attach Image",Code=null);
        }
        else{
          this.spinner.show();
          this._deceasedCustomer
          .MarkAsDeceasedCustomer(this.markDeceasedCustomer,this.file)
          .pipe(finalize(() => {
            this.spinner.hide();
          }))
          .subscribe((baseResponse) => {
            if (baseResponse.Success) {
              debugger
              this.layoutUtilsService.alertElementSuccess(
                "",
                Message="Information Saved Successfully",
                baseResponse.Code=null
                );
                this.router.navigateByUrl('deceased-customer/search')
              }
              else {
                debugger;
                this.layoutUtilsService.alertElement(
                  "",
                  baseResponse.Message,
                  baseResponse.Code=null
                  );
                  console.log(baseResponse)
                }
              });          
        }          
    }    
else{
     
debugger

if(!this.customerForm.controls.file.value && !this.DeceasedCustomerAttachedFile){
  var Message;
    var Code;
    this.layoutUtilsService.alertElement("", Message="Please Attach Image",Code=null);  
  }
  else{
    
    this.spinner.show();

    this._deceasedCustomer
    .MarkAsDeceasedCustomer(this.markDeceasedCustomer,this.file)
    .pipe(finalize(() => {
      this.spinner.hide();
    }))
    .subscribe((baseResponse) => {
      if (baseResponse.Success) {
        debugger
        this.layoutUtilsService.alertElementSuccess(
          "",
          Message="Information Saved Successfully",
          baseResponse.Code=null
          );
          this.router.navigateByUrl('deceased-customer/search')
        }
        else {
          debugger;
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
            baseResponse.Code=null
            );
            console.log(baseResponse)
          }
        });
      }
  }
}

}

export interface Selection {
  value: string;
  viewValue: string;
}

export interface DeceasedCust {
  LoanCaseNo: string;
  GlDescription: string;
  SchemeCode: string;
  CropCode: string;
  IntRate: string;
  DisbDate: string;
  DisbursedAmount: string;
  RecoverdPrincipal: string;
  ToDateMarkup: string;
  RecoveredMarkup: string;
  OtherReceiveable: string;
  LegalChargesReceiveable: string;
  Balance: string;
}

function stringToDate(DeathDate: any) {
  throw new Error("Function not implemented.");
}
