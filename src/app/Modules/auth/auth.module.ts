// Angular
import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
// Material
// Translate
import {TranslateModule} from '@ngx-translate/core';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AuthNoticeComponent} from './auth-notice/auth-notice.component';
import {OtpComponent} from './otp/otp.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FuseDirectivesModule} from '../../../@fuse/directives/directives';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AuthEffects, AuthGuard, authReducer} from '../../core/auth';
import {InterceptService} from '../../core/_base/crud';
import {AuthService} from '../../core/auth/_services';
import {UserUtilsService} from '../../core/_base/crud/utils/user-utils.service';


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
    static forRoot(): ModuleWithProviders<any> {
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
