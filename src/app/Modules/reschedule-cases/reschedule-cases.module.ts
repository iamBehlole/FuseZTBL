import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [MakeRescheduleComponent, PendingRescheduleCasesComponent, ReferBackRescheduleCasesComponent, SearchRcComponent, RequestForRlComponent, NewGlCodeComponent],
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
