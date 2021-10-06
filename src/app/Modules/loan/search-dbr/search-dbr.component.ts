import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-search-dbr',
  templateUrl: './search-dbr.component.html',
  styleUrls: ['./search-dbr.component.scss']
})
export class SearchDbrComponent implements OnInit {

  displayedColumns = ['BranchName', 'AppDate', 'AppNumberManual', 'LoanCaseNo', 'Action'];
  dataSource = new MatTableDataSource();

  constructor() { }

  ngOnInit() {
    this.dataSource.data = [];
  }

}
