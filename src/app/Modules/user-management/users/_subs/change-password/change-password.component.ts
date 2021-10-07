// Angular
import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
// RxJS
import { BehaviorSubject } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
import {AuthService, User} from '../../../../../core/auth';
import {AppState} from '../../../../../core/reducers';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
// Auth
// State
// Layout

export class PasswordValidation {
	/**
	 * MatchPassword
	 *
	 * @param AC: AbstractControl
	 */
		static MatchPassword(AC: AbstractControl) {
				const password = AC.get('password').value; // to get value in input tag
				const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
				if (password !== confirmPassword) {
			AC.get('confirmPassword').setErrors( {MatchPassword: true} );
				} else {
						return null;
				}
		}
}

@Component({
	selector: 'kt-change-password',
	templateUrl: './change-password.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
	// Public properties
	@Input() userId: number;
	@Input() loadingSubject = new BehaviorSubject<boolean>(false);
	hasFormErrors = false;
	user: User;
	changePasswordForm: FormGroup;

	/**
	 * Component constructor
	 *
	 * @param fb: FormBuilder
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private fb: FormBuilder, private auth: AuthService, private store: Store<AppState>,
		// tslint:disable-next-line:align
		private layoutUtilsService: LayoutUtilsService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		//this.loadData();
	}

	/**
	 * Load data
	 */
	//loadData() {
	//	this.auth.getUserById(this.userId).subscribe(res => {
	//		this.user = res;
	//		this.createForm();
	//	});
	//}

	/**
	 * Init form
	 */
	createForm() {
		this.changePasswordForm = this.fb.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		});
	}

	/**
	 * Reset
	 */
	reset() {
		this.hasFormErrors = false;
		this.loadingSubject.next(false);
		this.changePasswordForm.markAsPristine();
		this.changePasswordForm.markAsUntouched();
		this.changePasswordForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 */
	onSubmit() {
		this.loadingSubject.next(true);
		this.hasFormErrors = false;
		const controls = this.changePasswordForm.controls;
		/** check form */
		if (this.changePasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.loadingSubject.next(false);

			return;
		}

	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
