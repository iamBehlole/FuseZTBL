import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AddressLocationComponent} from './address-location/address-location.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {LovService} from '../../../core/auth/_services/lov.service';
import {Lov, LovConfigurationKey} from '../../../core/auth/_models/lov.class';
import {BaseResponseModel} from '../../../core/_base/crud/models/_base.response.model';
import {ActivatedRoute, Router} from '@angular/router';
import {KhaadSeedVendorModel, VendorDetail} from '../../../core/auth/_models/khaad-seed-vendor.model';
import {KhaadSeedVendorService} from '../../../core/auth/_services/khaad-seed-vendor.service';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {Branch} from '../../../core/auth/_models/branch.model';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';

// import { Zone } from "../../../../core/auth/_models/zone.model";
import {Zone} from '../../../core/auth/_models/zone.model';
import {MatDialog} from '@angular/material/dialog/dialog';


@Component({
    selector: 'kt-add-new-vendor',
    templateUrl: './add-new-vendor.component.html',
    styleUrls: ['./add-new-vendor.component.scss']
})
export class AddNewVendorComponent implements OnInit {
    //Objects
    vendorForm: FormGroup;
    VendorAttachedFile = [];
    vendorLov: any;
    images = [];
    ProfileImageSrc: string = './assets/media/logos/vendor.png';
    file: File;
    rawData: any = {};
    visible: any;
    vendorDetail: any;
    viewOnly: boolean = false;
    isEdit: boolean = false;
    isEditMode: any;
    addedVendor: any;
    vendorEditView: any;
    vendorInfo: any;
    vendorObj: any;

    selected_b;
    selected_z;
    LoggedInUserInfo: BaseResponseModel;

    lat;
    lng;

    user: any = {};

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Branch();

    loc_text = 'Choose Location';

