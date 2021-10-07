import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../core/auth/_services/user.service';


@Component({
  selector: 'kt-pdf-text',
  templateUrl: './pdf-text.component.html',
  styleUrls: ['./pdf-text.component.scss']
})
export class PdfTextComponent implements OnInit {

  constructor(private _userService: UserService,) { }

  ngOnInit() {
    this.showPDF();
  }



  public showPDF(): void {
    this._userService.getPDF()
      .subscribe(x => {
        debugger;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        var newBlob = new Blob([x], { type: "application/pdf" });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = "Je kar.pdf";
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      }, response => {
          debugger;
        console.log("POST in error", response);
      },
        () => {
          console.log("POST observable is now completed.");
        });
  }












  //public showPDF(): void {
  //  this._userService.getPDF()
  //    .subscribe(x => {
  //      debugger;
  //      // It is necessary to create a new blob object with mime-type explicitly set
  //      // otherwise only Chrome works like it should
  //      var newBlob = new Blob([x], { type: "application/pdf" });

  //      // IE doesn't allow using a blob object directly as link href
  //      // instead it is necessary to use msSaveOrOpenBlob
  //      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //        window.navigator.msSaveOrOpenBlob(newBlob);
  //        return;
  //      }

  //      // For other browsers: 
  //      // Create a link pointing to the ObjectURL containing the blob.
  //      const data = window.URL.createObjectURL(newBlob);

  //      var link = document.createElement('a');
  //      link.href = data;
  //      link.download = "Je kar.pdf";
  //      // this is necessary as link.click() does not work on the latest firefox
  //      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  //      setTimeout(function () {
  //        // For Firefox it is necessary to delay revoking the ObjectURL
  //        window.URL.revokeObjectURL(data);
  //        link.remove();
  //      }, 100);
  //    });
  //}




}
