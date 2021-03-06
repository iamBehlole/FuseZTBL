
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { KtDialogService } from '../../../../core/_base/layout';
import { Store } from '@ngrx/store';
import { Lov, LovConfigurationKey, LovData, MaskEnum, regExps, errorMessages, DateFormats, ChildLov } from '../../../../core/auth/_models/lov.class';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { Subject, ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService } from '../../../../core/auth/_services/common.service';
import { AppState } from '../../../../core/reducers';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { LandService } from '../../../../core/auth/_services/land.service';
import { LandChargeCreation } from '../../../../core/auth/_models/land-charge-creation.model';
import { LandChargeCreationDetails } from '../../../../core/auth/_models/land-charge-creation-details.model';
import { finalize, takeUntil } from 'rxjs/operators';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../../../core/_base/crud/models/_base.request.model';
import { Activity } from '../../../../core/auth/_models/activity.model';
import { LandInfo } from '../../../../core/auth/_models/land-info.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlConfigrationsDetail } from '../../../../core/auth/_models/loan-application-header.model';
import { LoanService } from '../../../../core/auth/_services/loan.service';

export interface Data {
  albumId: number,
  id: number,
  title: string,
  url: string,
  thumnailUrl: string
}

@Component({
  selector: 'kt-cl-gl-scheme-crop-configuration',
  templateUrl: './cl-gl-scheme-crop-configuration.component.html',
  styleUrls: ['./cl-gl-scheme-crop-configuration.component.scss']
})
export class ClGlSchemeCropConfigurationComponent implements OnInit {

  glSchemeCropConfigForm: FormGroup;
  public glConfigrationsDetail = new GlConfigrationsDetail();
  CropDetailList: any;
  GLDetailList: any;
  GlRangeDetailList: any;
  GlSchemeCropDetailList: any;
  SchemeDetailList: any;
  

  dataSource = new MatTableDataSource();

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;

  displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'Unit', 'Rate', 'InstallmentFreq'];
  //collection = [];
  //config : any;
  //totalRecords:number | any;
  //page:number =1
  dv: any;
  count: any;
  //dataSource: MatTableDataSource<Data> | any;

  constructor(
    public dialogRef: MatDialogRef<ClGlSchemeCropConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private _lovService: LovService,
    private _landService: LandService,
    private _loanService: LoanService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _common: CommonService) { }


  size = 10; //Default Items Per Page
  //p : number =1;
  pageIndex = 1; //Page Number
  length: any; //Data Length or Total Items from Api


  ngOnInit() {
    
    this.glConfigrationsDetail.GLCode = this.data.glConfigrationsDetail;
    this.createForm();
   // this.loadData();
  }


  getTitle(): string {

    return "GL Schemes Crop Configuration";
  }

  //loadData() {

  //  
  //  this._landService.getData2().subscribe((data: any) => {
  //    this.dv = data;

  //    this.dataSource = new MatTableDataSource(data.reverse());
  //    
  //    this.length = data.length;
  //    //this.count = length.count;
  //    //for()
  //    this.paginate(this.pageIndex);
  //    console.log(this.dataSource);
  //  });
  //}



  paginate(event: any) {

    
    this.pageIndex = event;
    // this.dataService.getData2().subscribe((data:any)=>{ 
    // this.dataSource = data.slice(event * this.size - this.size, event * this.size);
    // })
    this.dataSource = this.dv.slice(event * this.size - this.size, event * this.size);



  }


  createForm() {
    this.glSchemeCropConfigForm = this.formBuilder.group({
      GLCode: [this.glConfigrationsDetail.GLCode],
      SchemeCode: [this.glConfigrationsDetail.SchemeCode],
      CropCode: [this.glConfigrationsDetail.CropCode],
    });
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.glSchemeCropConfigForm.controls[controlName].hasError(errorName);
  }


  SearchGLCode() {

    
    this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glSchemeCropConfigForm.getRawValue());

    this._loanService.SearchGLCode(this.glConfigrationsDetail)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        
        if (baseResponse.Success) {
          this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
          this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
          this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
          this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
          this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;
          

          console.log(this.CropDetailList);
          console.log(this.GLDetailList);
          console.log(this.GlRangeDetailList);
          console.log(this.GlSchemeCropDetailList);
          console.log(this.SchemeDetailList);


          this.dv = this.CropDetailList;

          this.dataSource = new MatTableDataSource(this.CropDetailList.reverse());
          
          this.length = this.CropDetailList.length;
          //this.count = length.count;
          //for()
          this.paginate(this.pageIndex);
          console.log(this.dataSource);


        }
        else {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
      });
  }

  onCloseClick(): void {
    
    this.dialogRef.close({ data: {} }); // Keep only this row
  }
}
