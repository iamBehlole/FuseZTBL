import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanDocuments } from '../../../../core/auth/_models/loan-application-header.model';

@Component({
  selector: 'kt-cl-document-view',
  templateUrl: './cl-document-view.component.html',
  styleUrls: ['./cl-document-view.component.scss']
})
export class ClDocumentViewComponent implements OnInit {


  loanDocumentArray: LoanDocuments[] = [];

  url: any;
  constructor(public dialogRef: MatDialogRef<ClDocumentViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    debugger
    this.url = data.url 
    this.loanDocumentArray = data.documentView
  }

  ngOnInit() {

  }

}
