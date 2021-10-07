// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ConfigurationManagementComponent } from './configuration-management.component';

// Components

// Material
import { DocumentTypeEditComponent } from './document-type-edit/document-type-edit.component';
import { DocumentTypeListComponent } from './document-type-list/document-type-list.component';
import { ConfigurationListComponent } from './configuration-management/configuration-list/configuration-list.component';
import { ConfigurationEditComponent } from './configuration-management/configuration-edit/configuration-edit.component';
import { ConfigurationHistoryComponent } from './configuration-management/configuration-history/configuration-history.component';
import { RefreshLovComponent } from './refresh-lov/refresh-lov.component';
import {UserEffects, usersReducer} from '../../core/auth';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '../../core/_base/crud';

const routes: Routes = [
	{
		path: '',
		component: ConfigurationManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'configurations',
				pathMatch: 'full'
      },
      {
        path: 'configurations',
        component: ConfigurationListComponent
      },
      {
        path: 'document-types',
        component: DocumentTypeListComponent
      },
	  {
        path: 'refresh-lovs',
        component: RefreshLovComponent
      },
			
		]
	}
];

@NgModule({
	declarations: [
		ConfigurationManagementComponent,
		DocumentTypeEditComponent,
		DocumentTypeListComponent,
		ConfigurationListComponent,
		ConfigurationEditComponent,
		ConfigurationHistoryComponent,
		RefreshLovComponent
	],
  imports: [
	  CommonModule,
	  HttpClientModule,
	  PartialsModule,
	  RouterModule.forChild(routes),
	  StoreModule.forFeature('users', usersReducer),
	  EffectsModule.forFeature([UserEffects]),
	  FormsModule,
	  ReactiveFormsModule,
	  TranslateModule.forChild(),
	  MatButtonModule,
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
	  MatDialogModule
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [		
    DocumentTypeEditComponent,
    ConfigurationEditComponent,
	ConfigurationHistoryComponent	
]
})
export class ConfigurationManagementModule { }
