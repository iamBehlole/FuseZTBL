import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, MatTreeModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JvFormComponent } from './jv-form/jv-form.component';
import { SearchJvComponent } from './search-jv/search-jv.component';
import { LoanRecoveryModule } from '../loan-recovery/loan-recovery.module';
import { JvMasterCodeDialogComponent } from './jv-form/jv-master-code-dialog/jv-master-code-dialog.component';
import { JvOrganizationalStructureComponent } from './jv-form/jv-organizational-structure/jv-organizational-structure.component';
import { SearchJvRbComponent } from './search-jv/search-jv-rb/search-jv-rb.component';
import { SearchJvPendingComponent } from './search-jv/search-jv-pending/search-jv-pending.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [JvFormComponent, SearchJvComponent, JvMasterCodeDialogComponent, JvOrganizationalStructureComponent, SearchJvRbComponent, SearchJvPendingComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'form',
        component: JvFormComponent
      },
      {
        path: 'form/:upFlag',
        component: JvFormComponent

      },
      {
        path: 'search-jv',
        component: SearchJvComponent
      },
      {
        path: 'search-refer-back',
        component: SearchJvRbComponent
      },
      {
        path: 'search-pending',
        component: SearchJvPendingComponent
      }     
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
    MatTreeModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    LoanRecoveryModule,
    NgxPaginationModule
  ],
  entryComponents: [
    JvMasterCodeDialogComponent,
    JvOrganizationalStructureComponent
  ]
})
export class JournalVoucherModule { }
