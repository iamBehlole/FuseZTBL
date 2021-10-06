import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { Lov, LovConfigurationKey, DateFormats } from '../../../../core/auth/_models/lov.class';
import { finalize } from "rxjs/operators";
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { CustomerService } from '../../../../core/auth/_services/customer.service';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import {  PassBookRec } from '../../../../../app/core/auth/_models/passbookcoorect.model';

@Component({
  selector: 'kt-correction-passbook',
  templateUrl: './correction-passbook.component.html',
  styleUrls: ['./correction-passbook.component.scss']
})
export class CorrectionPassbookComponent implements OnInit {

  loggedInUser: any;
  cpForm : FormGroup;

  public newValue;
  afterFind: boolean = false;
  searchData: boolean = false;

  passBookList: any = {};
  newPassBook : any = [];
  // PassBookRec;

  
  PassBookRec:PassBookRec[]=[];
  
  // Pass:PassBookRec[]=[];
  customerRec: any;

  constructor(private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,  
    private spinner: NgxSpinnerService,
    private userUtilsService: UserUtilsService,
    public dialog: MatDialog,
    private _customerService: CustomerService,
    private router: Router,
    ) {
      this.loggedInUser = userUtilsService.getUserDetails();
      console.log(this.loggedInUser)
     }

  ngOnInit() {
    this.createForm()
    this.cpForm.controls['Zone'].setValue(this.loggedInUser.Zone.ZoneName);
    this.cpForm.controls['Branch'].setValue(this.loggedInUser.Branch.Name);

  //   Object.keys(this.cpForm.controls).forEach((control: string) => {
  //     const typedControl: AbstractControl = this.cpForm.controls['NewPassBookNo'];
  //     this.newPassBook = typedControl;
  //     console.log(typedControl) 
  //     // should log the form controls value and be typed correctly
  // });
  }

  
  npb(){}

  createForm(){
    this.cpForm = this.fb.group({
      Zone:[''],
      Branch:[''],
      Cnic:['']
      //NewPassBookNo:['']
    })
  }

  find(){
    debugger
    var cnic = this.cpForm.controls.Cnic.value;
    this.spinner.show();
    this._customerService.findPassbookCorrection(cnic)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      if(baseResponse.Success === true){
        this.afterFind = true
        this.customerRec = baseResponse.Customer

        if(baseResponse.searchLandData != undefined){
          this.PassBookRec = baseResponse.searchLandData;

          // this.PassBookRec = Object.assign({},pass);
          this.searchData = true;
        }
        console.log(this.PassBookRec)
        console.log(baseResponse)
        
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }
  k;
  get rowKeys(): string[]{
    if(!this.PassBookRec || !this.PassBookRec.length){
      return [];
    }
    this.k = Object.keys(this.PassBookRec[0])

    this.k.splice(0,2);
    return  this.k;
  }

//   onInputChanged(value: string, rowIndex: number, propertyKey: string): void {
//     this.newValue = this.PassBookRec.map((row, index) => {
//       return index !== rowIndex? row: {...row, [propertyKey]: value}
//     })
// console.log(this.newValue);
//   }

inputvalue;
  onInputChanged(value: string, rowIndex: number, propertyKey: string): void {
   
    this.newValue = this.PassBookRec.map((row, index) => {
      return index !== rowIndex ? row : { ...row, [propertyKey]: value };
    });
    this.PassBookRec = Object.assign(this.newValue); 
  }

  submit(){
    debugger
    var cnic = this.cpForm.controls.Cnic.value;
    //var NewPassbookNO = this.cpForm.controls.NewPassBookNo.value; 
    //var npb ={NewPassbookNO: NewPassbookNO}
    for(let i=0; i<this.PassBookRec.length; i++){
      // this.passBookList.LandInfoID = this.PassBookRec[i].LandInfoID 
      // this.passBookList.TotalArea = this.PassBookRec[i].TotalArea
      // this.passBookList.PassbookNO = this.PassBookRec[i].PassbookNO
      // this.passBookList.NewPassbookNO = this.cpForm.controls.NewPassBookNo.value
    }

    
    //this.passBookList.push(this.PassBookRec)
    //this.passBookList.NewPassbookNO = this.cpForm.controls.NewPassBookN.value;
    
    this.spinner.show();
    this._customerService.changePassbook(cnic, this.PassBookRec)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      debugger
      if(baseResponse.Success === true){
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        console.log(baseResponse)
        
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
    
  }

}
