// Angular
import {Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ElementRef, ViewChild, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
// RxJS
import {BehaviorSubject, Observable, of, Subscription, from} from 'rxjs';
// NGRX
import {Store, select} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {AppState} from '../../../../../core/reducers';
// Layout
import {SubheaderService, LayoutConfigService, KtDialogService} from '../../../../../core/_base/layout';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';

// Services and Models
import {
  User,
  UserUpdated,
  Address,
  SocialNetworks,
  selectHasUsersInStore,
  selectUserById,
  UserOnServerCreated,
  selectLastCreatedUserId,
  selectUsersActionLoading
} from '../../../../../core/auth';
import {UserService} from '../../../../../core/auth/_services/user.service';
import {CircleService} from '../../../../../core/auth/_services/circle.service';
import {finalize} from 'rxjs/operators';
import {ProfileService} from '../../../../../core/auth/_services/profile.service';
import {Profile} from '../../../../../core/auth/_models/profile.model';
//import { UserUtilsService } from '../../../../../core/_base/crud/utils/user.utils.service';
import {CircleModel} from '../../../../../core/configuration-management/_models/circle.model';
import {RegionModel} from '../../../../../core/configuration-management/_models/region.model';

import {Circle} from '../../../../../core/auth/_models/circle.model';
import {Branch} from '../../../../../core/auth/_models/branch.model';
//import { BeltModel } from '../../../../../core/configuration-management/_models/belt.model';
//import { FranchiseModel } from '../../../../../core/configuration-management/_models/franchise.model';
//import { AuditTrailService } from '../../../../../core/audit-trail-management/_services/audit-trail.service';
//import { PagesEnum } from '../../../../../core/_base/enums/pages.enum';
//import { AE } from '../../../../../core/_base/enums/audit.enum';
import {MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Userpassworddetails} from '../../../../../core/auth/_models/userpassworddetails.model';
import {UserCircleMapping} from '../../../../../core/auth/_models/user-circle-mapping.model';
import {ActivityFormDialogComponent} from '../../activity/activity-edit/activity-form.dialog.component';
import {BaseRequestModel} from '../../../../../core/_base/crud/models/_base.request.model';

interface Permission {
  id: number;
  name: string;
}

@Component({
  selector: 'kt-user-create',
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit {


  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns = ['select', 'profileName', 'active', 'description'];
  // Public properties
  user: User = new User();
  circle: Circle = new Circle();
  branch: Branch = new Branch();
  userCirlcemappings: UserCircleMapping[];
  request: BaseRequestModel = new BaseRequestModel();

  userPasswordDetails: Userpassworddetails = new Userpassworddetails();
  loading: boolean;
  userStatus: boolean;
  oldUser: User;
  submitted = false;
  viewLoading = false;
  selectedTab = 0;
  loading$: Observable<boolean>;
  rolesSubject = new BehaviorSubject<number[]>([]);
  userForm: FormGroup;
  hasFormErrors = false;
  //regions: any[];
  userTypes: any[];
  channels: any[];
  zones: any[];
  branches: any[];
  circleId: string[] = [];
  circles: any[];
  employees: any[];
  profiles: Profile[];
  selection: number;
  isProfileSelected: boolean;
  userId: string;
  currentChannel: number = 0;
  profilesSuccess: Profile[];
  gridHeight: string;

  permissions: Permission[] = [
    {id: 0, name: 'Create User'},
    {id: 1, name: 'Edit User'}
  ];
  public LOVs: any;

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _profileService: ProfileService,
    private userFB: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    //private _userUtilsService: UserUtilsService,
    private _userService: UserService,
    private ktDialogService: KtDialogService,
    private _circleService: CircleService,
    private _cdf: ChangeDetectorRef,
    private store: Store<AppState>,
    private layoutConfigService: LayoutConfigService) {
  }


  ngOnInit() {

    this.getRoleGroups();
    this.userForm = this.userFB.group({
      UserId: new FormControl(null, Validators.required),
      Email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)
      ])
      ],
      Password: new FormControl(null, Validators.required),
      PhoneNumber: new FormControl(null, Validators.required),
      ProfileId: new FormControl(null, Validators.required),

    });

  }

  private getRoleGroups() {
    this._profileService
      .getRoleGroups()
      .pipe(finalize(() => {
        // this.spinner.hide();
      }))
      .subscribe((baseResponse) => {
          if (baseResponse.Success) {

            this.LOVs = baseResponse.LOVs;
          }
        }
      );
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 300 + 'px';
  }

  onAlertClose($event: boolean) {
    this.hasFormErrors = false;

  }

  close(result: any): void {
    this.dialogRef.close(result);
  }

  onSubmit() {

    this.userForm.value.ProfileId=parseInt(this.userForm.value.ProfileId);
    this._userService.createUser(this.userForm.value,this.userForm.value.ProfileId).subscribe(baseResponse => {

      if (baseResponse.Success) {
        this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
        this.close(this.user);
        this._cdf.detectChanges();
      } else {
        this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
        this._cdf.detectChanges();
      }
    });
    ;
  }
}
