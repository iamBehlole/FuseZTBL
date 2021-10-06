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
import { AddNewVendorComponent } from './add-new-vendor/add-new-vendor.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { AddressLocationComponent } from './add-new-vendor/address-location/address-location.component';

//Map Module
import { AgmCoreModule } from '@agm/core';
import { VendorRadiusComponent } from './vendor-radius/vendor-radius.component';
import { UserInfoDialogComponent } from './vendor-radius/user-info-dialog/user-info-dialog.component';


@NgModule({
  declarations: [AddNewVendorComponent, VendorListComponent, AddressLocationComponent, VendorRadiusComponent, UserInfoDialogComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'add-vendor',
        component: AddNewVendorComponent
      },
      {
        path: 'add-vendor/:upFlag',
        component: AddNewVendorComponent

      },
      {
        path: 'view-list',
        component: VendorListComponent
      },
      {
        path: 'vendor-radius',
        component: VendorRadiusComponent
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
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
      libraries: ['places', 'drawing', 'geometry'],
    }),
    
  ],
  entryComponents: [
    AddressLocationComponent,
    VendorListComponent,

    UserInfoDialogComponent
  ]
})
export class KhaadSeedVendorModule { }
