import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PartialsModule} from '../../partials/partials.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxMaskModule} from 'ngx-mask';
import {RecoveryFormComponent} from './recovery-form/recovery-form.component';
import {LoanInquiryComponent} from './loan-inquiry/loan-inquiry.component';
import {FaBranchComponent} from './fa-branch/fa-branch.component';
import {InterBranchComponent} from './inter-branch/inter-branch.component';
import {SbsInterBranchComponent} from './sbs-inter-branch/sbs-inter-branch.component';
import {SearchRecoveryTransactionComponent} from './search-recovery-transaction/search-recovery-transaction.component';
import {SbsFaBranchComponent} from './sbs-fa-branch/sbs-fa-branch.component';
import {LoanReceiptComponent} from './loan-receipt/loan-receipt.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SearchPendingTransactionComponent} from './search-pending-transaction/search-pending-transaction.component';
import {SearchRefferedbackTransactionComponent} from './search-refferedback-transaction/search-refferedback-transaction.component';
import {SearchSbsPendingTransactionComponent} from './search-sbs-pending-transaction/search-sbs-pending-transaction.component';
import {SearchRecoveryCommonComponent} from './search-recovery-common/search-recovery-common.component';
import {TestComponent} from './test/test.component';
import {SignatureDialogComponent} from './signature-dialog/signature-dialog.component';
import {SignaturePadModule} from 'angular2-signaturepad';
import {NgxBarcodeModule} from 'ngx-barcode';
import {NgxCaptureModule} from 'ngx-capture';
import {NgxPrintModule} from 'ngx-print';
import {NgxPaginationModule} from 'ngx-pagination';
import {CoreModule} from 'app/core/core.module';
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
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatList, MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
    declarations: [RecoveryFormComponent, LoanInquiryComponent, FaBranchComponent, InterBranchComponent, SbsInterBranchComponent, SearchRecoveryTransactionComponent, SbsFaBranchComponent, LoanReceiptComponent, SpinnerComponent, SearchPendingTransactionComponent, SearchRefferedbackTransactionComponent, SearchSbsPendingTransactionComponent, SearchRecoveryCommonComponent, TestComponent, SignatureDialogComponent],
    imports: [
        NgxPrintModule,
        CommonModule,
        PartialsModule,
        CoreModule,
        RouterModule.forChild([
            {
                path: 'sbs-fa-branch',
                component: SbsFaBranchComponent
            },
            {
                path: 'fa-branch',
                component: FaBranchComponent
            },
            {
                path: 'fa-branch/:transactionID/:lcno/:viewOnly',
                component: FaBranchComponent
            },
            {
                path: 'inter-branch',
                component: InterBranchComponent
            },
            {
                path: 'sbs-inter-branch',
                component: SbsInterBranchComponent
            },
            {
                path: 'search-recovery-transaction',
                component: SearchRecoveryTransactionComponent
            },
            {
                path: 'loan-inquiry',
                component: LoanInquiryComponent
            },
            {
                path: 'loan-inquiry/:transactionID/:lcno',
                component: LoanInquiryComponent
            },
            {
                path: 'search-pending-transaction',
                component: SearchPendingTransactionComponent
            },
            {
                path: 'search-refferedback-transaction',
                component: SearchRefferedbackTransactionComponent
            },
            {
                path: 'search-sbs-pending-transaction',
                component: SearchSbsPendingTransactionComponent
            },
            {
                path: 'test',
                component: TestComponent
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
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
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatListModule,
        MatCardModule,
        MatChipsModule,
        NgxMatSelectSearchModule,
        NgxMaskModule.forRoot(),
        NgxSpinnerModule,
        SignaturePadModule,
        NgxBarcodeModule,
        NgxCaptureModule,
        NgxPaginationModule
    ],
    entryComponents: [
        LoanReceiptComponent,
        SignatureDialogComponent
    ],
    exports: [SpinnerComponent]
})
export class LoanRecoveryModule {
}
