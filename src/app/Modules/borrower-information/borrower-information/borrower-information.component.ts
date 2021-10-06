import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { BorrowerInformationService } from "../../../../core/auth/_services/borrower-information.service";
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CircleService } from "../../../../core/auth/_services/circle.service";
import { Branch } from "../../../../core/auth/_models/branch.model";
import { Circle } from "../../../../core/auth/_models/circle.model";
import { Zone } from "../../../../core/auth/_models/zone.model";
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";
import { indexOf } from 'lodash';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'kt-borrower-information',
  templateUrl: './borrower-information.component.html',
  styleUrls: ['./borrower-information.component.scss']
})
export class BorrowerInformationComponent implements OnInit {
  displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'LoanCaseNo', 'PermanentAddress','TotalSanctionedAmount', 'SanctionLimit','Link'];
  matTableLenght : boolean = false;

  borrowerForm: FormGroup;
  
  dv;
  itemsPerPage = 10;
  totalItems;
  pageIndex = 1;
  OffSet=0;

  hasBranch : boolean = false;
  hasCircle : boolean = false;

  LoggedInUserInfo: BaseResponseModel;

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Branch();

  constructor(
    private _borrowerInfo: BorrowerInformationService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userUtilsService: UserUtilsService,
    private _circleService: CircleService,
  ) { }

  dataSource : MatTableDataSource<Borrowers>

  selected_b;
  selected_z;

  ngOnInit() {
    this.createForm();
    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
    console.log(this.LoggedInUserInfo)
    //this.GetZones();
    
    if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
      debugger;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchId
      console.log(this.SelectedZones)
      this.borrowerForm.controls["Zone"].setValue(this.SelectedZones.ZoneName);
      this.borrowerForm.controls["Branch"].setValue(this.SelectedBranches.Name);
    }
    //this.getBorrower();
  }


  createForm(){
    this.borrowerForm = this.fb.group({
      Zone:[''],
      Branch:[''],
      Circle:[''],
      Cnic:['']
    })
  }

  getBorrower(){
    debugger
    var cnic = this.borrowerForm.controls.Cnic.value;
    var circle = this.borrowerForm.controls.Cnic.value;
    this.spinner.show();
    this._borrowerInfo.getBorrowerInformation(this.itemsPerPage, this.OffSet, cnic, circle)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        console.log(baseResponse)
        this.dataSource = baseResponse.BorrowerInfo.Borrowers;
        this.dv = this.dataSource;
        this.matTableLenght = true

        this.totalItems = baseResponse.BorrowerInfo.Borrowers[0].TotalRecords
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  paginate(pageIndex : any, pageSize: any = this.itemsPerPage){
    debugger
    this.itemsPerPage = pageSize;
      this.OffSet = (pageIndex -1) * this.itemsPerPage;
    this.pageIndex = pageIndex;
    this.getBorrower();
    this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
  }

  viewInquiry(borrower){
    var Lcno = borrower.LoanCaseNo;
    //var LnTransactionID = this.JvForm.controls.LoanDisbID.value;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['../loan-recovery/loan-inquiry', { LnTransactionID: "", Lcno: Lcno }], { relativeTo: this.activatedRoute })
      //this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute })
    );
    window.open(url, '_blank');
  }

}

interface Borrowers{
  CustomerName: string;
  Name: string;
  LoanCaseNo: string;
  Cnic: string;
  FatherName: string;
  PermanentAddress: string;
  SanctionLimit: string;
  TotalSanctionedAmount: string;
  TotalRecords: string
  
}
