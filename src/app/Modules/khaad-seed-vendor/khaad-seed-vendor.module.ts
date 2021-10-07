import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PartialsModule} from '../../partials/partials.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxMaskModule} from 'ngx-mask';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LoanRecoveryModule} from '../loan-recovery/loan-recovery.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {AddNewVendorComponent} from './add-new-vendor/add-new-vendor.component';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {AddressLocationComponent} from './add-new-vendor/address-location/address-location.component';

//Map Module
import {AgmCoreModule} from '@agm/core';
import {VendorRadiusComponent} from './vendor-radius/vendor-radius.component';
import {UserInfoDialogComponent} from './vendor-radius/user-info-dialog/user-info-dialog.component';
import {CoreModule} from 'app/core/core.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatTreeModule} from '@angular/material/tree';


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
export class KhaadSeedVendorModule {
}
