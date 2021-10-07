
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {KtDialogService} from '../../../core/_base/layout';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'kt-area-convertor',
  templateUrl: './area-convertor.component.html'
})
export class AreaConvertorComponent implements OnInit {


  Unit: string;
  Area: number;
  ConvertUnit: string;
  Result: number;
  ConvertorForm: FormGroup;

  UnitConverter = [{ id: "1", name: "Kanal" }, { id: "2", name: "Acre" }, { id: "3", name: "Gunta" }]
  UnitConverterd = [{ id: "1", name: "Marla" }]

  



  constructor(
    public dialogRef: MatDialogRef<AreaConvertorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,) { }

  ngOnInit() {
    this.ConvertUnit = "1";
  }




  AreaConverter() {
    debugger;
    if (this.Unit == "1" && (this.Area != undefined || this.Area != null)) {
      this.Result = this.Area * 20;
    }

    if (this.Unit == "2" && (this.Area != undefined || this.Area != null)) {
      this.Result = this.Area * 160;
    }
    if (this.Unit == "3" && (this.Area != undefined || this.Area != null)) {
      this.Result = this.Area * 4;
    }
    this.cdRef.detectChanges();
  }

  onCloseClick(): void {
    debugger;
    this.dialogRef.close({ data: { TotalArea: this.Result.toString() } }); // Keep only this row
  }

}
