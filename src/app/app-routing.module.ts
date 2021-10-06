// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment.prod';
import {LoginComponent} from './Authentication/login/login.component';
import { AppComponent } from './app.component';

let routeUrl = './Modules';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'dashboard',
        loadChildren: () => import(`${routeUrl}/dashboard/dashboard.module`).then(m => m.DashboardModule)
      },
      {
        path: 'user-management',
        loadChildren: () => import(`${routeUrl}/user-management/user-management.module`).then(m => m.UserManagementModule)
      },
      {
        path: 'journal-voucher',
        loadChildren: () => import(`${routeUrl}/journal-voucher/journal-voucher.module`).then(m => m.JournalVoucherModule)
      },
      {
        path: 'customer',
        loadChildren: () => import(`${routeUrl}/customer/customer.module`).then(m => m.CustomerModule)
      },
      {
        path: 'reschedule-cases',
        loadChildren: () => import(`${routeUrl}/reschedule-cases/reschedule-cases.module`).then(m => m.RescheduleCasesModule)
      },
      {
        path: 'khaad-seed-vendor',
        loadChildren: () => import(`${routeUrl}/khaad-seed-vendor/khaad-seed-vendor.module`).then(m => m.KhaadSeedVendorModule)
      },
      {
        path: 'loan-utilization',
        loadChildren: () => import(`${routeUrl}/loan-utilization/loan-utilization.module`).then(m => m.LoanUtilizationModule)
      },
      {
        path: 'ndc-requests',
        loadChildren: () => import(`${routeUrl}/ndc-requests/ndc-requests.module`).then(m => m.NdcRequestsModule)
      },
      {
        path: 'loan-recovery',
        loadChildren: () => import(`${routeUrl}/loan-recovery/loan-recovery.module`).then(m => m.LoanRecoveryModule)
      },
      {
        path: 'loan',
        loadChildren: () => import(`${routeUrl}/loan/loan.module`).then(m => m.LoanModule)
      },
      {
        path: 'borrower-information',
        loadChildren: () => import(`${routeUrl}/borrower-information/borrower-information.module`).then(m => m.BorrowerInformationModule)
      },
      {
        path: 'configuration-management',
        loadChildren: () => import(`${routeUrl}/configuration-management/configuration-management.module`).then(m => m.ConfigurationManagementModule)
      },
      {
        path: 'deceased-customer',
        loadChildren: () => import(`${routeUrl}/deceased-customer/deceased-customer.module`).then(m => m.ConfigurationManagementModule)
      },
      {
        path: 'geo-fencing',
        loadChildren: () => import(`${routeUrl}/GeoFencing/geo-fencing.module`).then(m => m.GeoFencingModule)
      },
      {
        path: 'land-creation',
        loadChildren: () => import(`${routeUrl}/land-creation/land-creation.module`).then(m => m.LandCreationModule)
      },
      {
        path: 'report-management',
        loadChildren: () => import(`${routeUrl}/report-management/report-management.module`).then(m => m.ReportManagementModule)
      },
      {
        path: 'report-management',
        loadChildren: () => import(`${routeUrl}/report-management/report-management.module`).then(m => m.ReportManagementModule)
      },
    ]
  }
];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
//   ],
//   exports: [RouterModule]


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
