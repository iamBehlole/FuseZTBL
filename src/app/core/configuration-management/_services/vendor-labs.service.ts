import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseResponseModel } from '../../_base/crud/models/_base.response.model';
import { VendorLabModel } from '../_models/vendor-labs.model';
import { HttpUtilsService } from '../../_base/crud';


@Injectable({ providedIn: 'root' })
export class VendorLabService {	

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateVendorLab(vendorLab: VendorLabModel): Observable<BaseResponseModel> {
		//vendorLab.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/UpdateVendorLab`, vendorLab,			
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	createVendorLab(vendorLab: VendorLabModel): Observable<BaseResponseModel> {
		//vendorLab.userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/AddVendorLab`, vendorLab,
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);		
	}

	deleteVendorLab(id): Observable<BaseResponseModel> {
		var userInfo = this.httpUtils.getUserInfo();
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/DeleteVendorLab`,
			{
				userInfo: userInfo,
				vendorLabID:id
			},
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
				map((res: BaseResponseModel) => res)
			);
	}

	getAllVendorLabs(vendorID: number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3)
		: Observable<BaseResponseModel> {
		return this.http.post(`${environment.apiUrl}/ConfigurationManagment/GetVendorLabss`,
			{ userInfo: this.httpUtils.getUserInfo(), vendorLabID: "0", channel: "1" },
			{ headers: this.httpUtils.getHTTPHeaders() }).pipe(
			map((res: BaseResponseModel) => res)
		);
	}

}
