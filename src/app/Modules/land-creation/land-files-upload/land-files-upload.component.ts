
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import {UploadDocuments} from '../../../core/auth/_models/upload-documents.model';
import {KtDialogService} from '../../../core/_base/layout';
import {LayoutUtilsService} from '../../../core/_base/crud';
import {LandInfo} from '../../../core/auth/_models/land-info.model';
import {LandService} from '../../../core/auth/_services/land.service';
import {UserUtilsService} from '../../../core/_base/crud/utils/user-utils.service';
import {AppState} from '../../../core/reducers';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'kt-land-files-upload',
  templateUrl: './land-files-upload.component.html',
})
export class LandFilesUploadComponent implements OnInit {

  LandInformationForm: FormGroup;

  public ImageData: any;
  public VideoData: any;
  public ImageFile = [];
  public errorMessage: any;
  Lat: any;
  Lng: any;
  public fileNameProfile: string;
  public ProfileImageSrc: string;
  isFormReadonly: boolean;
  imageSrc: string;

  public LandInfo = new LandInfo();

  public landInfoDatalist: any;

  public uploadDocuments = new UploadDocuments();
  public uploadDocumentsFinal = new UploadDocuments();

  public uploadDocumentsData: UploadDocuments[] = [];

  public uploadDocumentsDataFinal: UploadDocuments[] = [];


