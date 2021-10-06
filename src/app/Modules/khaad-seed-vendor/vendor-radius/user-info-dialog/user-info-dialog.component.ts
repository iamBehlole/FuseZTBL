import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseResponseModel } from '../../../../../core/_base/crud/models/_base.response.model';
import { NgxSpinnerService } from "ngx-spinner";
import { VendorDetail } from '../../../../../core/auth/_models/khaad-seed-vendor.model';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { KhaadSeedVendorService } from "../../../../../core/auth/_services/khaad-seed-vendor.service";
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'kt-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrls: ['./user-info-dialog.component.scss']
})
export class UserInfoDialogComponent implements OnInit {

  vendorDetailForm : FormGroup;
  vendorInfo: any;
  images = [];
  user: any = {}

  public vendor = new VendorDetail();

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _khaadSeedVendor: KhaadSeedVendorService,
    private layoutUtilsService: LayoutUtilsService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit() {
    this.createForm();
    this.getVendor();
    //console.log(this.data.id)
  }

  getVendor(){
    debugger
    this.vendor.Id = this.data.id;

    this.user.ZoneId = this.data.zoneId;
    this.user.BranchCode = this.data.branchCode;
    this.user.CircleId = this.data.circleId;

    var limit = 1, offset = 0;

    this._khaadSeedVendor.searchVendors(limit, offset, this.vendor, this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if(baseResponse.Success === true){
        this.vendorInfo = baseResponse.SeedKhadVendor.VendorDetail;
        
        this.vendorDetailForm.controls["Name"].setValue(this.vendorInfo.Name);
        this.vendorDetailForm.controls["Type"].setValue(this.vendorInfo.Type);
        this.vendorDetailForm.controls["Description"].setValue(this.vendorInfo.Description);
        this.vendorDetailForm.controls["PhoneNumber"].setValue(this.vendorInfo.PhoneNumber);
        this.vendorDetailForm.controls["Address"].setValue(this.vendorInfo.Address);
        
        this.images.push(this.vendorInfo.FilePath);
        console.log(this.vendorInfo)
      }
      else{
        this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  createForm(){
    this.vendorDetailForm = this.fb.group({
      Name:[''],
      PhoneNumber:[''],
      Address:[''],
      Description:[''],
      Type:['']
    })
  }

  close(result: any): void {
    this.dialogRef.close(result);
  }

}
