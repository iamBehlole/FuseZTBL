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
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ConfigurationManagementComponent } from './configuration-management.component';

// Components
import {
	usersReducer,
	UserEffects
} from '../../../core/auth';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import { DocumentTypeEditComponent } from './document-type-edit/document-type-edit.component';
import { DocumentTypeListComponent } from './document-type-list/document-type-list.component';
import { ConfigurationListComponent } from './configuration-management/configuration-list/configuration-list.component';
import { ConfigurationEditComponent } from './configuration-management/configuration-edit/configuration-edit.component';
import { ConfigurationHistoryComponent } from './configuration-management/configuration-history/configuration-history.component';
import { RefreshLovComponent } from './refresh-lov/refresh-lov.component';

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
