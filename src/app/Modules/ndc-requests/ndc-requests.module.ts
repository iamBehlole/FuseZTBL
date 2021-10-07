import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule} from '@agm/core';
import {HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../core/_base/crud';

// Material
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {PartialsModule} from '../../partials/partials.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SearchNdcListComponent} from './search-ndc-list/search-ndc-list.component';
import {PortletModule} from '../../partials/content/general/portlet/portlet.module';
import {MatButtonModule} from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";


const routes: Routes = [
  {
    path: '',
    component: SearchNdcListComponent,
  },
  {
    path: 'search-ndc-list',
    component: SearchNdcListComponent,
  }
];

@NgModule({
  declarations: [
    SearchNdcListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    PortletModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3SrcUt_3iPERnX-hk46YYsKJiCTzJ5z0',
      libraries: ['places', 'drawing', 'geometry'],
    }),
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
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
  entryComponents: []


})
export class NdcRequestsModule {
}
