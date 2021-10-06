// Angular
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
//import { ExcelUtilsService } from '../../../../../core/_base/crud/utils/ec';
// Models
import { RoleDeleted } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { ProfileFormDialogComponent } from '../profile-edit/profile-form.dialog.component';
import { Profile } from '../../../../../core/auth/_models/profile.model';
import { ProfileService } from '../../../../../core/auth/_services/profile.service';
import { ProfileDataSource } from '../../../../../core/auth/_data-sources/profile.datasource';
import { BaseResponseModel } from '../../../../../core/_base/crud/models/_base.response.model';
//import { DefaultDatatableColumnModel } from '../../../../../core/_base/crud/models/_';

@Component({
  selector: 'kt-profile-list',
  templateUrl: './profile-list.component.html',
  styles: []
})
export class ProfileListComponent implements OnInit {

  displayedColumns = ['profileName', 'profileDescription', 'actions'];
  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  selection = new SelectionModel<Profile>(true, []);
  profilesResult: Profile[] = [];
  public profile = new Profile();
  //tempExportProfiles: ExportProfileModel[] = [];
  //exportProfiles: ExportProfileModel[] = [];
  gridHeight: string;
  //columnWidths: DefaultDatatableColumnModel = new DefaultDatatableColumnModel();

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private _profileService: ProfileService) { }

  ngOnInit() {
    this.loadProfileList();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 390 + 'px';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }




  loadProfileList() {
    this.loading = true;
    this._profileService.getAllProfiles()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success)
          this.dataSource.data = baseResponse.Profiles;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }




  loadProfilesPage() {
    this.loadProfileList();
  }


  exportToExcel() {
    //this.exportProfiles = [];
    //Object.assign(this.tempExportProfiles, this.dataSource.data);
    //this.tempExportProfiles.forEach((o, i) => {
    //  this.exportProfiles.push({
    //    profileName: o.profileName,
    //    profileDescription: o.profileDescription
    //  });
    //});
    //this.excelService.exportAsExcelFile(this.exportProfiles, 'profiles');

    //this.auditService.create(PagesEnum.profilesUrl, 'Export Profiles', AE.Export, true);
  }




	/**
	 * Returns object for filter
	 */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.title = searchText;
    return filter;
  }

  deleteProfile(_item: Profile) {
    const _title = 'Profile';
    const _description = 'Are you sure to permanently delete this profile?';
    const _waitDesciption = 'Profile is deleting...';
    const _deleteMessage = `Profile has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.profile = new Profile();
      this.profile.ProfileID = _item.ProfileID;

      this._profileService.deleteProfile(this.profile).pipe(
        finalize(() => {

        })
      )
        .subscribe((baseResponse: BaseResponseModel) => {

          debugger;
          console.log('base response');
          console.log(baseResponse);

          if (baseResponse.Success === true) {
            this.layoutUtilsService.showActionNotification(baseResponse.Message, MessageType.Delete);
            this.loadProfilesPage();
            console.log('output');
          }
          else {
            const message = `An error occure.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
          }

        });
    });
  }

  addProfile() {
    const newProfile = new Profile();
    //newRole.clear(); // Set all defaults fields
    this.editProfile(newProfile);
  }


  editProfile(profile: Profile) {
    console.log('windows inner width= ' + window.innerWidth);
    console.log('windows inner height= ' + window.innerHeight);
    var width = (window.innerWidth - 200) + 'px';
    var height = (window.innerHeight - 140) + 'px';
    console.info(width);
    console.info(height);
    const dialogRef = this.dialog.open(ProfileFormDialogComponent, { height: height, width: width, data: { profile: profile }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.loadProfilesPage();
    });
  }

}
