import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {SlashDateFormats} from '../../../core/auth/_models/slash-format.class';
import {finalize} from 'rxjs/operators';
import {CircleService} from '../../../core/auth/_services/circle.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {TourPlan} from '../../../core/auth/_models/tour-plan.model';
import {TourPlanService} from '../../../core/auth/_services/tour-plan.service';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateAdapter} from 'angular-calendar';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'kt-create-tour-plan',
    templateUrl: './create-tour-plan.component.html',
    styleUrls: ['./create-tour-plan.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: SlashDateFormats}

    ],
})
export class CreateTourPlanComponent implements OnInit {

    displayedColumns = ['VisitedDate', 'Purpose'
    ];
    dataSource: [] = [];
    TourForm: FormGroup;
    loggedInUser: any;
    onAdd = false;
    hasFormErrors = false;
    minDate = new Date();
    sign;
    circle;
    VisitedDate;
    TourPlan = new TourPlan;
    isAdd = true;
    isUpdate = false;

  constructor(
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,  
    private spinner: NgxSpinnerService,
    private userUtilsService: UserUtilsService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private _circleService: CircleService,
    private tourPlanService:TourPlanService,
    ) {
      this.loggedInUser = userUtilsService.getUserDetails();
     }

    ngOnInit() {
        this.createForm();
        this.setValues();

  }

  setValues(){

        let circleId = [], circleCode = [], name, ppno, circleName, circleNo, date, branch, zone;
        console.log(this.loggedInUser);
        name = this.loggedInUser.User.DisplayName;
        zone = this.loggedInUser.Zone.ZoneName;
        branch = this.loggedInUser.Branch.Name;
        ppno = this.loggedInUser.User.UserName;
        this.circle = this.loggedInUser.UserCircleMappings;

    this.TourForm.controls['ZoneName'].setValue(zone);
    this.TourForm.controls['BranchName'].setValue(branch);
    this.TourForm.controls['McoName'].setValue(name);
    this.TourForm.controls['PPNO'].setValue(ppno);
    this.TourForm.controls['CircleName'].setValue(circleName);
    this.TourForm.controls['CircleId'].setValue(circleNo);
    
  }

  createForm(){
    this.TourForm = this.fb.group({
      ZoneName:[],
     BranchName:[],
     McoName:[],
     PPNO:[],
     TourPlanId:[],
     CircleId:[],
     CircleName:[],
     ZoneId:[this.loggedInUser.User.ZoneId],
     UserId:[this.loggedInUser.User.UserId],
     BranchId:[this.loggedInUser.User.BranchId],
     VisitedDate:[this.TourPlan.VisitedDate],
     Purpose:[this.TourPlan.Purpose],
     Remarks:[this.TourPlan.Remarks],
     Status:[this.TourPlan.Status],
    })
    
  }
  

    setVisitedDate() {
        let VisitedDate = this.TourForm.controls.VisitedDate.value;
        if (VisitedDate._isAMomentObject == undefined) {
            try {
                let day = this.TourForm.controls.VisitedDate.value.getDate();
                let month = this.TourForm.controls.VisitedDate.value.getMonth() + 1;
                let year = this.TourForm.controls.VisitedDate.value.getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                const branchWorkingDate = new Date(year, month - 1, day);
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        } else {
            try {
                let day = this.TourForm.controls.VisitedDate.value.toDate().getDate();
                let month = this.TourForm.controls.VisitedDate.value.toDate().getMonth() + 1;
                const year = this.TourForm.controls.VisitedDate.value.toDate().getFullYear();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                VisitedDate = day + '' + month + '' + year;
                const branchWorkingDate = new Date(year, month - 1, day);
                this.VisitedDate = VisitedDate;
                this.TourForm.controls.VisitedDate.setValue(branchWorkingDate);
            } catch (e) {
            }
        }
    }

    reset() {

    }

    CheckEditStatus(tourPlan) {

    }

    CheckDeleteStatus(tourPlan) {

    }

  deleteList(tourPlan){

  }
  editList(tourPlan){

  }

  // Add(){
  //   this.TourPlan = Object.assign(this.TourForm.value)
  //   this.TourPlan.VisitedDate = this.VisitedDate;
  //   this.onAdd = true
  //   console.log(this.TourForm.controls.VisitedDate.value);
  // }

  update(){

  }

  // delete(){}
  Add() {
      // var s = "sam";
      // this.dataSource[0] =Object.assign(s);

      if (this.TourForm.invalid) {
          const controls = this.TourForm.controls;
          Object.keys(controls).forEach(controlName =>
              controls[controlName].markAsTouched()
          );
          this.hasFormErrors = true;
          return;
      }

      // this.customerForm.controls.Status.setValue("P");
      this.TourPlan = Object.assign(this.TourForm.value);
      this.TourPlan.VisitedDate = this.VisitedDate;
      this.TourPlan.Status = 'P';

      this.spinner.show();
      this.tourPlanService
          .createTourPlan(this.TourPlan)
          .pipe(finalize(() => {
              this.spinner.hide();
          }))
          .subscribe(
              (baseResponse) => {
                  if (baseResponse.Success) {
                      console.log(baseResponse);
                      //  console.log(baseResponse.TourPlan.TourPlans)
                      this.dataSource = baseResponse.TourPlan.TourPlans;
                      //  console.log(this.dataSource)
// console.log("id was saved here "+this.loanUtilizationModel.ID);
                      this.layoutUtilsService.alertElementSuccess(
                          '',
                          baseResponse.Message,
                          baseResponse.Code = null
                      );
                  } else {
                      this.layoutUtilsService.alertElement(
                          '',
                          baseResponse.Message,
                          baseResponse.Code = null
                      );
                  }
     });
 }

 hasError(controlName: string, errorName: string): boolean {

  return this.TourForm.controls[controlName].hasError(errorName);
}
  submit(){
    
  }
}
