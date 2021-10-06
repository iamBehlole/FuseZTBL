import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'kt-tour-diary',
  templateUrl: './tour-diary.component.html',
  styleUrls: ['./tour-diary.component.scss']
})
export class TourDiaryComponent implements OnInit {

  gridForm : FormGroup;


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm()
  }

  createForm(){
    this.gridForm = this.fb.group({
      McoName : [''],
      PPNO : [''],
      Month: ['']
    })
  }

}
