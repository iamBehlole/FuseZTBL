// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AgmCoreModule } from '@agm/core';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent, AlertDialogComponent } from '../../partials/content/crud';
// Components
import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserRolesListComponent } from './users/_subs/user-roles/user-roles-list.component';
import { ChangePasswordComponent } from './users/_subs/change-password/change-password.component';
import { AddressComponent } from './users/_subs/address/address.component';
import { SocialNetworksComponent } from './users/_subs/social-networks/social-networks.component';

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
	MatTooltipModule,
    MatListModule,
  MatChipsModule,

} from '@angular/material';
import {
	usersReducer,
	UserEffects
} from '../../../core/auth';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityFormDialogComponent } from './activity/activity-edit/activity-form.dialog.component';
import { ProfileListComponent } from './profiles/profile-list/profile-list.component';
import { ProfileFormDialogComponent } from './profiles/profile-edit/profile-form.dialog.component';
import { GeofencingEditComponent } from './users/geofencing-edit/geofencing-edit.component';
import { CircleListComponent } from './users/circle-list/circle-list.component';
import { CircleViewMapComponent } from './users/circle-view-map/circle-view-map.component';
import { ConfirmDialogComponent } from './users/geofencing-edit/confirm-dialog/confirm-dialog.component';
import { request } from 'https';
import { PdfTextComponent } from './users/pdf-text/pdf-text.component';
import { RoleEditComponent } from './profiles/role-edit/role-edit.component';
import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';
import { AssignPageEditDialogComponent } from './assign-pages/assign-pages-edit/assign-pages-edit.dialog.component';
import { AssignPageListComponent } from './assign-pages/assign-pages-list/assign-pages-list.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import {IconPickerModule} from 'ngx-icon-picker';
import {CreateUserComponent} from './users/create-user/create-user.component';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'roles',
				component: RolesListComponent
			},
			{
				path: 'users',
				component: UsersListComponent
			},
			{
				path: 'circles',
				component: CircleListComponent
			},
			{
				path: 'viewCirclesfence',
				component: CircleViewMapComponent
			},
			{
				path: 'geofencingedit/:id',
				component: GeofencingEditComponent
			},
			{
				path: 'users:id',
				component: UsersListComponent
			},
			{
				path: 'users/add',
				component: UserEditComponent
			},
			{
				path: 'users/add:id',
				component: UserEditComponent
			},
			{
				path: 'users/edit',
				component: UserEditComponent
			},
			{
				path: 'users/edit/:id',
				component: UserEditComponent
			},
			{
				path: 'pages',
				component: ActivityListComponent
			},
			{
				path: 'assign-pages',
				component: ProfileFormDialogComponent
			},



      {
        path: 'pdftext',
        component: PdfTextComponent
      },


		]
	}
];

@NgModule({
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
      libraries: ['places', 'drawing', 'geometry'],
    }),
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
    IconPickerModule,

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
		ActionNotificationComponent,
		// AssignPageEditDialogComponent,
		ActivityFormDialogComponent,
    //ProfileFormDialogComponent,
    GeofencingEditComponent,
    ConfirmDialogComponent,
    RoleEditDialogComponent,
    CreateUserComponent,
	RoleEditComponent
	],
	declarations: [
    CreateUserComponent,
		UserManagementComponent,
		UsersListComponent,
		UserEditComponent,
		AssignPageListComponent,
		AssignPageEditDialogComponent,
		RolesListComponent,
		RoleEditDialogComponent,
		UserRolesListComponent,
		ChangePasswordComponent,
		AddressComponent,
		SocialNetworksComponent,
		ActivityListComponent,
		ActivityFormDialogComponent,
		ProfileListComponent,
		ProfileFormDialogComponent,
		GeofencingEditComponent,
		ConfirmDialogComponent,
    CircleListComponent,
    CircleViewMapComponent,
    PdfTextComponent,
    RoleEditComponent
	]
})
export class UserManagementModule {}
