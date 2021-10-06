import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeoFencingListComponent } from './geoFencing/geo-fencing-list/geo-fencing-list.component';


const routes: Routes = [
  {
    path: '',
    component: GeoFencingListComponent
  },

  {
    path: 'geo-fencing-list',
    component: GeoFencingListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class GeoFencingRoutingModule { }
