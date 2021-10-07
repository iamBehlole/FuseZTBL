import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import {MatTableDataSource} from '@angular/material/table';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {DeceasedCustomerService} from '../../../core/auth/_services/deceased-customer.service';

@Component({
  selector: 'kt-referback-deceased',
  templateUrl: './referback-deceased.component.html',
  styleUrls: ['./referback-deceased.component.scss']
})
export class ReferbackDeceasedComponent implements OnInit {


  //displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir', 'View'];
  displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'branch_code', 'certificate_verified', 'legal_heir', 'View'];
  
  dataSource : MatTableDataSource<DeceasedCustomer>

  referBackForm: FormGroup;
  loggedInUser: any;

  select: Selection[] = [
    {value: '1', viewValue: 'NO'},
    {value: '2', viewValue: 'Yes'}
  ];
  DeceasedCustomerInf;

  constructor(private fb: FormBuilder,
    private userUtilsService: UserUtilsService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    private _deceasedCustomer: DeceasedCustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute

    ) { }
    ngOnInit() {
      debugger
      this.createForm()
      var userInfo = this.userUtilsService.getUserDetails();
      this.loggedInUser = userInfo.User;
      this.referBackForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
      this.referBackForm.controls.Branch.setValue(userInfo.Branch.Name);


      this._deceasedCustomer
      .GetListOfRejectedDeceasedPerson()
      .pipe(finalize(() => {}))
      .subscribe((baseResponse) => {
        if (baseResponse.Success) {
          this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerInfoList;
  
          debugger
        } else {
          debugger;
          this.layoutUtilsService.alertElement(
            "",
            baseResponse.Message,
          );
        }
      });


    }

  createForm(){
    this.referBackForm = this.fb.group({
      Zone: ["", Validators.required],
      Branch: ["", Validators.required],
      Cnic: [""],
      DateofDeath:[''],
      NadraNo: [''],
      DetailSourceIncome: [''],
      CustomerName: [''],
      Cn: [''],
      FatherName: [''],
      Remarks: [''],
      verified: [''],
      select: [''],
    })
  }

  find(){

  }

  CheckEditStatus(deceased: any) {
    debugger
  
    if (deceased.MakerUserID == this.loggedInUser.UserId) {
      return true
    }
    else {
      return false
    }

  }

  CheckViewStatus(deceased: any) {
    debugger
   //console.log(jv)
   if (deceased.MakerUserID != this.loggedInUser.UserId) {
     return true
    }
    else {
      return false
    }
  }

  viewDeceased(Deceased: any) {
    debugger
    Deceased.obj = "o"
    this.router.navigate(
      [
        "../customers",
        {
          LnTransactionID: Deceased.Cnic,
          CustomerName: Deceased.CustomerName,
          ViewObj: Deceased.obj
        },
      ],
      { relativeTo: this.activatedRoute }
    );  }

    editDeceased(Deceased: any) {
      debugger
      this.router.navigate(
        [
          "../customers",
          {
            LnTransactionID: Deceased.Cnic,
            CustomerName: Deceased.CustomerName
          },
        ],
        { relativeTo: this.activatedRoute }
      );  }
}

export interface Selection {
  value: string;
  viewValue: string;
}

export interface DeceasedCustomer{
  CustomerName: string;
  FatherName: string;
  DeathDate: string;
  Cnic: string;
  Address: string;
  PermanentAddress: string;
  Status : string;
  BranchCode: string;
  IsCertificateVerified: string;
  LegalHeairHasIncome: string
}
