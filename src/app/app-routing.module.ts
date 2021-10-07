// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment.prod';
import {LoginComponent} from './Authentication/login/login.component';
import {AppComponent} from './app.component';

let routeUrl = './Modules';

const routes: Routes = [
    {
        path: 'auth', loadChildren: () => import(`./Modules/auth/auth.module`).then(m => m.AuthModule)
    },
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: '',
                component: LoginComponent
            },

            {
                path: 'dashboard',
                loadChildren: () => import(`./Modules/dashboard/dashboard.module`).then(m => m.DashboardModule)
            },
            {
                path: 'user-management',
                loadChildren: () => import(`./Modules/user-management/user-management.module`).then(m => m.UserManagementModule)
            },
            {
                path: 'journal-voucher',
                loadChildren: () => import(`./Modules/journal-voucher/journal-voucher.module`).then(m => m.JournalVoucherModule)
            },
            {
                path: 'customer',
                loadChildren: () => import(`./Modules/customer/customer.module`).then(m => m.CustomerModule)
            },
            {
                path: 'reschedule-cases',
                loadChildren: () => import(`./Modules/reschedule-cases/reschedule-cases.module`).then(m => m.RescheduleCasesModule)
            },
            {
                path: 'khaad-seed-vendor',
                loadChildren: () => import(`./Modules/khaad-seed-vendor/khaad-seed-vendor.module`).then(m => m.KhaadSeedVendorModule)
            },
            {
                path: 'loan-utilization',
                loadChildren: () => import(`./Modules/loan-utilization/loan-utilization.module`).then(m => m.LoanUtilizationModule)
            },
            {
                path: 'ndc-requests',
                loadChildren: () => import(`./Modules/ndc-requests/ndc-requests.module`).then(m => m.NdcRequestsModule)
            },
            {
                path: 'loan-recovery',
                loadChildren: () => import(`./Modules/loan-recovery/loan-recovery.module`).then(m => m.LoanRecoveryModule)
            },
            {
                path: 'loan',
                loadChildren: () => import(`./Modules/loan/loan.module`).then(m => m.LoanModule)
            },
            {
                path: 'borrower-information',
                loadChildren: () => import(`./Modules/borrower-information/borrower-information.module`).then(m => m.BorrowerInformationModule)
            },
            {
                path: 'configuration-management',
                loadChildren: () => import(`./Modules/configuration-management/configuration-management.module`).then(m => m.ConfigurationManagementModule)
            },
            {
                path: 'geo-fencing',
                loadChildren: () => import(`./Modules/GeoFencing/geo-fencing.module`).then(m => m.GeoFencingModule)
            },
            {
                path: 'land-creation',
                loadChildren: () => import(`./Modules/land-creation/land-creation.module`).then(m => m.LandCreationModule)
            },
            {
                path: 'report-management',
                loadChildren: () => import(`./Modules/report-management/report-management.module`).then(m => m.ReportManagementModule)
            },
            {
                path: 'tour-diary',
                loadChildren: () => import(`./Modules/tour-diary/tour-diary.module`).then(m => m.TourDiaryModule)
            },
            {
                path: 'tour-plan',
                loadChildren: () => import(`./Modules/tour-plan/tour-plan.module`).then(m => m.TourPlanModule)
            },
            {
                path: 'village-wise-bench-marking',
                loadChildren: () => import(`./Modules/village-wise-bench-marking/village-wise-bench-marking.module`).then(m => m.VillageWiseBenchMarkingModule)
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
