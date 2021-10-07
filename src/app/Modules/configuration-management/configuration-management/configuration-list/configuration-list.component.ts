// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
// Material
import {SelectionModel} from '@angular/cdk/collections';
// RXJS
import {finalize} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import {ConfigurationEditComponent} from '../configuration-edit/configuration-edit.component';
import {ConfigurationHistoryComponent} from '../configuration-history/configuration-history.component';
import {MatTableDataSource} from '@angular/material/table';
import {AppState} from '../../../../core/reducers';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LayoutUtilsService, MessageType} from '../../../../core/_base/crud';
import {DocumentTypeModel} from '../../../../core/auth/_models/document-type.model';
import {ConfigurationService} from '../../../../core/auth/_services/configuration.service';
import { Configuration } from 'app/core/auth/_models/configuration.model';

// @ts-ignore
// import {Configuration} from '../../../../core/auth/_models/configuration.model';
// Services

@Component({
  selector: 'kt-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.scss']
})
export class ConfigurationListComponent implements OnInit {

  // Table fields
  dataSource = new MatTableDataSource();
  displayedColumns = ['KeyName', 'KeyValue', 'actions', 'history'];
  configurations: any;
  // Selection
  gridHeight: string;
  loading: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private _configurationService: ConfigurationService,
  ) {
  }

  ngOnInit() {
    this.loadConfigurationPage();
  }


  loadConfigurationsList() {
    this.loading = true;

    this._configurationService.GetConfigurations()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe(baseResponse => {
      if (baseResponse.Success) {
        this.configurations = baseResponse.Configurations;
      } else {
        this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
      }

    });
  }


  loadConfigurationPage() {
    this.loadConfigurationsList();
  }

  DeleteDocumentType(_item: DocumentTypeModel) {
    const _title = 'Document-Type';
    const _description = 'Are you sure to permanently delete this Document-Type?';
    const _waitDesciption = 'Document-Type is deleting...';
    const _deleteMessage = `Document-Type has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }


      this._configurationService.DeleteConfiguration(this.configurations).pipe(
        finalize(() => {

        })
      ).subscribe((x) => {
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadConfigurationsList();
        console.log('output');
        console.log(x);
      });

    });
  }

  addNewConfiguration() {
    const newConfiguration = new Configuration();
      newConfiguration.clear(); // Set all defaults fields
    this.editConfiguration(newConfiguration);
  }

  editConfiguration(configuration: Configuration) {
    const _saveMessage = configuration.KeyID ? 'New Document-Type successfully has been added.' : 'Document-Type successfully has been updated.';
    const _messageType = configuration.KeyID ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ConfigurationEditComponent, {data: {configuration: configuration}, disableClose: true});
    dialogRef.afterClosed().subscribe(res => {
      this.loadConfigurationsList();

      if (!res) {
        return;
      }

      this.loadConfigurationsList();
    });
  }

  historyConfiguration() {
    this.dialog.open(ConfigurationHistoryComponent);
  }

  toggleAccordion(i: number) {
    let down_arrow = document.getElementById('arrow_down_' + i).style.display;
    if (down_arrow == 'block') {
      document.getElementById('arrow_down_' + i).style.display = 'none';
      document.getElementById('arrow_up_' + i).style.display = 'block';
      document.getElementById('table_' + i).style.display = 'block';
    } else {
      document.getElementById('arrow_up_' + i).style.display = 'none';
      document.getElementById('arrow_down_' + i).style.display = 'block';
      document.getElementById('table_' + i).style.display = 'none';

    }

  }
}
