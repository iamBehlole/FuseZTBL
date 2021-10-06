import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-spinner',
  template: `
    <ngx-spinner bdColor="rgba(51,51,51,0.8)"
             size="medium"
             color="#ecbd00"
             type="ball-scale-multiple">
  <p style="font-size: 20px; color: white">Loading...</p>
</ngx-spinner>
  `,
  styles: []
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
