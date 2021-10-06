import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeoFencingRoutingModule } from './geo-fencing-routing.module';
import { GeoFencingListComponent } from './geoFencing/geo-fencing-list/geo-fencing-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, MatTreeModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoanRecoveryModule } from '../loan-recovery/loan-recovery.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { ViewGetFancingModalComponent } from './geoFencing/view-get-fancing-modal/view-get-fancing-modal.component';

@NgModule({
  declarations: [GeoFencingListComponent, ViewGetFancingModalComponent],
  imports: [
    CommonModule,
    GeoFencingRoutingModule,
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
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
      libraries: ['places', 'drawing', 'geometry'],
    }),
  ],
  entryComponents: [
    ViewGetFancingModalComponent
  ]
})
export class GeoFencingModule { }