  images = [];
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });



  constructor(
    public dialogRef: MatDialogRef<LandFilesUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private layoutUtilsService: LayoutUtilsService,
    private ktDialogService: KtDialogService,
    private _snackBar: MatSnackBar,
    private _landService: LandService,
    private userUtilsService: UserUtilsService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef) { }

  newDynamic: any = {};



  ngOnInit() {

    this.isFormReadonly == false;
    debugger;
    this.LandInfo = this.data.landInfo;
    this.landInfoDatalist = this.data.landInfoDataList;

    if (this.landInfoDatalist != undefined) {

      for (var i = 0; i < this.landInfoDatalist.length; i++) {

        this.uploadDocumentsFinal = new UploadDocuments();
        this.uploadDocuments = new UploadDocuments();


        this.uploadDocumentsFinal.ImageID = this.landInfoDatalist[i].ImageID;
        this.uploadDocumentsFinal.LandInfoId = this.landInfoDatalist[i].LandInfoId;
        this.uploadDocumentsFinal.LandLatitude = this.landInfoDatalist[i].LandLatitude;
        this.uploadDocumentsFinal.LandLongitude = this.landInfoDatalist[i].LandLongitude;
        this.uploadDocumentsFinal.Path = this.landInfoDatalist[i].Path;
        this.uploadDocumentsFinal.TranId = this.landInfoDatalist[i].TranId;


        this.uploadDocuments.ImageID = this.landInfoDatalist[i].ImageID;
        this.uploadDocuments.LandInfoId = this.landInfoDatalist[i].LandInfoId;
        this.uploadDocuments.LandLatitude = this.landInfoDatalist[i].LandLatitude;
        this.uploadDocuments.LandLongitude = this.landInfoDatalist[i].LandLongitude;
        if (this.landInfoDatalist[i].Path != undefined) {
          //

          if (this.landInfoDatalist[i].ImageID == undefined) {
            if (this.landInfoDatalist[i].Path.includes("image/jpeg")) {
              this.uploadDocuments.Path = this.landInfoDatalist[i].Path;
            }
          }
          else {
            if (this.landInfoDatalist[i].Path.includes("jpg")) {
              this.uploadDocuments.Path = this.landInfoDatalist[i].Path;
            }
          }
          



        }

        if (this.landInfoDatalist[i].VideoPath == undefined) {
          //

          if (this.landInfoDatalist[i].ImageID == undefined) {
            if (this.landInfoDatalist[i].Path.includes("video/mp4")) {
              this.uploadDocuments.VideoPath = this.landInfoDatalist[i].Path;
            }
          }
          else {
            if (this.landInfoDatalist[i].Path.includes("mp4")) {
              this.uploadDocuments.VideoPath = this.landInfoDatalist[i].Path;
            }
          }
          



        }
        if (this.landInfoDatalist[i].VideoPath != undefined) {
          this.uploadDocuments.VideoPath = this.landInfoDatalist[i].VideoPath;
        }


        //if (this.landInfoDatalist[i].VideoPath != undefined) {
        //}
        //if (this.landInfoDatalist[i].Path.includes("mp4")) {
        //  this.uploadDocuments.VideoPath = this.landInfoDatalist[i].Path;
        //}
        this.uploadDocuments.TranId = this.landInfoDatalist[i].TranId;

        this.uploadDocumentsDataFinal.push(this.uploadDocumentsFinal);
        this.uploadDocumentsData.push(this.uploadDocuments);

      }
    }

    if (this.LandInfo.Status != undefined && this.LandInfo.Status != '') {

      if (this.LandInfo.Status == '3' || this.LandInfo.Status == '2') {
        this.isFormReadonly = true;
      }
    }


    debugger;
    this._landService.getPosition().then(pos => {

      console.log(`Positon: ${pos.lng} ${pos.lat}`);

      this.Lat = pos.lat;
      this.Lng = pos.lng;
    });

  }


  onFileChange(event) {

    debugger
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {

        this.uploadDocumentsFinal = new UploadDocuments();
        var file = event.target.files[i];

        var Name = file.name.split('.').pop();
        if (Name != undefined) {
          if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "jpeg" || Name.toLowerCase() == "mp4") {

            if (Name.toLowerCase() == "mp4") {
              this.uploadDocumentsFinal.videofile = file;
            }
            else {
              this.uploadDocumentsFinal.file = file;
            }

            this.uploadDocumentsDataFinal.push(this.uploadDocumentsFinal);

            var reader = new FileReader();

            reader.onload = (event: any) => {


              //console.log(event.target.result);
              debugger;
              this.uploadDocuments = new UploadDocuments();

              debugger;
              this.images.push(event.target.result);

              if (Name.toLowerCase() == "mp4") {
                this.uploadDocuments.VideoPath = event.target.result;
                this.uploadDocuments.videofile = file;
              }
              else {
                debugger;
                this.uploadDocuments.Path = event.target.result;
                this.uploadDocuments.file = file;
              }
              debugger;
              this.uploadDocumentsData.push(this.uploadDocuments);

              this.myForm.patchValue({
                fileSource: this.images
              });
            }
            reader.readAsDataURL(event.target.files[i]);
          }
          else {
            this.layoutUtilsService.alertElement("", "Only jpeg,jpg,mp4, files are allowed", "99");

            return;
          }
        }
      }
    }
  }

  private deleteImage(url, Id, i): void {
    debugger
    if (url !== undefined) {

      if (Id == undefined) {
        if (url.includes("image/jpeg") || url.includes("image/jpg")) {
          this.uploadDocuments = this.uploadDocumentsData.filter((d) => d.Path == url)[0];
        }

        if (url.includes("video/mp4")) {
          this.uploadDocuments = this.uploadDocumentsData.filter((d) => d.VideoPath == url)[0];
        }
      }
      else {
        if (url.includes("jpeg") || url.includes("jpg")) {
          this.uploadDocuments = this.uploadDocumentsData.filter((d) => d.Path == url)[0];
        }

        if (url.includes("mp4")) {
          this.uploadDocuments = this.uploadDocumentsData.filter((d) => d.VideoPath == url)[0];
        }
      }

     


      if (this.uploadDocuments.Path !== undefined && this.uploadDocuments.Path !== '') {

        if (this.uploadDocuments.Path.indexOf("http") !== -1) {

          debugger;
          this.DeleteLandData();
          this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.Path !== url);
          this.uploadDocumentsDataFinal.splice(i, 1);
          return
        }
        else {
          debugger;
          this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.Path !== url);
          this.uploadDocumentsDataFinal.splice(i, 1);
          return
        }
      }
      else if (this.uploadDocuments.VideoPath !== undefined && this.uploadDocuments.VideoPath !== '') {
        if (this.uploadDocuments.VideoPath.indexOf("http") !== -1) {

          debugger;
          this.DeleteLandData();
          this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.VideoPath !== url);
          this.uploadDocumentsDataFinal.splice(i, 1);
          return
        }
        else {
          debugger;
          this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.VideoPath !== url);
          this.uploadDocumentsDataFinal.splice(i, 1);
          return
        }
      }
      else {

        debugger;
        this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.Path !== url);
        this.uploadDocumentsDataFinal.splice(i, 1);

        return
      }
    }
    else if (Id != undefined || Id != null) {

      this.uploadDocuments = this.uploadDocumentsData.filter((I) => I.ImageID == Id)[0];
      this.DeleteLandData();
      this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.ImageID !== Id);
      this.uploadDocumentsDataFinal.splice(i, 1);
      return
    }
    else {
      debugger;
      this.uploadDocumentsData = this.uploadDocumentsData.filter((a) => a.Path !== url);
      this.uploadDocumentsDataFinal.splice(i, 1);
    }

  }


  UploadDocuments() {


    console.log(this.myForm.value);
    this.errorMessage = "";
    debugger;
    for (var i = 0; i < this.uploadDocumentsData.length; i++) {

      if (this.uploadDocumentsData[i].Path !== undefined && this.uploadDocumentsData[i].Path !== '') {

        if (this.uploadDocumentsData[i].ImageID == undefined) {

          if (this.uploadDocumentsData[i].Path.includes("image/jpeg")) {
            this.ImageData = this.uploadDocumentsDataFinal[i].file;
            this.VideoData = this.uploadDocumentsDataFinal[i].videofile;
          }
          this.UploadLandData();
        }
      }
      if (this.uploadDocumentsData[i].VideoPath !== undefined && this.uploadDocumentsData[i].VideoPath !== '') {

        if (this.uploadDocumentsData[i].ImageID == undefined) {

          if (this.uploadDocumentsData[i].VideoPath.includes("video/mp4")) {
            this.ImageData = this.uploadDocumentsDataFinal[i].videofile;
            this.VideoData = this.uploadDocumentsDataFinal[i].videofile;
          }

          this.UploadLandData();
        }
      }
    }


    this.onCloseClick();
    this.layoutUtilsService.alertElementSuccess("", "Image/Video will be uploaded in background.", "00");

  }


  get f() {
    return this.myForm.controls;
  }

  getTitle(): string {

    return "Upload Documents";
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.LandInformationForm.controls[controlName].hasError(errorName);
  }


  // Documents Upload



  file: any;
  filesLength: any;
  imageUrl: any;
  videoUrl: any;


  DeleteLandData() {

    debugger;
    this.spinner.show();
    this._landService.landDocumentsDelete(this.uploadDocuments)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        }
      });

  }

  UploadLandData() {
    debugger;
    this.uploadDocuments = new UploadDocuments();
    this.uploadDocuments.LandLatitude = this.Lat;
    this.uploadDocuments.LandLongitude = this.Lng;
    this.uploadDocuments.LandInfoId = this.LandInfo.Id;


    if (this.uploadDocuments.LandLatitude == null || this.uploadDocuments.LandLatitude == undefined || this.uploadDocuments.LandLongitude == null || this.uploadDocuments.LandLongitude == undefined) {

      this.uploadDocuments.LandLatitude = "";
      this.uploadDocuments.LandLongitude = "";
      //this.errorMessage = "Please enable your current location";
      //return;
    }


    if (this.ImageData == undefined && this.VideoData == undefined) {

      this.errorMessage = "Please Atteched documents in allowed format";
      return;
    }


    debugger;
    this.spinner.show();

    this._landService.landDocumentsUpload(this.ImageData, this.VideoData, this.uploadDocuments)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger;
        if (baseResponse.Success) {

        }
        else {
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        }
      });

  }

  CheckImageOrVideo(Url: any) {
    //debugger;
    if (Url != null && Url != undefined && Url != "") {
      if (Url.includes("image/jpeg") || Url.includes("jpg")) {
        return true;
      }
      else if (Url.includes("video/mp4") || Url.includes("mp4")) {
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return
    }
  }


  onCloseClick(): void {
    debugger;
    this.dialogRef.close({ data: { uploadDocumentsData: this.uploadDocumentsData } }); // Keep only this row
  }

}
