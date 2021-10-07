
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { TourDiaryComponent } from './tour-diary-mco/tour-diary.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureDialogDiaryComponent } from './signature-dialog-diary/signature-dialog-diary.component';
import { TourDiaryZmComponent } from './tour-diary-zm/tour-diary-zm.component';
import { TourDiaryZcComponent } from './tour-diary-zc/tour-diary-zc.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card/card-module';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatTreeModule} from '@angular/material/tree';
import {ViewFileComponent} from './view-file/view-file.component';
import {SetTargetComponent} from './set-target/set-target.component';
import {CommonModule} from '@angular/common';
import {PartialsModule} from '../../partials/partials.module';
import {CoreModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [SetTargetComponent,
    ViewFileComponent,
    TourDiaryComponent,
    SignatureDialogDiaryComponent,
    TourDiaryZmComponent,
    TourDiaryZcComponent,
    //  SearchDeceasedComponent, ReferbackDeceasedComponent ,ImageViewerComponent
  ],
    imports: [
        CommonModule,
        PartialsModule,
        CoreModule,
        RouterModule.forChild([
            {
                path: 'set-target',
                component: SetTargetComponent,
            },
            {
                path: 'create-tour-diary',
                component: TourDiaryComponent,
            },
            {
                path: 'create-tour-diary-zm',
                component: TourDiaryZmComponent,
            },
            {
                path: 'create-tour-diary-zc',
                component: TourDiaryZcComponent,
            },
            // {
            //   path: "referback",
            //   component: ReferbackDeceasedComponent,
            // },
            // {
            //   path: "search-tour-plan",
            //   component: SearchTourPlanComponent,
            // },

        ]),
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatTableModule,
        MatSelectModule,
        MatInputModule,
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
        MatListModule,
        MatButtonModule,
        MatChipsModule,
        MatTreeModule,
        NgxMatSelectSearchModule,
        NgxPaginationModule,
        NgxSpinnerModule,
        SignaturePadModule,
    ],
  entryComponents: [
     ViewFileComponent,
     SignatureDialogDiaryComponent
  ]
})
export class TourDiaryModule {}
