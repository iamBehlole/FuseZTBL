import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckEligibilityComponent } from './check-eligibility/check-eligibility.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatTableModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule, MatListModule, MatButtonModule, MatChipsModule } from '@angular/material';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';
import { AlphabetOnlyDirective } from '../../partials/_directives/alphabet-only.directive';
import { NumberOnlyDirective } from '../../partials/_directives/number-only.directive';
import { AlphaNumericFieldDirective } from '../../partials/_directives/alpha-numeric-field.directive';
import { CapsOnlyDirective } from '../../partials/_directives/caps-only.directive';
import { AuthorizedCustomersComponent } from './authorized-customers/authorized-customers.component';
import { PendingCustomersComponent } from './pending-customers/pending-customers.component';
import { SubmitCustomersComponent } from './submit-customers/submit-customers.component';
import { ReferbackCustomersComponent } from './referback-customers/referback-customers.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CorrectionPassbookComponent } from './correction-passbook/correction-passbook.component';
import { CorrectionPhoneComponent } from './correction-phone/correction-phone.component';

@NgModule({
  declarations: [CheckEligibilityComponent, CustomerProfileComponent, CustomerListComponent, AuthorizedCustomersComponent, PendingCustomersComponent, SubmitCustomersComponent, ReferbackCustomersComponent, CorrectionPassbookComponent, CorrectionPhoneComponent],
  exports: [CustomerListComponent],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      //{
      //  path: 'customer-Profile',
      //  component: CustomerProfileComponent

      //},
      {
        path: 'customerProfile',
        component: CustomerProfileComponent

      },
      {
        path: 'authorized-customers',
        component: AuthorizedCustomersComponent

      },
      {
        path: 'pending-customers',
        component: PendingCustomersComponent

      },
      {
        path: 'submit-customers',
        component: SubmitCustomersComponent

      },
      {
        path: 'referback-customers',
        component: ReferbackCustomersComponent

      },
      {
        path: 'check-eligibility',
        component: CheckEligibilityComponent
      },
      {
        path: 'search-customer',
        component: CustomerListComponent

      },
      {
        path: 'correction-passbook',
        component: CorrectionPassbookComponent

      },
      {
        path: 'correction-phonecell',
        component: CorrectionPhoneComponent

      }
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
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule 
  ],

})
export class CustomerModule { }
