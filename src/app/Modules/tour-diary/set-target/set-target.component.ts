import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ViewFileComponent } from '../../deceased-customer/view-file/view-file.component';
import {TargetDuration} from '../../../core/auth/_models/target.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {SetTargetService} from '../../../core/auth/_services/set-target.service';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {CommonService} from '../../../core/auth/_services/common.service';
import {Target} from '../../../core/auth/_models/target.model';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {SetTarget} from '../../../core/auth/_models/set-target.model';
import {DateFormats} from '../../../core/auth/_models/lov.class';

@Component({
  selector: 'kt-set-target',
  templateUrl: './set-target.component.html',
  styleUrls: ['./set-target.component.scss'],
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
export class SetTargetComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userUtilsService: UserUtilsService,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private _setTarget: SetTargetService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _common: CommonService,

  ) {
    router.events.subscribe((val: any) => {
      if (val.url === '/set-targettomer/customers') {
      }
    });
  }
  get rowKeys(): string[] {
    if (!this.targets || !this.targets.length) {
      return [];
    }
    if (this.heading){

    }
    return Object.keys(this.targets[0]);
  }

  get rowth(): string[] {
    if (!this.targets || !this.targets.length) {
      return [];
    }
    if (this.heading){
    }
    
    return this.array;
  }

get total(): string[] {
    if (!this.targets || !this.targets.length) {
      return [];
    }
    if (this.heading){
    }
    this.array = Object.values(this.headings);
    const len = this.array.length;
    return this.array;
  }

  
  customerForm: FormGroup;

  private array = [];    
  totals: any = [];
  AssignedTarget: any = [];
  AssignedTargetToSave: any = [];
  value: any;
  visible: any = true;
  viewerOpen = false;
  heading;
  totalLength = [];
  public newValue;
  public setTarget = new SetTarget();
  public target: Target[] = [];
  public TargetDuration: TargetDuration[] = [];
  targets: Target[] = [];
  headings = [];
  public previous = new Target;
  LoggedInUserInfo: BaseResponseModel;
  Duration: any;
  ishidden = false;
  isfind = false;
    // tslint:disable-next-line:ban-types
  arr: Object;

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  ngOnInit() {

    this.GetTragetDuration();
    this.createForm();
    const userInfo = this.userUtilsService.getUserDetails();
    this.customerForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
    this.customerForm.controls.Branch.setValue(userInfo.Branch.Name);
  }

  GetTragetDuration(){
    this._setTarget
    .GetTragetDuration()
    .pipe(finalize(() => {}))
    .subscribe((baseResponse) => {
      if (baseResponse.Success) {

      
         this.TargetDuration =  baseResponse.Target.TargetDuration;

   
      } else {
        this.layoutUtilsService.alertElement(
          '',
          baseResponse.Message,
          baseResponse.Code
        );
      }
    });
  }

  GetTargets(value: any){
    this.ishidden = false;
    console.log(value);
    this.spinner.show();
    this._setTarget
        .GetTargets(value)
        .pipe(finalize(() => {
          this.spinner.hide();
        }))
        .subscribe((baseResponse) => {
          if (baseResponse.Success) {

            
             this.headings = baseResponse.Target.Heading;
             this.targets =  baseResponse.Target.Targets;             
             this.previous = Object.assign(this.targets);
             this.Heading();
             this.ishidden = true;
       
          } else {

            this.layoutUtilsService.alertElement(
              '',
              baseResponse.Message,
              baseResponse.Code
            );
          }
        });
      }

  createForm() {
    this.customerForm = this.fb.group({
      Zone: ['', Validators.required],
      Branch: ['', Validators.required],
      Duration: [''],
    });
  }




  tracker = i => i;

  Heading()
    {
        this.array = Object.values(this.headings);
        this.totalLength = Object.keys(this.headings);
        this.totalLength.splice(0, 1);
        this.AssignedTarget = Object.assign(this.totalLength);
        this.DoTotals(this.totalLength);
        this.AssignTarget();
    }
    

  DoTotals(array: any[]){
  let tar = Object.keys(this.targets[0]);
  for (let i = 0; i < array.length; i++){
      for (let j = 0; j < tar.length; j++){
        if (array[i] == tar[j]){
        this.DoCalculations(array[i], i);
        }
      } 
    } 
  }

    // tslint:disable-next-line:typedef
  DoCalculations(val: string, num: number){
   const dis = this.targets.reduce( (sum, current) => {
          return sum + Number(current[val]);
        }, 0);
        
   this.totals[num] = dis;
  }

  onInputChanged(value: string, rowIndex: number, propertyKey: string): void {
    this.newValue = this.targets.map((row, index) => {
      return index !== rowIndex ? row : { ...row, [propertyKey]: value };
    });
    
    this.targets = Object.assign(this.newValue); 
    // this.onDataChanged(this.newValue);
    this.Heading();
  }

  onDataChanged(event: any[]): void {
    console.log(event);
  }

    // tslint:disable-next-line:typedef
  AssignTarget(){

    const obj = {};
    const objS = {};
    for (let i = 0; i < this.totalLength.length; i++){
    obj[this.totalLength[i]] = this.totals[i];
    objS[this.totalLength[i]] = this.totals[i].toString();

    }
    this.AssignedTarget = Object.assign(obj);
    this.AssignedTargetToSave = Object.assign(objS);

  }

    // tslint:disable-next-line:typedef
  OnChange(val){
  if (val == this.Duration){
  this.isfind = true;
  }else{
  this.isfind = false;
  }
  }

    // tslint:disable-next-line:typedef
  reset()
  {
    this.targets = Object.assign(this.previous);
  }

    // tslint:disable-next-line:typedef
  Check(){
    let target;
    let heading;
    console.log('total length len' + this.totalLength.length);
    let h = Object.keys(this.headings);
    let v = Object.values(this.headings); 

    for (let j = 0; j < this.totalLength.length; j++){
     for (let i = 0; i < this.targets.length; i++)
      {

      console.log(this.totalLength[j]);
      target = this.targets.find(temp => temp[this.totalLength[j]] === 0);

      target = this.targets.find(temp => temp.Id > 0);


      for (let k = 0; k < h.length; k++){
    if (this.totalLength[j] == h[k]){
      heading = v[k].toLowerCase();
      break;
    }
  }
      if (target){
    let name = target.Name;
    let Message;
    let Code;
    this.layoutUtilsService.alertElement(

              '',
              Message = name + ' ' + heading + '  must contain a value',
              Code = ''
            );
    return false;

  }

}
}
    return true;
    
  }

save(){
if (this.Check()){
  this.spinner.show();
  this._setTarget
  .saveTargets(this.targets, this.customerForm.controls.Duration.value, this.AssignedTargetToSave)
  .pipe(finalize(() => {
    this.spinner.hide();
  }))
  .subscribe((baseResponse) => {
    if (baseResponse.Success) {
      this.layoutUtilsService.alertElementSuccess(
        '',
        baseResponse.Message,
        baseResponse.Code = null
        );

    }else {

      this.layoutUtilsService.alertElement(
        '',
        baseResponse.Message,
        baseResponse.Code
      );
    }
  });
}

}
 


submit()
{
  if (this.Check()){
  this.spinner.show();
  this._setTarget
    .submitTargets(this.customerForm.controls.Duration.value)
    .pipe(finalize(() => {
      this.spinner.hide();
    }))
    .subscribe((baseResponse) => {
      if (baseResponse.Success) {
        this.layoutUtilsService.alertElementSuccess(
          '',
          baseResponse.Message,
          baseResponse.Code = null
          );

      }else {

        this.layoutUtilsService.alertElement(
          '',
          baseResponse.Message,
          baseResponse.Code
        );
      }
    });
  }
}

find(){
  this.isfind = true;
  this.GetTargets(this.customerForm.controls.Duration.value);
  this.Duration = this.customerForm.controls.Duration.value;
}
  
}




