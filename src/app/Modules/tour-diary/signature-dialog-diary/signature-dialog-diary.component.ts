import {Component, OnInit, ViewChild} from '@angular/core';
import {RecoveryService} from '../../../core/auth/_services/recovery.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {SignaturePad} from 'angular2-signaturepad';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

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
    // tslint:disable-next-line:ban-types
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
      'backgroundColor': 'rgb(255,255,255)'
  };


  constructor(
    public dialogRef: MatDialogRef<SignatureDialogDiaryComponent>,
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
      const base64 = this.signaturePad.toDataURL('image/jpeg');
    this.imageFile = base64.replace('data:image/jpeg;base64,', '');
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  saveSignature(){}

  close(bySystem: Boolean): void {
    this.dialogRef.close(bySystem);
  }

  clearSignature(): void {
    this.signaturePad.clear();
    this.imageFile = '';
    this.isSignatureAdded = false;
  }

}
