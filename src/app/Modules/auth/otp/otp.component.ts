// Angular
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { result } from 'lodash';

@Component({
  selector: 'kt-otp',
  templateUrl: './otp.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OtpComponent implements OnInit {

  // Public params
  otpForm: FormGroup;
  loading = false;
  errors: any = [];

  private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param authService
   * @param authNoticeService
   * @param translate
   * @param router
   * @param fb
   * @param cdr
   */
  constructor(
    private authService: AuthService,
    public authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    public dialogRef: MatDialogRef<OtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.initRegistrationForm();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initRegistrationForm() {
    this.otpForm = this.fb.group({
      otp: ['', Validators.compose([
        Validators.required,
        //Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ]
    });
  }

  /**
   * Form Submit
   */
  submit() {
    this.loading = true;

    this.auth.SendOTPResuest(this.data.baseResponse.User, this.otpForm.controls['otp'].value).pipe(finalize(()=>{this.loading = true})).subscribe(result => {
      if(result.Success){
        this.onCloseClick(result);
      }
      else {
        this.authNoticeService.setNotice(result.Message, 'danger');
      }
    });


    //const email = controls.otp.value;
    //this.router.navigateByUrl('/dashboard');
    this.otpForm.controls['otp'].value;


  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.otpForm.controls[controlName];

    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) &&
      (control.dirty || control.touched);
    return result;
  }

  onCloseClick(data:any): void {
    this.dialogRef.close({ data: {data} }); // Keep only this row
  }

}
