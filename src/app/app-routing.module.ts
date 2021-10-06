// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Auth
// import {AuthGuard} from './core/auth';
import {environment} from '../environments/environment.prod';
import {LoginComponent} from './Authentication/login/login.component';

const routes: Routes = [
    // {
    //     path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)
    // },
    // {
    //     // path: '',
    //     // component: BaseComponent,
    //     // canActivate: [AuthGuard],
    //     // runGuardsAndResolvers: 'always',
    //     // children: [
    //     //     {
    //     //         path: 'dashboard',
    //     //         loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
    //     //     },
    //     //     {
    //     //         path: 'user-management',
    //     //         loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
    //     //     },
    //     //     {
    //     //         path: 'configuration-management',
    //     //         loadChildren: () => import('./views/pages/configuration-management/configuration-management.module').then(m => m.ConfigurationManagementModule)
    //     //     },
    //     //     {
    //     //         path: 'report-management',
    //     //         loadChildren: () => import('./views/pages/report-management/report-management.module').then(m => m.ReportManagementModule)
    //     //     },
    //     //     {
    //     //         path: 'customer',
    //     //         loadChildren: () => import('./views/pages/customer/customer.module').then(m => m.CustomerModule)
    //     //     },
    //     //     {
    //     //         path: 'land-creation',
    //     //         loadChildren: () => import('./views/pages/land-creation/land-creation.module').then(m => m.LandCreationModule)
    //     //     },
    //     //     {
    //     //         path: 'loan-recovery',
    //     //         loadChildren: () => import('./views/pages/loan-recovery/loan-recovery.module').then(m => m.LoanRecoveryModule)
    //     //     },
    //     //     {
    //     //         path: 'loan',
    //     //         loadChildren: () => import('./views/pages/loan/loan.module').then(m => m.LoanModule)
    //     //     },
    //     //     {
    //     //         path: 'deceased-customer',
    //     //         loadChildren: () => import('./views/pages/deceased-customer/deceased-customer.module').then(m => m.DeceasedCustomerModule)
    //     //     },
    //     //     //sam
    //     //     {
    //     //         path: 'tour-diary',
    //     //         loadChildren: () => import('./views/pages/tour-diary/tour-diary.module').then(m => m.TourDiaryModule)
    //     //     },
    //     //     {
    //     //         path: 'journal-voucher',
    //     //         loadChildren: () => import('./views/pages/journal-voucher/journal-voucher.module').then(m => m.JournalVoucherModule)
    //     //     },
    //     //     {
    //     //         path: 'reschedule-cases',
    //     //         loadChildren: () => import('./views/pages/reschedule-cases/reschedule-cases.module').then(m => m.RescheduleCasesModule)
    //     //     },
    //     //     {
    //     //         path: 'khaad-seed-vendor',
    //     //         loadChildren: () => import('./views/pages/khaad-seed-vendor/khaad-seed-vendor.module').then(m => m.KhaadSeedVendorModule)
    //     //     },
    //     //     //sam
    //     //     {
    //     //         path: 'loan-utilization',
    //     //         loadChildren: () => import('./views/pages/loan-utilization/loan-utilization.module').then(m => m.LoanUtilizationModule)
    //     //     },
    //     //     {
    //     //         path: 'ndc-requests',
    //     //         loadChildren: () => import('./views/pages/ndc-requests/ndc-requests.module').then(m => m.NdcRequestsModule)
    //     //     },
    //     //     {
    //     //         path: 'borrower-information',
    //     //         loadChildren: () => import('./views/pages/borrower-information/borrower-information.module').then(m => m.BorrowerInformationModule)
    //     //     },
    //     //     {
    //     //         path: 'village-wise-bench-marking',
    //     //         loadChildren: () => import('./views/pages/village-wise-bench-marking/village-wise-bench-marking.module').then(m => m.VillageWiseBenchMarkingModule)
    //     //     },
    //     //     {
    //     //         path: 'error/403',
    //     //         component: ErrorPageComponent,
    //     //         data: {
    //     //             type: 'error-v6',
    //     //             code: 403,
    //     //             title: '403... Access forbidden',
    //     //             desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
    //     //         }
    //     //     },
    //     //     {path: 'error/:type', component: ErrorPageComponent},
    //     //     {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    //     //     {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    //     // ]
    // },

    // {path: '**', redirectTo: 'error/403', pathMatch: 'full'},
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
