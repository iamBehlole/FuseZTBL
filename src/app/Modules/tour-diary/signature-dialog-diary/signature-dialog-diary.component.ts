import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { RecoveryService } from '../../../../core/auth/_services/recovery.service';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { SignaturePad } from 'angular2-signaturepad';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-signature-dialog-diary',
  templateUrl: './signature-dialog-diary.component.html',
  styleUrls: ['./signature-dialog-diary.component.scss']
//   providers: [
//     { provide: MAT_DIALOG_DATA, useValue: {} },
//     { provide: MatDialogRef, useValue: {} }
// ]
})
export class SignatureDialogDiaryComponent implements OnInit {

  @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
  submitted = false;
  imageFile: any;
  isSignatureAdded = false;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'backgroundColor': "rgb(255,255,255)"
  };


  constructor(
    public dialogRef: MatDialogRef<SignatureDialogDiaryComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private _recoveryService: RecoveryService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    this.isSignatureAdded = true;
    // will be notified of szimek/signature_pad's onEnd event
    var base64 = this.signaturePad.toDataURL('image/jpeg');
    this.imageFile = base64.replace("data:image/jpeg;base64,", "");
    debugger;
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  saveSignature(){}

  close(bySystem: Boolean): void {
    debugger
    this.dialogRef.close(bySystem);
  }

  clearSignature(): void {
    this.signaturePad.clear();
    this.imageFile = "";
    this.isSignatureAdded = false;
  }

}
