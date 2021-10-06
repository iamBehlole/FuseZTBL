// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
  MatTooltipModule,
  MatListModule,
  MatChipsModule
} from '@angular/material';
// NgBootstrap
import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
import { TimeAgoPipe } from 'time-ago-pipe';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	NotificationComponent,
	QuickActionComponent,
	QuickPanelComponent,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	StickyToolbarComponent,
	Subheader1Component,
	Subheader2Component,
	Subheader3Component,
	Subheader4Component,
	Subheader5Component,
	SubheaderSearchComponent,
	UserProfile2Component,
	UserProfile3Component,
	UserProfileComponent,
    NotificationDetailsComponent,
} from './layout';
// General
import {NoticeComponent} from './content/general/notice/notice.component';
import {PortletModule} from './content/general/portlet/portlet.module';
// Errpr
import {ErrorComponent} from './content/general/error/error.component';
// Extra module
import {WidgetModule} from './content/widgets/widget.module';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
import {CartComponent} from './layout/topbar/cart/cart.component';
import { MaterialFileUploadComponent } from './content/general/material-file-upload/material-file-upload.component';
import { AlertDialogComponent } from './content/crud/alert-dialog/alert-dialog.component';
import { AlertDialogWarnComponent } from './content/crud/alert-dialog-warn/alert-dialog-warn.component';
import { AgmCoreModule } from '@agm/core';
import { AlertDialogSuccessComponent } from './content/crud/alert-dialog-success/alert-dialog-success.component';
import { AlertDialogCaptureComponent } from './content/crud/alert-dialog-capture/alert-dialog-capture.component';
import { AlertDialogConfirmationComponent } from './content/crud/alert-dialog-confirmation/alert-dialog-confirmation.component';
import { AlphabetOnlyDirective } from './_directives/alphabet-only.directive';
import { NumberOnlyDirective } from './_directives/number-only.directive';
import { AlphaNumericFieldDirective } from './_directives/alpha-numeric-field.directive';
import { CapsOnlyDirective } from './_directives/caps-only.directive';
import { AlertMessageComponent } from './content/crud/alert-message/alert-message.component';
import { AlphaNumSpecialDirective } from './_directives/alpha-num-special.directive';
import { NumberAndDecimalDirective } from './_directives/number-and-decimal.directive';


@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
    AlertComponent,
    TimeAgoPipe,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
    UserProfile2Component,
    NotificationDetailsComponent,
		UserProfile3Component,
		CartComponent,
		ErrorComponent,

    MaterialFileUploadComponent,
    AlertDialogComponent,
    AlertDialogWarnComponent,
    AlertDialogSuccessComponent,
    AlertDialogCaptureComponent,
    AlertDialogConfirmationComponent,

    AlphabetOnlyDirective,
    NumberOnlyDirective,
    AlphaNumericFieldDirective,
    CapsOnlyDirective,
    AlertMessageComponent,
    AlphaNumSpecialDirective,
    NumberAndDecimalDirective

	],
	exports: [
		WidgetModule,
		PortletModule,

		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
    UserProfileComponent,
    NotificationDetailsComponent,
		UserProfile2Component,
		UserProfile3Component,
		CartComponent,
		ErrorComponent,
    MaterialFileUploadComponent,

    AlphabetOnlyDirective,
    NumberOnlyDirective,
    AlphaNumericFieldDirective,
    CapsOnlyDirective,
    AlertMessageComponent,
    AlphaNumSpecialDirective,
    NumberAndDecimalDirective


	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
    WidgetModule,

		// angular material modules
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
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
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,

		// ng-bootstrap modules
		NgbDropdownModule,
		NgbTabsetModule,
    NgbTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
      libraries: ['places', 'drawing', 'geometry'],
    }),
    MatListModule,
    MatCardModule,
    MatChipsModule,
	],
})
export class PartialsModule {
}
