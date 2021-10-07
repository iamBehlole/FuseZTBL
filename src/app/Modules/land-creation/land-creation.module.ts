import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustLandInformationComponent } from './cust-land-information/cust-land-information.component';
import { AreaConvertorComponent } from './area-convertor/area-convertor.component';
import { LandChargeCreationComponent } from './land-charge-creation/land-charge-creation.component';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { CustLandListComponent } from './cust-land-list/cust-land-list.component';
import { LandFilesUploadComponent } from './land-files-upload/land-files-upload.component';
import { LandHistoryComponent } from './land-history/land-history.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CustomerModule } from '../customer/customer.module';
import { CustomerListDialogComponent } from './customer-list-dialog/customer-list-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CoreModule} from '@angular/flex-layout';



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
