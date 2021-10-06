import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-sbs-inter-branch',
  templateUrl: './sbs-inter-branch.component.html',
  styles: []
})
export class SbsInterBranchComponent implements OnInit {

  public LnTransactionID: string;
  public Lcno: string;
  public ViewOnly: string;
  public mcReceipt: boolean;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.LnTransactionID = this.route.snapshot.params['LnTransactionID'];
    this.Lcno = this.route.snapshot.params['Lcno'];
    this.ViewOnly = this.route.snapshot.params['ViewOnly'];
    this.mcReceipt = false;
  }
}
