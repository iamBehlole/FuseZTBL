import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {MatMenuModule} from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';


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
