import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, MatTreeModule } from '@angular/material';
import { PartialsModule } from "../../partials/partials.module";
import { CoreModule } from "../../../core/core.module";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewFileComponent } from "./view-file/view-file.component";
import { SignaturePadModule } from 'angular2-signaturepad';
import { SearchTourPlanComponent } from "./search-tour-plan/search-tour-plan.component";
import { CreateTourPlanComponent } from "./tour-plan/create-tour-plan.component";

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
        path: "create-tour-plan",
        component: CreateTourPlanComponent,
      },
      // {
      //   path: "referback",
      //   component: ReferbackDeceasedComponent,
      // },
      {
        path: "search-tour-plan",
        component: SearchTourPlanComponent,
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
    SignaturePadModule,
  ],
  entryComponents: [
     ViewFileComponent,
  ]
})
export class TourPlanModule {}
