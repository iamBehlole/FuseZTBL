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
import { MakeRescheduleComponent } from './make-rc/make-reschedule.component';
import { LoanRecoveryModule } from '../loan-recovery/loan-recovery.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PendingRescheduleCasesComponent } from './pending-reschedule-cases/pending-reschedule-cases.component';
import { ReferBackRescheduleCasesComponent } from './refer-back-reschedule-cases/refer-back-reschedule-cases.component';
import { SearchRcComponent } from './search-rc/search-rc.component';
import { RequestForRlComponent } from './request-for-rl/request-for-rl.component';
import { NewGlCodeComponent } from './make-rc/new-gl-code/new-gl-code.component';


@NgModule({
  declarations: [MakeRescheduleComponent, PendingRescheduleCasesComponent, ReferBackRescheduleCasesComponent, SearchRcComponent, RequestForRlComponent,NewGlCodeComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'make-reschedule',
        component: MakeRescheduleComponent
      },
      {
        path: 'pending-reschedule',
        component: PendingRescheduleCasesComponent
      },
      {
        path: 'refer-back-reschedule',
        component: ReferBackRescheduleCasesComponent
      },
      {
        path: 'search-reschedule',
        component: SearchRcComponent
      },
      {
        path: 'request-reschedule-loan',
        component: RequestForRlComponent
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
    NewGlCodeComponent
  ]
})
export class RescheduleCasesModule { }
