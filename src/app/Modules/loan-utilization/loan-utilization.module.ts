import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  MatMenuModule,
  MatTableModule,
  MatSelectModule,
  MatInputModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatIconModule,
  MatProgressBarModule,
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
  MatButtonModule,
  MatChipsModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatFormFieldModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxMaskModule} from 'ngx-mask';
import {PartialsModule} from '../../partials/partials.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {LoanRecoveryModule} from '../loan-recovery/loan-recovery.module';
import {SearchLoanUtilizationComponent} from './search-loan-utilization/search-loan-utilization.component';
import {LoanUtilizationComponent} from './loan-utilization/loan-utilization.component';
import {SearchUtilizationComponent} from './search-utilization/search-utilization.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';


@NgModule({
  declarations: [
    LoanUtilizationComponent,
    SearchLoanUtilizationComponent,
    SearchUtilizationComponent],
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild([
      {
        path: 'loan-uti',
        component: LoanUtilizationComponent
      },
      {
        path: 'search-uti',
        component: SearchUtilizationComponent
      },
      {
        path: 'search-loan-uti',
        component: SearchLoanUtilizationComponent
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
    MatProgressBarModule,
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
    NgxPaginationModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    LoanRecoveryModule,
    CommonModule,
    MatDatepickerModule,
    NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [
    // ClGlSchemeCropConfigurationComponent,
    // ClDocumentViewComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LoanUtilizationModule {
}
