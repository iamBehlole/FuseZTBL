import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReportManagementComponent} from './report-management.component';
import {ApilogsListComponent} from './apilogs-list/apilogs-list.component';
import {AgmCoreModule} from '@agm/core';
import {ApilogDetailComponent} from './apilog-detail/apilog-detail.component';
// Shared
import {ActionNotificationComponent} from '../../partials/content/crud';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {PartialsModule} from '../../partials/partials.module';
import {StoreModule} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EffectsModule} from '@ngrx/effects';
import {TranslateModule} from '@ngx-translate/core';
import {ExceptionlogsListComponent} from './exception-log/exceptionlogs-list/exceptionlogs-list.component';
import {ExceptionlogDetailsComponent} from './exception-log/exceptionlog-details/exceptionlog-details.component';
import {LocationHistoryListComponent} from './Location-history/location-history-list/location-history-list.component';
import {LocationHistoryDetailsComponent} from './Location-history/location-history-details/location-history-details.component';
import {NotificationHistoryComponent} from './Notification-history/notification-history/notification-history.component';
import {EcibQeueComponent} from './ecib-qeue/ecib-qeue.component';
import {McoRecoveryCountsComponent} from './mco-recovery-counts/mco-recovery-counts.component';
import {UserEffects, usersReducer} from '../../core/auth';
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '../../core/_base/crud';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';


const routes: Routes = [
    {
        path: '',
        component: ReportManagementComponent,
        children: [
            {
                path: '',
                redirectTo: 'api-logs',
                pathMatch: 'full'
            },
            {
                path: 'api-logs',
                component: ApilogsListComponent
            },
            {
                path: 'exception-logs',
                component: ExceptionlogsListComponent
            },
            {
                path: 'notification-history',
                component: NotificationHistoryComponent
            },
            {
                path: 'user-history',
                component: LocationHistoryListComponent
            },

            {
                path: 'ecib-qeue',
                component: EcibQeueComponent
            },
            {
                path: 'mco-recovery-count',
                component: McoRecoveryCountsComponent
            }

        ]
    }
];

@NgModule({
    declarations: [ReportManagementComponent, ApilogsListComponent, ApilogDetailComponent, ExceptionlogsListComponent, ExceptionlogDetailsComponent, LocationHistoryListComponent, LocationHistoryDetailsComponent, NotificationHistoryComponent, EcibQeueComponent, McoRecoveryCountsComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        PartialsModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatListModule,
        MatCardModule,
        MatChipsModule
    ],
    providers: [
        InterceptService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: true,
                panelClass: 'kt-mat-dialog-container__wrapper',
                height: 'auto',
                width: '900px'
            }
        },
        HttpUtilsService,
        TypesUtilsService,
        LayoutUtilsService
    ],
    entryComponents: [
        ActionNotificationComponent,
        ApilogDetailComponent,
        ExceptionlogDetailsComponent,
        //NotificationDetailsComponent
    ]


})
export class ReportManagementModule {
}
