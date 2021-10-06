import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RecoveryService } from '../../../../core/auth/_services/recovery.service';
import { finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';



@Component({
  selector: 'kt-loan-receipt',
  templateUrl: './loan-receipt.component.html',
  styles: []
})
export class LoanReceiptComponent implements OnInit {

  @ViewChild('screen', { static: true }) screen: any;

  name = "Angular";
  receiptBase64 = "";
  receipt: any;
  receiptDetail: any;
  signature: any;
  barcode: string;
  submitted = false;
  constructor(public dialogRef: MatDialogRef<LoanReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.receipt = this.data;
    console.log('Receipt data');
    console.log(this.receipt);
    this.submitted = true;
    this.spinner.show();


    //this.captureService
    //  .getImage(this.screen.nativeElement, true)
    //  .pipe(
    //    tap(img => {
    //      this.receiptBase64 = img;
    //    })
    //  )
    //  .subscribe();
    debugger
    this._recoveryService
      .getReceiptDetail(this.receipt)
      .pipe(
        finalize(() => {
          this.spinner.hide();
          this.submitted = false;
        })
      )
      .subscribe((baseResponse: BaseResponseModel) => {
        debugger;
        console.log(baseResponse);
        if (baseResponse.Success === true) {
          this.receiptDetail = baseResponse.Recovery.Receipt;
          this.receiptDetail.forEach(function (part, index) {
            if (this[index].LabelL == "Customer Name")
              this[index].ValueL = this[index].ValueL.replace(/(?:\r\n|\r|\n)/g,'<br>');
          }, this.receiptDetail);
          //this.signature = "data:image/jpeg;base64," + baseResponse.Recovery.ReceiptSignature;
          //this.barcode = this.receipt.TransactionID + "," + this.receipt.BranchWorkingDate;
        }
        else {
          this.layoutUtilsService.alertMessage("", baseResponse.Message);
        }
      });
  
  }

  close(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/dashboard');
    //const url = this.router.serializeUrl(
    //  this.router.createUrlTree(['../../dashboard'], { relativeTo: this.activatedRoute })
    //);
    //window.open(url, '_blank');
  }

  downloadReceipt() {
    debugger
    if (this.receiptBase64 != "") {
    debugger;

    this.receiptBase64 = this.receiptBase64.replace("data:image/png;base64,", "")
    const blobData = this.convertBase64ToBlobData(this.receiptBase64);


    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blobData, this.receipt.DisbursementID + ".jpeg");
    } else { // chrome
      const blob = new Blob([blobData], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.receipt.DisbursementID + ".jpeg";
      link.click();
      }
    }
    //this.captureService
    //  .getImage(this.screen.nativeElement, true)
    //  .then(img => {
    //    debugger;

    //    this.receiptBase64 = img;
    //    this.receiptBase64 = this.receiptBase64.replace("data:image/png;base64,", "")
    //    const blobData = this.convertBase64ToBlobData(this.receiptBase64);


    //    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
    //      window.navigator.msSaveOrOpenBlob(blobData, this.receipt.DisbursementID + ".jpeg");
    //    } else { // chrome
    //      const blob = new Blob([blobData], { type: "image/jpeg" });
    //      const url = window.URL.createObjectURL(blob);
    //       window.open(url);
    //      const link = document.createElement('a');
    //      link.href = url;
    //      link.download = this.receipt.DisbursementID + ".jpeg";
    //      link.click();
    //    }
    //  });

  }

  //htmlToImage.toJpeg(document.getElementById('downloadReceiptNode'), { quality: 0.95 })
  //  .then(function (dataUrl) {
  //    var link = document.createElement('a');
  //    link.download = 'name.jpeg';
  //    link.href = dataUrl;
  //    link.click();
  //  });


  convertBase64ToBlobData(base64Data: string, contentType: string = 'image/jpeg', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
