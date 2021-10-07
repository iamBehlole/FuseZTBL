// Angular
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
// Translate
import {TranslateService} from '@ngx-translate/core';
import {Userpassworddetails} from '../../../core/auth/_models/userpassworddetails.model';
import {AuthService} from '../../../core/auth/_services';
import {AuthNoticeService, User} from '../../../core/auth';
import {AppState} from '../../../core/reducers';
import {Store} from '@ngrx/store';
import {MatDialog} from '@angular/material/dialog';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {KtDialogService} from '../../../core/_base/layout';
import {OtpComponent} from '../otp/otp.component';
/**
 * ! Just example => Should be removed in development
 */

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup;
    loading = false;
    user: User = new User();
    userpassworddetails: Userpassworddetails = new Userpassworddetails();
    isLoggedIn$: Observable<boolean>;
    errors: any = [];
    private unsubscribe: Subject<any>;

    private returnUrl: any;

    // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    /**
     * Component constructor
     *
     * @param router: Router
     * @param auth: AuthService
     * @param authNoticeService: AuthNoticeService
     * @param translate: TranslateService
     * @param store: Store<AppState>
     * @param fb: FormBuilder
     * @param cdr
     * @param route
     */
    constructor(
        private router: Router,
        private auth: AuthService,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService,
        private store: Store<AppState>,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private _userUtilsService: UserUtilsService,
        private ktDialogService: KtDialogService,
    ) {
        this.unsubscribe = new Subject();
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {

        this.initLoginForm();

        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl || '/';
        });


        var userUtilService = new UserUtilsService();
        var currentUser = userUtilService.getUserDetails();

        //if (currentUser.isOTPValidated) {
        //  this.router.navigateByUrl('/');
        //}

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.authNoticeService.setNotice(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        // demo message to show
        // if (!this.authNoticeService.onNoticeChanged$.getValue()) {
        //   const initialNotice = `Use account
        //<strong>${DEMO_PARAMS.EMAIL}</strong> and password
        //<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
        //   this.authNoticeService.setNotice(initialNotice, 'info');
        // }

        this.loginForm = this.fb.group({
            DisplayName: [this.user.DisplayName, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(320)
            ])
            ],
            Password: [this.userpassworddetails.Password, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        localStorage.clear();

        const controls = this.loginForm.controls;
        /** check form */
        if (this.loginForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        this.loading = true;
        this.user.UserPasswordDetails = Object.assign(this.userpassworddetails);
        this.user = Object.assign(this.user, this.loginForm.getRawValue());
        this.user.App = 1;
        this.auth.login(this.loginForm.value.DisplayName, this.loginForm.value.Password)
            .pipe(
                tap((baseResponse: any) => {
                    if (baseResponse.Success) {
                        localStorage.setItem('MaxNumberOfImages', JSON.stringify(baseResponse.LoanUtilization['MaxNumberOfImages']));
                        localStorage.setItem('MaxNumberOfVideo', JSON.stringify(baseResponse.LoanUtilization['MaxNumberOfVideo']));
                        localStorage.setItem('VideoTimeLimit', JSON.stringify(baseResponse.LoanUtilization['VideoTimeLimit']));

                        if (baseResponse.isWebOTPEnabled == true) {

                            const dialogRef = this.dialog.open(OtpComponent, {
                                data: {baseResponse},
                                disableClose: true,
                                height: '40%',
                                width: '20%'
                            });
                            dialogRef.afterClosed().subscribe(res => {
                                if (res.data.data.Token && res.data.data.RefreshToken) {
                                    localStorage.setItem('ZTBLUserToken', JSON.stringify(res.data.data.Token));
                                    localStorage.setItem('ZTBLUserRefreshToke', JSON.stringify(res.data.data.RefreshToken));
                                    this._userUtilsService.setUserDetails(baseResponse);
                                    this.ktDialogService.hide();
                                    this.router.navigateByUrl('/dashboard');
                                    //this.router.navigate['/dashboard'];
                                }
                            });
                        } else {
                            if (baseResponse.Token && baseResponse.RefreshToken) {
                                localStorage.setItem('ZTBLUserToken', JSON.stringify(baseResponse.Token));
                                localStorage.setItem('ZTBLUserRefreshToke', JSON.stringify(baseResponse.RefreshToken));
                            }
                            this._userUtilsService.setUserDetails(baseResponse);
                            this.router.navigateByUrl('/dashboard');
                        }

                    } else {
                        this.authNoticeService.setNotice(baseResponse.Message, 'danger');
                    }
                }),
                takeUntil(this.unsubscribe),
                finalize(() => {
                    debugger;
                    this.loading = false;
                    this.cdr.markForCheck();
                })
            )
            .subscribe();
    }


    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }


}
