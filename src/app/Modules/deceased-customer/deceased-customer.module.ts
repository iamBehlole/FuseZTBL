import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, MatTreeModule } from '@angular/material';
import { DeceasedCusComponent } from "./deceased-cus/deceased-cus.component";
import { SearchDeceasedComponent } from "./search-deceased/search-deceased.component";
import { ReferbackDeceasedComponent } from "./referback-deceased/referback-deceased.component";
import { PartialsModule } from "../../partials/partials.module";
import { CoreModule } from "../../../core/core.module";
import { ViewFileComponent } from './view-file/view-file.component';
import { ImageViewerComponent } from "./imageViewer/ImageViewerComponent";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';

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
