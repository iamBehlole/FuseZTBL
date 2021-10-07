import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeceasedCusComponent } from "./deceased-cus/deceased-cus.component";
import { SearchDeceasedComponent } from "./search-deceased/search-deceased.component";
import { ReferbackDeceasedComponent } from "./referback-deceased/referback-deceased.component";
import { PartialsModule } from "../../partials/partials.module";
import { ViewFileComponent } from './view-file/view-file.component';
import { ImageViewerComponent } from "./imageViewer/ImageViewerComponent";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import {CoreModule} from '@angular/flex-layout';
import {MatInputModule, } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import { MatRadioModule } from "@angular/material/radio";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import {MatTreeModule} from '@angular/material/tree';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [DeceasedCusComponent, SearchDeceasedComponent, ReferbackDeceasedComponent, ViewFileComponent,ImageViewerComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: "customers",
        component: DeceasedCusComponent,
      },
      {
        path: "customers/:upFlag",
        component: DeceasedCusComponent,
      },
      {
        path: "search",
        component: SearchDeceasedComponent,
      },
      {
        path: "referback",
        component: ReferbackDeceasedComponent,
      },
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
  ],
  entryComponents: [
    ViewFileComponent
  ]
})
export class DeceasedCustomerModule {}
