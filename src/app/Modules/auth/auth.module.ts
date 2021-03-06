// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
//import { ChangePasswordComponent } from '../auth/auth-notice/change-password/change-password.component';
import { AuthEffects, AuthGuard, authReducer, AuthService } from '../../../core/auth';
import { OtpComponent } from './otp/otp.component';
import { UserUtilsService } from '../../../core/_base/crud/utils/user-utils.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FuseDirectivesModule} from '../../../@fuse/directives/directives';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
//import { ChangePasswordComponent } from '../user-management/users/_subs/change-password/change-password.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        //data: { returnUrl: window.location.pathname }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      // {
      //   path: 'OTP',
      //   component: OtpComponent,
      // },
      //{
      //  path: 'change-password',
      //  component: ChangePasswordComponent
      //}
      //{
      //  path: 'unauthorize',
      //  component: UnauthorizeComponent
      //}
    ]
  }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects]),
        MatFormFieldModule,
        MatIconModule,
        FuseDirectivesModule,
        FuseSharedModule,
        MatInputModule,
        MatButtonModule
    ],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
	],
	exports: [AuthComponent],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		OtpComponent,
		//ChangePasswordComponent
	],
  entryComponents: [
    OtpComponent
  ]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
        AuthService,
        UserUtilsService,
				AuthGuard
			]
		};
	}
}
