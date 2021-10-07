// Angular
import {Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
// RxJS
import {BehaviorSubject, Observable} from 'rxjs';
// NGRX
import {Store} from '@ngrx/store';

// Layout

// Services and Models

import {finalize} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {BaseRequestModel} from '../../../../core/_base/crud/models/_base.request.model';
import {KtDialogService, LayoutConfigService, SubheaderService} from '../../../../core/_base/layout';
import {UserService} from '../../../../core/auth/_services/user.service';
import {Userpassworddetails} from '../../../../core/auth/_models/userpassworddetails.model';
import {UserCircleMapping} from '../../../../core/auth/_models/user-circle-mapping.model';
import {ProfileService} from '../../../../core/auth/_services/profile.service';
import {LayoutUtilsService} from '../../../../core/_base/crud';
import {Branch} from '../../../../core/auth/_models/branch.model';
import {AppState} from '../../../../core/reducers';
import {Address, SocialNetworks, User} from '../../../../core/auth';
import {Circle} from '../../../../core/auth/_models/circle.model';
import {MatSort} from '@angular/material/sort';
import {Profile} from '../../../../core/auth/_models/profile.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CircleService} from '../../../../core/auth/_services/circle.service';


interface Permission {
    id: number;
    name: string;
}

@Component({
    selector: 'kt-user-edit',
    templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {


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
    addressSubject = new BehaviorSubject<Address>(new Address());
    soicialNetworksSubject = new BehaviorSubject<SocialNetworks>(new SocialNetworks());
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

    constructor(
        public dialogRef: MatDialogRef<UserEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
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
        debugger;

        this.user = this.data.user;

        this.userStatus = this.data.user.Active;

        this.userForm = this.userFB.group({
            UserId: new FormControl({value: '', disabled: true,}),
            UserName: new FormControl({value: '', disabled: true}),
            Email: [this.user.Email, Validators.compose([
                Validators.required,
                Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320)
            ])
            ],
            PhoneNumber: [this.user.PhoneNumber],
            AllowBioMatric: [this.user.AllowBioMatric]
        });


        this.userForm.controls['UserId'].setValue(this.user.UserId);
        this.userForm.controls['UserName'].setValue(this.user.UserName);
        this.userForm.controls['PhoneNumber'].setValue(this.user.PhoneNumber);
        this.userForm.controls['Email'].setValue(this.user.Email);

    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 300 + 'px';
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.userForm.controls[controlName].hasError(errorName);
    }


    get f(): any {
        return this.userForm.controls;
    }


    changeCheckbox(value: boolean) {
        debugger;
        if (!this.f.AllowBioMatric.value) {

            this.userForm.controls['AllowBioMatric'].setValue(this.f.AllowBioMatric.value ? 1 : 0);

        }
    }


    getUser() {
        debugger;

        this.userId = this.activatedRoute.snapshot.params['id'];

        if (this.userId != undefined) {
            this.user.Id = parseInt(this.userId);
        }

        if (this.user.UserId != undefined) {

            if (this.loading == false) {
                this.loading = true;
            }
            if (!this.ktDialogService.checkIsShown()) {
                this.ktDialogService.show();
            }

            this._userService.getUserById(this.user)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                        this.ktDialogService.hide();
                    })
                )
                .subscribe(baseResponse => {

                    debugger;
                    if (baseResponse.Success) {
                        this.user = baseResponse.User;

                        this.userCirlcemappings = baseResponse.UserCircleMappings;

                        this.userCirlcemappings.forEach((o, i) => {
                            var test = o.CircleId;
                            this.circleId.push(test);
                        });

                        //this.userForm.controls['UserType'].setValue(this.user.UserType);
                        //this.userForm.controls['UserType'].setValue(this.user.UserType);
                        //this.userForm.controls['UserName'].setValue(this.user.UserName);
                        //this.userForm.controls['DisplayName'].setValue(this.user.DisplayName);
                        //this.userForm.controls['ChannelID'].setValue(this.user.ChannelID);
                        //this.userForm.controls['ZoneId'].setValue(this.user.ZoneId);
                        //this.userForm.controls['BranchCode'].setValue(this.user.BranchCode);
                        this.userForm.controls['CircleId'].setValue(this.circleId);
                        this.userForm.controls['EmployeeId'].setValue(this.user.UserName);
                        this.userForm.controls['PhoneNumber'].setValue(this.user.PhoneNumber);
                        this.userForm.controls['AllowBioMatric'].setValue(this.user.AllowBioMatric);
                        this.getComponentTitle();

                        //this.profiles.forEach((o, i) => {
                        //  if (o.ProfileID == this.user.ProfileID)
                        //    o.isSelected = true;
                        //});

                        //if (this.user.ZoneId != null) {
                        //  this.getBranches(this.user.ZoneId);
                        //}
                        //if (this.user.BranchCode != null) {
                        //  this.getCircles(this.user.BranchCode);
                        //}
                        this._cdf.detectChanges();
                    } else {
                        this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                    }

                });
        } else {
            this.getComponentTitle();
        }
    }

    initUser() {

        if (!this.user.UserId) {
            this.subheaderService.setTitle('Create user');
            this.subheaderService.setBreadcrumbs([
                {title: 'User Management', page: `user-management`},
                {title: 'Users', page: `user-management/users`},
                {title: 'Create user', page: `user-management/users/add`}
            ]);
            return;
        }
        this.subheaderService.setTitle('Edit user');
        this.subheaderService.setBreadcrumbs([
            {title: 'User Management', page: `user-management`},
            {title: 'Users', page: `user-management/users`},
            {title: 'Edit user', page: `user-management/users/edit`, queryParams: {id: this.user.UserId}}
        ]);
    }


    //changeEmployee(value: any) {
    //  debugger[+][9][2](\d{10})
    //  var employee = this.employees.filter(x => x.PPNumber == value)[0];
    //  this.userForm.controls["UserName"].setValue(employee.PPNumber);
    //  this.userForm.controls["DisplayName"].setValue(employee.EmployeeName);
    //}


    //keyPress(event: any) {
    //  const pattern = /^((\\+92?)|0)?[0-9]{10}$/;

    //  let inputChar = String.fromCharCode(event.charCode);
    //  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    //    event.preventDefault();
    //  }
    //}

    //changeProfile(profileID: number) {
    //  debugger;
    //  this.profiles.forEach((o, i) => {
    //    if (o.ProfileID == profileID)
    //      o.isSelected = true;
    //    else
    //      o.isSelected = false;
    //  });
    //  this.isProfileSelected = true;
    //}


    goBackWithId() {
        const url = `user-management/users`;
        // @ts-ignore
        this.router.navigate(url);
    }


    onSubmit(withBack: boolean = false) {


        debugger;
        //this.user.ProfileID = 0;

        this.hasFormErrors = false;
        const controls = this.userForm.controls;

        if (this.userForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            this.selectedTab = 0;
            return;
        }


        this.user = Object.assign(this.user, this.userForm.getRawValue());


        let AllowBioMatric = this.userForm.controls['AllowBioMatric'].value;
        AllowBioMatric == true ? 1 : 0;
        this.user.AllowBioMatric = AllowBioMatric;


        this.loading = true;

        this._userService.updateUser(this.user)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.ktDialogService.hide();
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.close(this.user);
                    this._cdf.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                    this._cdf.detectChanges();
                }
            });

    }

    unBlockUser(user: User) {

        const _title = 'User Unblock';
        const _description = 'Are you sure you want to unblock ?';
        const _waitDesciption = 'User is Unblocking...';
        const _UnblockMessage = `User has been Unblocked`;
        var bit = 1;
        const dialogRef = this.layoutUtilsService.AlertElementWarn(_title, _description, _waitDesciption, bit);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }


            this.user.Remarks = res.data;

            debugger;
            this._userService.unBlockUser(this.user).pipe(
                finalize(() => {

                })
            ).subscribe(baseResponse => {
                debugger;
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.close(this.user);
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });


        });
    }


    blockUser() {

        const _title = 'User block';
        const _description = 'Are you sure you want to block ?';
        const _waitDesciption = 'User is blocking...';
        const _UnblockMessage = `User has been blocked`;
        var bit = 0;
        const dialogRef = this.layoutUtilsService.AlertElementWarn(_title, _description, _waitDesciption, bit);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }


            this.user.Remarks = res.data;


            debugger;
            this.loading = true;

            this.user.UserName = this.data.user.UserName;
            this.request.UserInfo = this.user;
            //this.request.Notification = this.data.Notification;
            this._userService.blockUser(this.request)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                ).subscribe(baseResponse => {
                debugger;
                if (baseResponse.Success === true) {
                    const message = `User has been blocked successfully.`;
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.close(this.user);
                } else {
                    const message = `An error occure.`;
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
        });
    }


    close(result: any): void {
        this.dialogRef.close(result);
    }


    getComponentTitle() {
        let result = 'Create User';
        if (!this.user || !this.user.UserId) {
            return result;
        }

        result = 'Edit User';
        return result;
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    changeUserType() {
        debugger;
        if (this.userForm.controls.userTypeId.value != 3 && this.userForm.controls.userTypeId.value != 9) {
            this.userForm.controls.vendorId.setValue(0);
            this.userForm.controls.labID.setValue(0);
        } else {
            if (this.userForm.controls.vendorId.value == 0) {
                this.userForm.controls.vendorId.setValue(undefined);
            }
            if (this.userForm.controls.labID.value == 0) {
                this.userForm.controls.labID.setValue(undefined);
            }
        }

    }

}
