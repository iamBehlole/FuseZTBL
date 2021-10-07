import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
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
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
