import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportManagementComponent } from './report-management.component';
import { ApilogsListComponent } from './apilogs-list/apilogs-list.component';
import { AgmCoreModule } from '@agm/core';
import { ApilogDetailComponent } from './apilog-detail/apilog-detail.component';
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule,
  MatListModule,
  MatChipsModule
} from '@angular/material';
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../../partials/partials.module';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { ExceptionlogsListComponent } from './exception-log/exceptionlogs-list/exceptionlogs-list.component';
import { ExceptionlogDetailsComponent } from './exception-log/exceptionlog-details/exceptionlog-details.component';
import { LocationHistoryListComponent } from './Location-history/location-history-list/location-history-list.component';
import { LocationHistoryDetailsComponent } from './Location-history/location-history-details/location-history-details.component';
import { NotificationHistoryComponent } from './Notification-history/notification-history/notification-history.component';
import { NotificationDetailsComponent } from './Notification-history/notification-details/notification-details.component';
import { EcibQeueComponent } from './ecib-qeue/ecib-qeue.component';
import { McoRecoveryCountsComponent } from './mco-recovery-counts/mco-recovery-counts.component';


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
export class ReportManagementModule { }
