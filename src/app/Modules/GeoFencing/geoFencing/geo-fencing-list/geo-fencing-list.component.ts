import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutUtilsService } from "../../../../../core/_base/crud";
import { MatDialog, MatTableDataSource } from '@angular/material';
import { GeoFencingService } from '../../../../../core/auth/_services/geo-fencing.service';
import { ViewGetFancingModalComponent } from '../view-get-fancing-modal/view-get-fancing-modal.component';
import { finalize } from 'rxjs/operators';
import {BaseResponseModel} from '../../../../../core/_base/crud/models/_base.response.model'
@Component({
  selector: 'kt-geo-fencing-list',
  templateUrl: './geo-fencing-list.component.html',
  styleUrls: ['./geo-fencing-list.component.scss']
})
export class GeoFencingListComponent implements OnInit {

    displayedColumns = ['User', 'Type', 'Date', 'View',  'Delete'];
    constructor(

     // private layoutUtilsService: LayoutUtilsService,
      private router: Router,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private spinner: NgxSpinnerService,
      private  _geoFencingService :GeoFencingService,
      private dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
    ) { }

    itemsPerPage = 30;
    pageIndex = 1;
    offSet = 0;

    totalItems: number | any;
    dv: number | any; //use later

    dataSource: MatTableDataSource<GeoFencingList>
    listForm : FormGroup


    ngOnInit() {
      this.createForm();
    }

    createForm(){
      this.listForm = this.fb.group({
        VendorName:[''],
        PhoneNumber:['']
      })
    }

    find(){
      //this.searchVendor()
      this.view(null);
    }
    view(data:any){
        const dialogRef = this.dialog.open(ViewGetFancingModalComponent, { width: "1200px", data: {  }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
    }
    searchVendor(){
      this.spinner.show();
      this._geoFencingService.GetGeoFencing().pipe(finalize(()=>{this.spinner.hide()})).subscribe((baseResponse: BaseResponseModel)=>{
        if(baseResponse.Success === true){

        }
        else{
          this.layoutUtilsService.alertElement("", baseResponse.Message);
        }
      });
    }

    delete(data:any){}
    edit(data:any){}
}
interface GeoFencingList{
  User: string;
  Type: string;
  Date: string;

}
