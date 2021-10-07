// Angular
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayModule} from '@angular/cdk/overlay';
// Angular in memory
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
// Perfect Scroll bar
// SVG inline
// Env
import {environment} from '../environments/environment';
// Hammer JS
import 'hammerjs';
// NGX Permissions
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
// State
import {metaReducers, reducers} from './core/reducers';
// Copmponents
import {AppComponent} from './app.component';
// Modules
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
//import { MatMultiselectModule } from './../../projects/mat-multiselect/src/lib/mat-multiselect.module';
// Layout Services
import {
    DataTableService,
    FakeApiService,
    KtDialogService,
    LayoutConfigService,
    LayoutRefService,
    MenuAsideService,
    MenuConfigService,
    MenuHorizontalService,
    PageConfigService,
    SplashScreenService,
    SubheaderService
} from './core/_base/layout';
// Auth
import {AuthService} from './core/auth';
// CRUD
import {HttpUtilsService, LayoutUtilsService, TypesUtilsService} from './core/_base/crud';
// Config
import {LayoutConfig} from './core/_config/layout.config';
// Highlight JS

import {CommonModule, DatePipe} from '@angular/common';
import {TokenInterceptor} from './core/_httpInterceptor/httpconfig.interceptor';
import {PartialsModule} from './partials/partials.module';
import {AuthModule} from './Modules/auth/auth.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {NgxPermissionsModule} from 'ngx-permissions';
import {InlineSVGModule} from 'ng-inline-svg';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 40,
    maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
    // initialize app by loading default demo layout config
    return () => {
        if (appConfig.getConfig() === null) {
            appConfig.loadConfigs(new LayoutConfig().configs);
        }
    };
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,
        environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
            passThruUnknownUrl: true,
            dataEncapsulation: false
        }) : [],
        NgxPermissionsModule.forRoot(),
        PartialsModule,
        CoreModule,
        //MatMultiselectModule,
        OverlayModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
        StoreDevtoolsModule.instrument(),
        AuthModule.forRoot(),
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
        InlineSVGModule.forRoot(),
    ],
    exports: [],
    providers: [
        DatePipe,
        AuthService,
        LayoutConfigService,
        LayoutRefService,
        MenuConfigService,
        PageConfigService,
        KtDialogService,
        DataTableService,
        SplashScreenService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            // layout config initializer
            provide: APP_INITIALIZER,
            useFactory: initializeLayoutConfig,
            deps: [LayoutConfigService], multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        // template services
        SubheaderService,
        MenuHorizontalService,
        MenuAsideService,
        HttpUtilsService,
        TypesUtilsService,
        LayoutUtilsService,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