    public LovCall = new Lov();
    public khaadSeedVendor = new KhaadSeedVendorModel();
    public vendor = new VendorDetail();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private _khaadSeedVendor: KhaadSeedVendorService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
    ) {
    }

    //Init Func

    ngOnInit() {
        debugger

        this.images.push(this.ProfileImageSrc);
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();


        var upFlag = this.activatedRoute.snapshot.params['upFlag'];

        this.isEditMode = localStorage.getItem('EditVendorData');

        if (this.isEditMode != null && this.isEditMode != '0') {
            this.vendorEditView = JSON.parse(localStorage.getItem('SearchVendorData'));
            debugger
            if (this.vendorEditView != null) {
                this.vendorObj = this.vendorEditView.obj;
                this.isEdit = true;
            }

            if (this.vendorObj != undefined && this.vendorObj != null) {
                this.viewOnly = true;
                this.isEdit = false;
            } else {
                this.viewOnly = false;
                this.isEdit = true;
            }

        }


        this.createForm();
        this.typeLov();

        if (this.LoggedInUserInfo.Branch.BranchCode != 'All') {
            this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedCircles = this.Circles;

            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zone = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zone;

            this.selected_z = this.SelectedZones.ZoneId;
            this.selected_b = this.SelectedBranches.BranchCode;
            console.log(this.SelectedZones);
            this.vendorForm.controls['ZoneId'].setValue(this.SelectedZones.ZoneName);
            this.vendorForm.controls['BranchCode'].setValue(this.SelectedBranches.Name);
        }
        //For Edit Mode
        if (upFlag == '1' && this.isEditMode == '1') {
            debugger
            localStorage.setItem('EditVendorData', '0');
            this.getVendorInfo();
        }

    }

    //Getting Lov's

    async typeLov() {
        debugger
        this.vendorLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.VendorTypes});
        this.vendorLov = this.vendorLov.LOVs;
        console.log(this.vendorLov);
    }

    getVendorInfo() {
        debugger
        this.user.ZoneId = this.vendorEditView.ZoneId;
        this.user.BranchCode = this.vendorEditView.BranchCode;
        this.user.CircleId = this.vendorEditView.CircleId;
        this.vendor.Id = this.vendorEditView.Id;

        var limit = 1, offset = 0;


        this.spinner.show();
        this._khaadSeedVendor.searchVendors(limit, offset, this.vendor, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    debugger
                    this.vendorInfo = baseResponse.SeedKhadVendor.VendorDetail;

                    this.vendorForm.controls['Name'].setValue(this.vendorInfo.Name);
                    this.vendorForm.controls['Type'].setValue(this.vendorInfo.Type);
                    this.vendorForm.controls['Description'].setValue(this.vendorInfo.Description);
                    this.vendorForm.controls['CircleId'].setValue(this.vendorInfo.CircleId);
                    //this.vendorForm.controls["Lat"].setValue(this.vendorInfo.Lat);
                    this.vendorForm.controls['Location'].setValue(this.vendorInfo.Lat + ' , ' + this.vendorInfo.Lng);
                    //this.vendorForm.controls["Lng"].setValue(this.vendorInfo.Lng);
                    this.vendorForm.controls['PhoneNumber'].setValue(this.vendorInfo.PhoneNumber);
                    this.vendorForm.controls['Address'].setValue(this.vendorInfo.Address);
                    this.vendorForm.controls['File'].setValue(this.vendorInfo.FilePath);
                    //this.onFileChange(this.vendorInfo.FilePath);

                    if (this.vendorForm.controls.Location != undefined || this.vendorForm.controls.Location != null) {
                        this.loc_text = 'Update Location';
                    }

                    this.images = [];
                    this.images.push(this.vendorInfo.FilePath);
                    this.khaadSeedVendor.Id = this.vendorInfo.Id;
                    console.log(this.vendorInfo);
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message);
                }
            });
    }

    //Form Function
    createForm() {
        this.vendorForm = this.fb.group({
            ZoneId: [null],
            BranchCode: [null],
            CircleId: [null],
            Type: [null],
            Name: [null],
            Description: [null],
            File: [null],
            PhoneNumber: [null],
            Location: [null],
            Address: [null]
        });
    }

    prev_map;

    Add() {
        debugger
        const dialogRef = this.dialog.open(AddressLocationComponent, {
            width: '1200px',
            data: {lat: this.lat, lng: this.lng},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            console.log(res);
            this.lat = res.lat;
            this.lng = res.lng;
            var loc = this.lat + ' , ' + this.lng;
            this.loc_text = 'Update Location';
            this.vendorForm.controls['Location'].setValue(loc);
        });
    }

    //File Event

    onFileChange(event) {
        debugger
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            var file = event.target.files[0];

            var Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'png' || Name.toLowerCase() == 'jpeg') {

                    for (let i = 0; i < filesAmount; i++) {

                        this.images = [];
                        var reader = new FileReader();

                        reader.onload = (event: any) => {
                            debugger;
                            this.images = [];
                            this.images.push(event.target.result);

                            this.file = file;
                            this.vendorForm.patchValue({
                                fileSource: this.images
                            });
                        };
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement('Only jpeg, png, jpg files are allowed', 'Only jpeg, png, jpg files are allowed', '99');

                    event.srcElement.value = null;

                    return;
                }
            }

        }
    }


    //Save & Submit Method
    saveSubmit() {
        debugger
        this.khaadSeedVendor = Object.assign(this.khaadSeedVendor, this.vendorForm.value);
        this.khaadSeedVendor.Lat = this.lat;
        this.khaadSeedVendor.Lng = this.lng;

        this.spinner.show();
        this._khaadSeedVendor.addNewVendor(this.khaadSeedVendor, this.file)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                    console.log(baseResponse);
                    this.vendorDetail = baseResponse.SeedKhadVendor.VendorDetail;
                    this.router.navigateByUrl('khaad-seed-vendor/view-list');
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message);
                }
            });

    }

    deleteVendor() {
        this.vendor.Id = this.khaadSeedVendor.Id;

        debugger
        this.spinner.show();
        this._khaadSeedVendor.deleteVendor(this.vendor, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                    this.router.navigateByUrl('khaad-seed-vendor/view-list');
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message);
                }
            });
    }

}

export interface Selection {
    value: string;
    display: string;
}
