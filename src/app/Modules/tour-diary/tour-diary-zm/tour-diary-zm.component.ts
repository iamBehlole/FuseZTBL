import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Lov, LovConfigurationKey, DateFormats } from '../../../../core/auth/_models/lov.class';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { SignatureDialogDiaryComponent } from '../signature-dialog-diary/signature-dialog-diary.component';
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';


@Component({
  selector: 'kt-tour-diary-zm',
  templateUrl: './tour-diary-zm.component.html',
  styleUrls: ['./tour-diary-zm.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }

  ],
})
export class TourDiaryZmComponent implements OnInit {

  gridForm : FormGroup;
  loggedInUser: any;
  maxDate: Date;

  sign;

  constructor(
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,  
    private spinner: NgxSpinnerService,
    private userUtilsService: UserUtilsService,
    public dialog: MatDialog,
    private router: Router,
    ) {
      this.loggedInUser = userUtilsService.getUserDetails();
     }
  ngOnInit() {
    this.createForm()
  }

  isEnableReceipt(isTrCodeChange: boolean) {
    debugger
    var Date = this.gridForm.controls.Date.value;
    if (Date._isAMomentObject == undefined) {
      try {
        var day = this.gridForm.controls.Date.value.getDate();
        var month = this.gridForm.controls.Date.value.getMonth() + 1;
        var year = this.gridForm.controls.Date.value.getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        const branchWorkingDate = new Date(year, month - 1, day);
        this.gridForm.controls.Date.setValue(branchWorkingDate);
      } catch (e) {

      }
    }
    else {
      try {
        var day = this.gridForm.controls.Date.value.toDate().getDate();
        var month = this.gridForm.controls.Date.value.toDate().getMonth() + 1;
        var year = this.gridForm.controls.Date.value.toDate().getFullYear();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        Date = day + "" + month + "" + year;
    
     
        const branchWorkingDate = new Date(year, month - 1, day);
        this.gridForm.controls.Date.setValue(branchWorkingDate);
      } catch (e) {

      }
    }

  }

  createForm(){
    this.gridForm = this.fb.group({
      NameOfOfficer : [''],
      PPNO : [''],
      Month: [''],
      Zone:[''],
      Name:[''],
      Designation:[''],
      Date:['']
    })
  }

  submit(){
    const signatureDialogRef = this.dialog.open(SignatureDialogDiaryComponent, { width: "500px", disableClose: true });
  }

}


