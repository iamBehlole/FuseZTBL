import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import {ViewFileComponent} from './view-file/view-file.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import {NgModule} from '@angular/core';
import {CreateTourPlanComponent} from './tour-plan/create-tour-plan.component';
import {SearchTourPlanComponent} from './search-tour-plan/search-tour-plan.component';
import {PartialsModule} from '../../partials/partials.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatTreeModule} from '@angular/material/tree';
import {MatCardModule} from '@angular/material/card/card-module';


@NgModule({
  declarations: [
    ViewFileComponent,
    CreateTourPlanComponent,
    SearchTourPlanComponent,
    //  SearchDeceasedComponent, ReferbackDeceasedComponent ,ImageViewerComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'create-tour-plan',
        component: CreateTourPlanComponent,
      },
      // {
      //   path: "referback",
      //   component: ReferbackDeceasedComponent,
      // },
      {
        path: 'search-tour-plan',
        component: SearchTourPlanComponent,
      },
      
    ]),
    FormsModule, 
    ReactiveFormsModule,
    MatMenuModule, 
    MatTableModule,
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
  ]
})
export class TourPlanModule {}
