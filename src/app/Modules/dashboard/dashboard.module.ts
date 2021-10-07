// Angular
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
// Core Module
import {PartialsModule} from '../../partials/partials.module';
import {DashboardComponent} from './dashboard.component';
import {CoreModule} from '../../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        PartialsModule,
        CoreModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            },
        ]),
    ],
    providers: [],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
