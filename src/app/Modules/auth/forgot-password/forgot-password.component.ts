// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';

@Component({
  selector: 'kt-forgot-password',
  templateUrl: './forgot-password.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // Public params
  forgotPasswordForm: FormGroup;
  loading = false;
  errors: any = [];
  inputType: number = 1;

  private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    //private authService: AuthorizationService,
    //private _userUtilsService: UserUtilsService,
    public authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.authNoticeService.onNoticeChanged$.next(null);
    this.initRegistrationForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initRegistrationForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      //mobile: ['', Validators.compose([
      //	Validators.required,
      //	Validators.minLength(11),
      //	Validators.maxLength(11)
      //])
      //],
      //inputType: ['1', Validators.required],

    });
  }

  isValidForm() {
    //var inputType = this.forgotPasswordForm.controls['inputType'].value;
    //if (inputType == 1) {
    //	var x = (this.forgotPasswordForm.controls.email.errors || this.forgotPasswordForm.controls.email.value.length < 4 || this.forgotPasswordForm.controls.email.value.length > 320);
    //	return x;
    //}
    //else {
    //	var x = (this.forgotPasswordForm.controls.mobile.errors || this.forgotPasswordForm.controls.mobile.value.length < 11 || this.forgotPasswordForm.controls.mobile.value.length > 11);
    //	return x;
    //}		
  }


  submit() {

    const controls = this.forgotPasswordForm.controls;
    /** check form */
    if (this.forgotPasswordForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }


    debugger;
    var email = this.forgotPasswordForm.controls['email'].value;
    //var mobile = this.forgotPasswordForm.controls['mobile'].value;

    this.loading = true;

    //this.authService.requestPasswordReset(email).pipe(
    //  tap(response => {
    //    if (response.isSuccess) {
    //      this.authNoticeService.setNotice(response.message, 'success');
    //      this._userUtilsService.setUserEmail(email);
    //      this.router.navigateByUrl('/auth/login');

    //    } else {
    //      this.authNoticeService.setNotice(response.message, 'danger');
    //    }
    //  }),
    //  takeUntil(this.unsubscribe),
    //  finalize(() => {
    //    this.loading = false;
    //    this.cdr.markForCheck();
    //  })
    //).subscribe();
  }

  inputTypeValue() { return this.forgotPasswordForm.controls['inputType'].value; }

  getEmail() {
    return this.forgotPasswordForm.get('email');
  }

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.forgotPasswordForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) &&
      (control.dirty || control.touched);
    return result;
  }
}
