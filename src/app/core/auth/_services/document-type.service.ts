
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity } from '../_models/activity.model';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { BaseRequestModel } from '../../_base/crud/models/_base.request.model';
import { User } from '../_models/user.model';
import { HttpUtilsService } from '../../_base/crud';
import { DocumentTypeModel } from '../_models/document-type.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  public request = new BaseRequestModel();
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


  AddDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.DocumentType = documentType;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Document/AddDocumentType`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  UpdateDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.DocumentType = documentType;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Document/UpdateDocumentType`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  DeleteDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
    this.request = new BaseRequestModel();
    this.request.DocumentType = documentType;
    var req = JSON.stringify(this.request);
    return this.http.post(`${environment.apiUrl}/Document/DeleteDocumentType`, req,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }

  GetDocumentTypes(): Observable<BaseResponseModel> {
    return this.http.post(`${environment.apiUrl}/Document/GetDocumentTypes`,
      { headers: this.httpUtils.getHTTPHeaders() }).pipe(
        map((res: BaseResponseModel) => res)
      );
  }
}
