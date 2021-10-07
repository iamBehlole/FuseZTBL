// Angular
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// NgBootstrap
// Perfect Scrollbar
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
import {CartComponent} from './layout/topbar/cart/cart.component';
import {MaterialFileUploadComponent} from './content/general/material-file-upload/material-file-upload.component';
import {AlertDialogComponent} from './content/crud/alert-dialog/alert-dialog.component';
import {AlertDialogWarnComponent} from './content/crud/alert-dialog-warn/alert-dialog-warn.component';
import {AgmCoreModule} from '@agm/core';
import {AlertDialogSuccessComponent} from './content/crud/alert-dialog-success/alert-dialog-success.component';
import {AlertDialogCaptureComponent} from './content/crud/alert-dialog-capture/alert-dialog-capture.component';
import {AlertDialogConfirmationComponent} from './content/crud/alert-dialog-confirmation/alert-dialog-confirmation.component';
import {AlphabetOnlyDirective} from './_directives/alphabet-only.directive';
import {NumberOnlyDirective} from './_directives/number-only.directive';
import {AlphaNumericFieldDirective} from './_directives/alpha-numeric-field.directive';
import {CapsOnlyDirective} from './_directives/caps-only.directive';
import {AlertMessageComponent} from './content/crud/alert-message/alert-message.component';
import {AlphaNumSpecialDirective} from './_directives/alpha-num-special.directive';
import {NumberAndDecimalDirective} from './_directives/number-and-decimal.directive';
import {CoreModule} from 'app/core/core.module';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDropdownModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {TimeAgoPipe} from 'time-ago-pipe';

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
        NgbNavModule,
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
