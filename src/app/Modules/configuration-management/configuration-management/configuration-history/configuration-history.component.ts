import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-configuration-history',
  templateUrl: './configuration-history.component.html',
  styleUrls: ['./configuration-history.component.scss']
})
export class ConfigurationHistoryComponent implements OnInit {

  viewLoading = false;
  loadingAfterSubmit = false;
  updateHistory : any;

  constructor() { }

  ngOnInit() {
  }

}
