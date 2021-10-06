
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
// RXJS
import { finalize } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { DocumentTypeModel } from '../../../../core/auth/_models/document-type.model';
import { DocumentTypeService } from '../../../../core/auth/_services/document-type.service';
import { DocumentTypeEditComponent } from '../document-type-edit/document-type-edit.component';
// Services

@Component({
  selector: 'kt-document-type-list',
  templateUrl: './document-type-list.component.html'
})
export class DocumentTypeListComponent implements OnInit, OnDestroy {

  // Table fields
  dataSource = new MatTableDataSource();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading: boolean;
  displayedColumns = ['Name', 'NoOfPages', 'actions'];

  // Selection

  gridHeight: string;
  public documentType = new DocumentTypeModel();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    //private excelService: ExcelUtilsService,
    //private auditService: AuditTrailService,
    private _documentTypeService: DocumentTypeService) {
  }

  ngOnInit() {
    this.loadDocumentTypePage();
  }

  loadDocumentTypeList() {
    this.loading = true;

    this._documentTypeService.GetDocumentTypes()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success)
          this.dataSource.data = baseResponse.DocumentTypes;
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridHeight = window.innerHeight - 400 + 'px';
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  loadDocumentTypePage() {
    this.loadDocumentTypeList();
  }

  exportToExcel() {
    //this.exportActivities = [];
    //Object.assign(this.tempExportActivities, this.dataSource.data);
    //this.tempExportActivities.forEach((o, i) => {
    //  this.exportActivities.push({
    //    activityName: o.activityName,
    //    activityURL: o.activityURL,
    //    parentActivityName: o.parentActivityName
    //  });
    //});
    //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.title = searchText;
    return filter;
  }



  ngOnDestroy() {
    //this.subscriptions.forEach(el => el.unsubscribe());
  }




  DeleteDocumentType(_item: DocumentTypeModel) {
    const _title = 'Document-Type';
    const _description = 'Are you sure you want to delete selected Documt-Type ?';
    const _waitDesciption = 'Document-Type is deleting...';
    const _deleteMessage = `Document-Type has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.documentType = new DocumentTypeModel();
      this.documentType.Id = _item.Id;;

      this._documentTypeService.DeleteDocumentType(this.documentType).pipe(
        finalize(() => {

        })
      ).subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          this.loadDocumentTypePage();
        }
          
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
    });
  }







  addDocumentType() {
    const newDocumentType = new DocumentTypeModel();
    newDocumentType.clear(); // Set all defaults fields
    this.editDocuemtnType(newDocumentType);
  }

  editDocuemtnType(docuemtnType: DocumentTypeModel) {


    debugger;
    const _saveMessage = docuemtnType.Id ? 'New Document-Type successfully has been added.' : 'Document-Type successfully has been updated.';
    const _messageType = docuemtnType.Id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DocumentTypeEditComponent, { data: { docuemtnType: docuemtnType }, disableClose: true });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      }

      this.loadDocumentTypeList();
    });
  }

  /** Fetch */
	/**
	 * Fetch selected rows
	 */
  //fetchActivities() {
  //	const messages = [];
  //	this.selection.selected.forEach(elem => {
  //		messages.push({
  //			text: `${elem.title}`,
  //			id: elem.id.toString(),
  //			// status: elem.username
  //		});
  //	});
  //	this.layoutUtilsService.fetchElements(messages);
  //}

	/**
	 * Add role
	 */
  //addRole() {
  //	const newRole = new Role();
  //	newRole.clear(); // Set all defaults fields
  //	this.editRole(newRole);
  //}

	/**
	 * Edit role
	 *
	 * @param role: Role
	 */
  //editRole(role: Role) {
  //	const _saveMessage = `Role successfully has been saved.`;
  //	const _messageType = role.id ? MessageType.Update : MessageType.Create;
  //	const dialogRef = this.dialog.open(RoleEditDialogComponent, { data: { roleId: role.id } });
  //	dialogRef.afterClosed().subscribe(res => {
  //		if (!res) {
  //			return;
  //		}

  //		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
  //		this.loadActivitiesList();
  //	});
  //}

	/**
	 * Check all rows are selected
	 */

	/**
	 * Toggle selection
	 */

}
