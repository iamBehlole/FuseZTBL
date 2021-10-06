import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule, MatTreeModule } from '@angular/material';
import { SetTargetComponent } from "./set-target/set-target.component";
import { PartialsModule } from "../../partials/partials.module";
import { CoreModule } from "../../../core/core.module";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewFileComponent } from "./view-file/view-file.component";
import { TourDiaryComponent } from './tour-diary-mco/tour-diary.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureDialogDiaryComponent } from './signature-dialog-diary/signature-dialog-diary.component';
import { TourDiaryZmComponent } from './tour-diary-zm/tour-diary-zm.component';
import { TourDiaryZcComponent } from './tour-diary-zc/tour-diary-zc.component';

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
        path: "set-target",
        component: SetTargetComponent,
      },
      {
        path: "create-tour-diary",
        component: TourDiaryComponent,
      },
      {
        path: "create-tour-diary-zm",
        component: TourDiaryZmComponent,
      },
      {
        path: "create-tour-diary-zc",
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
