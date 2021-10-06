import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule } from '@angular/material';
import { ClApplicationHeaderComponent } from './cl-application-header/cl-application-header.component';
import { ClCustomersComponent } from './cl-customers/cl-customers.component';
import { ClPurposeComponent } from './cl-purpose/cl-purpose.component';
import { ClSecuritiesComponent } from './cl-securities/cl-securities.component';
import { ClLegalHeirsComponent } from './cl-legal-heirs/cl-legal-heirs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { PartialsModule } from '../../partials/partials.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ClGlSchemeCropConfigurationComponent } from './cl-gl-scheme-crop-configuration/cl-gl-scheme-crop-configuration.component';
import { ClAppraisalOfProposedInvestmentComponent } from './cl-appraisal-of-proposed-investment/cl-appraisal-of-proposed-investment.component';
import { ClLoanWitnessComponent } from './cl-loan-witness/cl-loan-witness.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClUploadDocumentComponent } from './cl-upload-document/cl-upload-document.component';
import { OrrListComponent } from './orr-list/orr-list.component';
import { SaveOrrComponent } from './save-orr/save-orr.component';
import { LoanRecoveryModule } from '../loan-recovery/loan-recovery.module';
import { ClSearchLoanComponent } from './cl-search-loan/cl-search-loan.component';
import { CalculateDbrComponent } from './calculate-dbr/calculate-dbr.component';
import { SearchDbrComponent } from './search-dbr/search-dbr.component';
import { ClDocumentViewComponent } from './cl-document-view/cl-document-view.component';
import { ReferbackLoanUtilizationComponent } from './referback-loan-utilization/referback-loan-uti.component';



@NgModule({
  declarations: [
    CreateLoanComponent, 
    ClApplicationHeaderComponent, 
    ClCustomersComponent, 
    ClPurposeComponent, 
    ClSecuritiesComponent, 
    ClLegalHeirsComponent, 
    ClGlSchemeCropConfigurationComponent, 
    ClAppraisalOfProposedInvestmentComponent, 
    ClLoanWitnessComponent, 
    ClUploadDocumentComponent, OrrListComponent, SaveOrrComponent, ClSearchLoanComponent, CalculateDbrComponent, SearchDbrComponent,
    CalculateDbrComponent,
    ClDocumentViewComponent,
    ReferbackLoanUtilizationComponent],
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild([
      {
        path: 'create',
        component: CreateLoanComponent
      },
      {
        path: 'create/:transactionID/:lcno',
        component: CreateLoanComponent
      },
      {
        path: 'orr-list',
        component: OrrListComponent
      },
      {
        path: 'save-orr',
        component: SaveOrrComponent
      },
   
      {
        path: 'search',
        component: ClSearchLoanComponent
      },
      {
        path: 'calculte-dbr',
        component: CalculateDbrComponent
      },
      {
        path: 'search-dbr',
        component: SearchDbrComponent
      },
      {
        path: 'referback-loan-uti',
        component: ReferbackLoanUtilizationComponent
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
    NgxPaginationModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    LoanRecoveryModule
  ],
  entryComponents: [
    ClGlSchemeCropConfigurationComponent,
    ClDocumentViewComponent
  ]
})
export class LoanModule { }
