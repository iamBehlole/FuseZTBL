import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustLandInformationComponent } from './cust-land-information/cust-land-information.component';
import { AreaConvertorComponent } from './area-convertor/area-convertor.component';
import { LandChargeCreationComponent } from './land-charge-creation/land-charge-creation.component';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { CustLandListComponent } from './cust-land-list/cust-land-list.component';
import { LandFilesUploadComponent } from './land-files-upload/land-files-upload.component';
import { LandHistoryComponent } from './land-history/land-history.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CustomerModule } from '../customer/customer.module';
import { CustomerListDialogComponent } from './customer-list-dialog/customer-list-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [CustLandInformationComponent, AreaConvertorComponent, LandChargeCreationComponent, CustLandListComponent, LandFilesUploadComponent, LandHistoryComponent, CustomerListDialogComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'land-info-add',
        component: CustLandInformationComponent

      },
      {
        path: 'land-info-add/:upFlag',
        component: CustLandInformationComponent
      },
      {
        path: 'land-info-list',
        component: CustLandListComponent
      },
      {
        path: 'land-info-history/:lID',
        //path: 'land-info-history/:id/:id2',
        component: LandHistoryComponent
      }
    ]

    ),
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
    CustomerModule
  ],
  entryComponents: [
    LandChargeCreationComponent,
    AreaConvertorComponent,
    LandFilesUploadComponent,
    LandHistoryComponent,
    CustomerListDialogComponent
  ]
})
export class LandCreationModule { }
