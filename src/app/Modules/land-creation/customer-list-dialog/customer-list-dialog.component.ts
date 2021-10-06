import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-customer-list-dialog',
  templateUrl: './customer-list-dialog.component.html',
  styleUrls: ['./customer-list-dialog.component.scss']
})
export class CustomerListDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomerListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  onCloseClick(): void {
    debugger;
    this.dialogRef.close(); // Keep only this row
  }

}
