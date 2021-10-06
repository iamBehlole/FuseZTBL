import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatTableDataSource, MatDialog } from '@angular/material';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { KtDialogService } from '../../../../core/_base/layout';
import { Store } from '@ngrx/store';
import { Lov, LovConfigurationKey, LovData, MaskEnum, regExps, errorMessages, DateFormats } from '../../../../core/auth/_models/lov.class';
import { LovService } from '../../../../core/auth/_services/lov.service';
import { UserUtilsService } from '../../../../core/_base/crud/utils/user-utils.service';
import { Subject, ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService } from '../../../../core/auth/_services/common.service';
import { AppState } from '../../../../core/reducers';
import { BaseResponseModel } from '../../../../core/_base/crud/models/_base.response.model';
import { CreateCustomer } from '../../../../core/auth/_models/customer.model';
import { LandService } from '../../../../core/auth/_services/land.service';
import { LandInfo } from '../../../../core/auth/_models/land-info.model';
import { LandInfoDetails } from '../../../../core/auth/_models/land-info-details.model';
import { CustomerLandRelation } from '../../../../core/auth/_models/customer-land-relation.model';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../../../../core/auth/_services/customer.service';
import { AccountDetailModel, MasterCodes, RecoveryDataModel, SubProposalGLModel, DisbursementGLModel, RecoveryLoanTransaction, RecoveryTypes } from '../../../../core/auth/_models/recovery.model';
import { RecoveryService } from '../../../../core/auth/_services/recovery.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'kt-search-recovery-transaction',
  templateUrl: './search-recovery-transaction.component.html',
  styles:[]

})
export class SearchRecoveryTransactionComponent implements OnInit {
    ngOnInit(): void {
      
    }


 
}
