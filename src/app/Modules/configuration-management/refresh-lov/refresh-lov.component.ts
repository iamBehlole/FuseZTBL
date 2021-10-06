import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-refresh-lov',
  templateUrl: './refresh-lov.component.html',
  styleUrls: ['./refresh-lov.component.scss']
})
export class RefreshLovComponent implements OnInit {

  viewLoading = false;
  loadingAfterSubmit = false;

  constructor() { }

  refreshLov(){}

  ngOnInit() {
  }

}
