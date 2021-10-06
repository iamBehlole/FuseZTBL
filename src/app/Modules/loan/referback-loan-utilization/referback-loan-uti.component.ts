import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserUtilsService } from "../../../../core/_base/crud/utils/user-utils.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import { DeceasedCustomerService } from "../../../../core/auth/_services/deceased-customer.service";
import { MatTableDataSource } from '@angular/material';
import { JvOrganizationalStructureComponent } from "../../journal-voucher/jv-form/jv-organizational-structure/jv-organizational-structure.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'kt-referback-loan-uti',
  templateUrl: './referback-loan-uti.component.html',
  styleUrls: ['./referback-loan-uti.component.scss']
})
export class ReferbackLoanUtilizationComponent implements OnInit {


  displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir', 'View'];

  dataSource : MatTableDataSource<DeceasedCustomer>

  referBackForm: FormGroup;

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
      this.createForm()
      var userInfo = this.userUtilsService.getUserDetails();
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
            baseResponse.Code
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

  viewDeceased(Jv: any) {
    debugger
    this.router.navigate(
      [
        "../customers",
        {
          LnTransactionID: Jv.Cnic,
          CustomerName: Jv.CustomerName
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
