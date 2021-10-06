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
import { LoanRecoveryModule } from '../loan-recovery/loan-recovery.module';
import { NgxPaginationModule } from 'ngx-pagination';

//Map Module
import { AgmCoreModule } from '@agm/core';
import { AddUpdateBenchMarkingComponent } from './add-update-bench-marking/add-update-bench-marking.component';
import { GetVillageBenchMarkingComponent } from './get-village-bench-marking/get-village-bench-marking.component';


@NgModule({
  declarations: [AddUpdateBenchMarkingComponent, GetVillageBenchMarkingComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'add-update-bench-marking',
        component: AddUpdateBenchMarkingComponent
      },
      {
        path: 'get-village-bench-marking',
        component: GetVillageBenchMarkingComponent

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
  ]
})
export class VillageWiseBenchMarkingModule { }
