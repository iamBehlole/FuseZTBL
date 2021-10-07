import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BorrowerInformationComponent } from './borrower-information/borrower-information.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule } from '@angular/material/select';
import {MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card/card-module';
import {MatSortModule} from '@angular/material/sort';
import {NgxMaskModule} from 'ngx-mask';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {CoreModule} from '@angular/flex-layout';


@NgModule({
  declarations: [BorrowerInformationComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: BorrowerInformationComponent
      },
           
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
    NgxPaginationModule
  ],
  entryComponents: [
  ]
})
export class BorrowerInformationModule { }
